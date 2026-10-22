import { supabase } from "@/integrations/supabase/client";

/**
 * Newsletter / updates sign-ups (22/10/2026, Mike). Same pattern as the audit form (src/lib/audit-leads.ts):
 *   1. our database (table public.newsletter_subscribers), through the server route /api/public/newsletter,
 *      which also sends the confirmation email to new subscribers (Lovable app emails, replies to hello@).
 *      If that route can't be reached, the row is saved directly from the browser (visitors may only INSERT,
 *      never read), without the email. A repeat sign-up with the same email refreshes the existing row
 *      (trigger), so the list has no duplicates and no second email; more than 20 sign-ups a minute are refused.
 *   2. HubSpot (form «Website · Newsletter (thynkagency.gr)», lifecycle stage Subscriber), once the form exists.
 *      HubSpot only accepts submissions from thynkagency.gr. Empty form id → database only.
 * The sign-up counts as received when at least one of the two accepts it.
 */
const HUBSPOT_PORTAL_ID = "149314886";
const HUBSPOT_FORM_ID = "";

export type NewsletterSource = "footer" | "popup";
export type Signup = { email: string; lang: "en" | "el"; source: NewsletterSource; consentText: string };
export type SignupResult = { ok: boolean; db: boolean; hubspot: boolean };

/** browser memory (functional only): signed up → never show the window again; closed → not for 30 days */
export const NL_DONE_KEY = "thynk:newsletter";
export const NL_CLOSED_KEY = "thynk:newsletter-closed";
/** fired after a successful sign-up, so the other form (footer / window) knows too */
export const NL_EVENT = "thynk:newsletter";

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

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

async function saveToDatabase(s: Signup): Promise<boolean> {
  try {
    const res = await fetch("/api/public/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: s.email.trim(),
        lang: s.lang,
        source: s.source,
        page: window.location.pathname.slice(0, 200),
        consentText: s.consentText.slice(0, 600),
      }),
    });
    if (res.ok) return true;
    // a bad address or too many sign-ups: a direct save would be refused the same way
    if (res.status === 400 || res.status === 429) return false;
  } catch {
    /* the route is unreachable: save directly below */
  }
  // fallback (e.g. a deployment without the route): save the row directly, no confirmation email
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: s.email.trim(),
    lang: s.lang,
    source: s.source,
    page: window.location.pathname.slice(0, 200),
    consent: true,
    consent_text: s.consentText.slice(0, 600),
  });
  if (error) console.warn("[newsletter] database:", error.message);
  return !error;
}

async function sendToHubSpot(s: Signup): Promise<boolean> {
  if (!HUBSPOT_FORM_ID) return false;
  const hutk = hubspotCookie();
  const res = await fetch(
    `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [{ objectTypeId: "0-1", name: "email", value: s.email.trim() }],
        context: {
          pageUri: window.location.href.split("?")[0],
          pageName: document.title,
          ...(hutk ? { hutk } : {}),
        },
        legalConsentOptions: { consent: { consentToProcess: true, text: s.consentText } },
      }),
    },
  );
  if (!res.ok) console.warn("[newsletter] hubspot:", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function subscribe(s: Signup): Promise<SignupResult> {
  const [db, hs] = await Promise.allSettled([
    withTimeout(saveToDatabase(s), 12000),
    withTimeout(sendToHubSpot(s), 12000),
  ]);
  const dbOk = db.status === "fulfilled" && db.value;
  const hsOk = hs.status === "fulfilled" && hs.value;
  const ok = dbOk || hsOk;
  if (ok) {
    try {
      window.localStorage.setItem(NL_DONE_KEY, "1");
    } catch {
      /* storage blocked: the window may show again on a later visit, nothing breaks */
    }
    window.dispatchEvent(new CustomEvent(NL_EVENT));
  }
  return { ok, db: dbOk, hubspot: hsOk };
}
