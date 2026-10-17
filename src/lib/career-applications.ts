import { supabase } from "@/integrations/supabase/client";
import type { Engagement } from "@/content/careers-v14";

/**
 * Careers applications (17/10/2026, Mike). Same pattern as the audit form (src/lib/audit-leads.ts):
 *   0. the CV (required): uploaded first to the private bucket «career-cvs» (PDF, ≤ 10 MB).
 *      Visitors may only upload, under applications/<random uuid>.pdf; they can never list or read files.
 *   1. our database (table public.career_applications): visitors may only INSERT, never read.
 *      A trigger refuses more than 3 applications per email in 10 minutes and more than 20 per minute overall.
 *   2. HubSpot (form «Website · Careers application (thynkagency.gr)»): sends the email notification.
 *      The candidate becomes a contact, not a Lead. HubSpot only accepts submissions from thynkagency.gr.
 * The application counts as received when the CV uploaded and at least one of 1 and 2 accepted it.
 * Applications and CVs are kept for 12 months (privacy policy).
 */
const HUBSPOT_PORTAL_ID = "149314886";
/** HubSpot form «Website · Careers application (thynkagency.gr)», created 17/10 (clone of the audit form,
 *  lifecycle stage «Other», notifications to mboumpas@ + hello@). Empty → database only. */
const HUBSPOT_FORM_ID = "48939679-efc3-49e8-b1a5-0067d5436d21";
const CV_BUCKET = "career-cvs";

export type CareerApplication = {
  first: string;
  last: string;
  email: string;
  phone: string;
  /** the area in English, whatever the page language, so the records read the same */
  area: string;
  engagement: Engagement;
  portfolio: string;
  linkedin: string;
  message: string;
  /** required (Mike 17/10) */
  cv: File;
  lang: "en" | "el";
  consentText: string;
};

export type CareerResult = { ok: boolean; db: boolean; hubspot: boolean; cv: boolean };

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e: unknown) => {
        window.clearTimeout(t);
        reject(e);
      },
    );
  });
}

const orNull = (s: string, max: number) => (s.trim() ? s.trim().slice(0, max) : null);

function hubspotCookie(): string | undefined {
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m?.[1];
}

/** uploads the CV and returns its path in the bucket, or null when the upload failed */
async function uploadCv(file: File): Promise<string | null> {
  const path = `applications/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from(CV_BUCKET).upload(path, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) {
    console.warn("[careers] cv:", error.message);
    return null;
  }
  return path;
}

async function saveToDatabase(r: CareerApplication, cvPath: string): Promise<boolean> {
  const { error } = await supabase.from("career_applications").insert({
    first_name: r.first.trim().slice(0, 80),
    last_name: r.last.trim().slice(0, 80),
    email: r.email.trim(),
    phone: r.phone.trim().slice(0, 40), // required (Mike 17/10)
    area: r.area.slice(0, 80),
    engagement: r.engagement,
    portfolio_url: orNull(r.portfolio, 400),
    linkedin_url: orNull(r.linkedin, 400),
    cv_path: cvPath,
    cv_name: r.cv.name.slice(0, 200),
    message: orNull(r.message, 2000),
    lang: r.lang,
    page: window.location.pathname.slice(0, 200),
    consent: true,
    consent_text: r.consentText.slice(0, 600),
  });
  if (error) console.warn("[careers] database:", error.message);
  return !error;
}

async function sendToHubSpot(r: CareerApplication, cvPath: string): Promise<boolean> {
  if (!HUBSPOT_FORM_ID) return false;
  const message = [
    `Careers application (thynkagency.gr)`,
    `Area: ${r.area}`,
    `Collaboration: ${r.engagement}`,
    `Portfolio: ${r.portfolio.trim() || "-"}`,
    `LinkedIn: ${r.linkedin.trim() || "-"}`,
    `CV: ${r.cv.name} · Lovable Cloud → Storage → ${CV_BUCKET}/${cvPath}`,
    `Language: ${r.lang === "el" ? "Greek" : "English"}`,
    ``,
    r.message.trim() || "(no message)",
  ].join("\n");
  const hutk = hubspotCookie();
  const body = {
    fields: [
      { objectTypeId: "0-1", name: "firstname", value: r.first.trim() },
      { objectTypeId: "0-1", name: "lastname", value: r.last.trim() },
      { objectTypeId: "0-1", name: "email", value: r.email.trim() },
      { objectTypeId: "0-1", name: "phone", value: r.phone.trim() },
      { objectTypeId: "0-1", name: "message", value: message.slice(0, 5000) },
    ],
    context: {
      pageUri: window.location.href.split("?")[0],
      pageName: document.title,
      ...(hutk ? { hutk } : {}),
    },
    legalConsentOptions: {
      consent: { consentToProcess: true, text: r.consentText },
    },
  };
  const res = await fetch(
    `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) console.warn("[careers] hubspot:", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function submitCareerApplication(r: CareerApplication): Promise<CareerResult> {
  // up to 10 MB: give slow mobile connections time (90 s)
  const cvPath = await withTimeout(uploadCv(r.cv), 90000).catch(() => null);
  // the CV did not arrive: stop, so the candidate can try again or email it
  if (!cvPath) return { ok: false, db: false, hubspot: false, cv: false };
  const [db, hs] = await Promise.allSettled([
    withTimeout(saveToDatabase(r, cvPath), 12000),
    withTimeout(sendToHubSpot(r, cvPath), 12000),
  ]);
  const dbOk = db.status === "fulfilled" && db.value;
  const hsOk = hs.status === "fulfilled" && hs.value;
  return { ok: dbOk || hsOk, db: dbOk, hubspot: hsOk, cv: true };
}
