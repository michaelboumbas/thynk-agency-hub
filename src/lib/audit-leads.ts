import { supabase } from "@/integrations/supabase/client";

/**
 * Audit requests from the site (12/10/2026, Mike: «option 3»).
 * Every request goes two ways at the same time:
 *   1. our database (Lovable Cloud, table public.audit_requests): the copy we own, so no lead is ever lost.
 *      Visitors may only INSERT (RLS + column grants); they can never read the table.
 *      A trigger refuses more than 3 requests per email in 10 minutes and more than 20 per minute overall.
 *   2. HubSpot (portal THYNK Digital Agency, form «Website · Audit request (thynkagency.gr)»):
 *      creates the contact as a Lead and sends the submission notification email.
 * The request counts as received when at least one of the two accepts it.
 */
const HUBSPOT_PORTAL_ID = "149314886";
const HUBSPOT_FORM_ID = "46675174-24d4-4bd3-a47d-e612f563898e";
const HUBSPOT_ENDPOINT = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

export type AuditRequest = {
  first: string;
  last: string;
  email: string;
  phone: string;
  biz: string;
  industry: string;
  focus: string;
  lang: "en" | "el";
  /** the consent sentence exactly as the visitor saw it */
  consentText: string;
};

export type AuditResult = { ok: boolean; db: boolean; hubspot: boolean };

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

function hubspotCookie(): string | undefined {
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m?.[1];
}

async function saveToDatabase(r: AuditRequest): Promise<boolean> {
  const { error } = await supabase.from("audit_requests").insert({
    first_name: r.first.trim(),
    last_name: r.last.trim(),
    email: r.email.trim(),
    phone: r.phone.trim() || null,
    company: r.biz.trim(),
    industry: r.industry || null,
    focus: r.focus || null,
    lang: r.lang,
    page: window.location.pathname.slice(0, 200),
    consent: true,
    consent_text: r.consentText.slice(0, 600),
  });
  if (error) console.warn("[audit] database:", error.message);
  return !error;
}

async function sendToHubSpot(r: AuditRequest): Promise<boolean> {
  const message = [
    `Audit request (thynkagency.gr)`,
    `Industry: ${r.industry || "-"}`,
    `Look at first: ${r.focus || "-"}`,
    `Language: ${r.lang === "el" ? "Greek" : "English"}`,
    `Page: ${window.location.pathname}`,
  ].join("\n");
  const hutk = hubspotCookie();
  const body = {
    fields: [
      { objectTypeId: "0-1", name: "firstname", value: r.first.trim() },
      { objectTypeId: "0-1", name: "lastname", value: r.last.trim() },
      { objectTypeId: "0-1", name: "email", value: r.email.trim() },
      { objectTypeId: "0-1", name: "phone", value: r.phone.trim() },
      { objectTypeId: "0-1", name: "company", value: r.biz.trim() },
      { objectTypeId: "0-1", name: "message", value: message },
    ],
    context: {
      pageUri: window.location.href.split("?")[0],
      pageName: document.title,
      ...(hutk ? { hutk } : {}),
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: r.consentText,
      },
    },
  };
  const res = await fetch(HUBSPOT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.warn("[audit] hubspot:", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function submitAuditRequest(r: AuditRequest): Promise<AuditResult> {
  const [db, hs] = await Promise.allSettled([
    withTimeout(saveToDatabase(r), 12000),
    withTimeout(sendToHubSpot(r), 12000),
  ]);
  const dbOk = db.status === "fulfilled" && db.value;
  const hsOk = hs.status === "fulfilled" && hs.value;
  return { ok: dbOk || hsOk, db: dbOk, hubspot: hsOk };
}
