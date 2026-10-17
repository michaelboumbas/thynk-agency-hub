import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "./i18n";
import { Label, PageHead } from "./shared";
import { v14Routes } from "@/content/site-v14";
import { careersCopy, CV_MAX_BYTES, type Engagement } from "@/content/careers-v14";
import { submitCareerApplication } from "@/lib/career-applications";

/**
 * Careers (17/10/2026, Mike): /careers and /el/careers. Open applications: the areas we work with,
 * then the application form (links and/or a PDF CV). Same layout as the audit booking (.t14-book-stack).
 * Copy: src/content/careers-v14.ts · sending: src/lib/career-applications.ts.
 */

const ENGAGEMENTS: Engagement[] = ["freelance", "part-time", "full-time"];
const OTHER = "__other";

/** "linkedin.com/in/x" → "https://linkedin.com/in/x"; empty stays empty */
function normalizeUrl(v: string) {
  const s = v.trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}
const looksLikeUrl = (s: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(s);

type TextKey = "first" | "last" | "email" | "phone" | "portfolio" | "linkedin";

function CareerForm() {
  const { lang, href } = useCopy();
  const f = careersCopy[lang].form;
  const id = "careers";
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", area: "", portfolio: "", linkedin: "", message: "" });
  const [engagement, setEngagement] = useState<Engagement | "">("");
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trap, setTrap] = useState("");
  const shownAt = useRef(Date.now());
  const fileRef = useRef<HTMLInputElement>(null);

  const pickCv = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    const err = !isPdf ? f.cv.errorType : file.size > CV_MAX_BYTES ? f.cv.errorSize : "";
    setErrors((x) => ({ ...x, cv: err, material: "" }));
    if (err) {
      e.target.value = "";
      setCv(null);
      return;
    }
    setCv(file);
  };
  const removeCv = () => {
    setCv(null);
    if (fileRef.current) fileRef.current.value = "";
    fileRef.current?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const portfolio = normalizeUrl(form.portfolio);
    const linkedin = normalizeUrl(form.linkedin);
    setForm((x) => ({ ...x, portfolio, linkedin }));
    const errs: Record<string, string> = {};
    if (!form.first.trim()) errs.first = f.first.error;
    if (!form.last.trim()) errs.last = f.last.error;
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = f.email.error;
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 10) errs.phone = f.phone.error;
    if (!form.area) errs.area = f.area.error;
    if (!engagement) errs.engagement = f.engagement.error;
    if (portfolio && !looksLikeUrl(portfolio)) errs.portfolio = f.portfolio.error;
    if (linkedin && !looksLikeUrl(linkedin)) errs.linkedin = f.linkedin.error;
    if (!cv && !portfolio && !linkedin) errs.material = f.material;
    if (!consent) errs.consent = f.consentError;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      const target =
        first === "engagement" ? `${id}-engagement-0` : first === "material" ? `${id}-cv` : `${id}-${first}`;
      document.getElementById(target)?.focus();
      return;
    }
    if (state === "sending") return;
    // a bot: the hidden field is filled in, or the form was sent within 3 seconds of appearing
    if (trap || Date.now() - shownAt.current < 3000) {
      setState("sent");
      return;
    }
    setState("sending");
    const areaIndex = careersCopy[lang].areas.indexOf(form.area);
    submitCareerApplication({
      first: form.first,
      last: form.last,
      email: form.email,
      phone: form.phone,
      area: areaIndex >= 0 ? careersCopy.en.areas[areaIndex] : "Other",
      engagement: engagement as Engagement,
      portfolio,
      linkedin,
      message: form.message,
      cv,
      lang,
      consentText: `${f.consentA} ${f.consentLink}${f.consentB}`,
    })
      .then((r) => setState(r.ok ? "sent" : "error"))
      .catch(() => setState("error"));
  };

  const field = (k: TextKey, type: string, auto: string, optional = false) => {
    const c = f[k];
    return (
      <div className="t14-f">
        <label htmlFor={`${id}-${k}`}>
          {c.label}
          {optional && <em className="t14-opt"> · {f.optional}</em>}
        </label>
        <input
          id={`${id}-${k}`}
          type={type}
          autoComplete={auto}
          inputMode={type === "url" ? "url" : undefined}
          placeholder={c.placeholder}
          value={form[k]}
          aria-invalid={!!errors[k]}
          aria-describedby={`${id}-${k}-e`}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
        <span className="t14-err" id={`${id}-${k}-e`}>{errors[k] ?? ""}</span>
      </div>
    );
  };

  const sizeMb = cv ? (cv.size / (1024 * 1024)).toFixed(1) : "";

  return (
    <form className="t14-form" onSubmit={submit} noValidate>
      <div className="t14-form-head">
        <h2>{f.title}</h2>
        <p>{f.lead}</p>
      </div>
      <div className="t14-fgrid">
        {field("first", "text", "given-name")}
        {field("last", "text", "family-name")}
        {field("email", "email", "email")}
        {field("phone", "tel", "tel", true)}
        <div className="t14-f t14-f-wide">
          <label htmlFor={`${id}-area`}>{f.area.label}</label>
          <select
            id={`${id}-area`}
            value={form.area}
            aria-invalid={!!errors.area}
            aria-describedby={`${id}-area-e`}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          >
            <option value="">{f.area.placeholder}</option>
            {careersCopy[lang].areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value={OTHER}>{f.area.other}</option>
          </select>
          <span className="t14-err" id={`${id}-area-e`}>{errors.area ?? ""}</span>
        </div>
        <div className="t14-f t14-f-wide">
          <span className="t14-flabel" id={`${id}-engagement-l`}>{f.engagement.label}</span>
          <div className="t14-tasks t14-pains" role="radiogroup" aria-labelledby={`${id}-engagement-l`}>
            {ENGAGEMENTS.map((g, i) => (
              <label key={g} className={engagement === g ? "on" : undefined}>
                <input
                  id={`${id}-engagement-${i}`}
                  type="radio"
                  name={`${id}-engagement`}
                  value={g}
                  checked={engagement === g}
                  aria-invalid={!!errors.engagement}
                  onChange={() => setEngagement(g)}
                />
                {f.engagement.options[g]}
              </label>
            ))}
          </div>
          <span className="t14-err" role="alert">{errors.engagement ?? ""}</span>
        </div>
        {field("portfolio", "url", "url", true)}
        {field("linkedin", "url", "url", true)}

        {/* the CV: a PDF up to 5 MB, uploaded only when the form is sent */}
        <div className="t14-f-wide t14-cr-cv">
          <span className="t14-flabel" id={`${id}-cv-l`}>
            {f.cv.label}
            <em className="t14-opt"> · {f.optional}</em>
          </span>
          <div className={`t14-cr-file${cv ? " has" : ""}${errors.cv || errors.material ? " bad" : ""}`}>
            <input
              ref={fileRef}
              id={`${id}-cv`}
              className="t14-cr-file-input"
              type="file"
              accept="application/pdf,.pdf"
              aria-labelledby={`${id}-cv-l ${id}-cv-b`}
              aria-describedby={`${id}-cv-e`}
              aria-invalid={!!(errors.cv || errors.material)}
              onChange={pickCv}
            />
            {cv ? (
              <div className="t14-cr-file-chosen">
                <span className="t14-cr-file-name">{cv.name}</span>
                <small>{sizeMb} MB</small>
                <button type="button" className="t14-cr-file-x" onClick={removeCv}>{f.cv.remove}</button>
              </div>
            ) : (
              <label htmlFor={`${id}-cv`} className="t14-cr-file-btn" id={`${id}-cv-b`}>
                <span aria-hidden="true" className="t14-cr-file-ico">↑</span>
                <span>{f.cv.choose}</span>
                <small>{f.cv.hint}</small>
              </label>
            )}
          </div>
          <span className="t14-err" id={`${id}-cv-e`} role="alert">{errors.cv || errors.material || ""}</span>
        </div>

        <div className="t14-f t14-f-wide">
          <label htmlFor={`${id}-message`}>
            {f.message.label}
            <em className="t14-opt"> · {f.optional}</em>
          </label>
          <textarea
            id={`${id}-message`}
            rows={5}
            maxLength={2000}
            placeholder={f.message.placeholder}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
      </div>

      <div className="t14-consent">
        <label htmlFor={`${id}-consent`}>
          <input
            id={`${id}-consent`}
            type="checkbox"
            checked={consent}
            aria-invalid={!!errors.consent}
            aria-describedby={`${id}-consent-e`}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {f.consentA}{" "}
            <Link to={href(v14Routes.privacy)} target="_blank">{f.consentLink}</Link>
            {f.consentB}
          </span>
        </label>
        <span className="t14-err" id={`${id}-consent-e`}>{errors.consent ?? ""}</span>
      </div>
      {/* anti-spam: off-screen, out of the tab order, hidden from screen readers */}
      <div className="t14-trap" aria-hidden="true">
        <label htmlFor={`${id}-website`}>{f.trap}</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>
      <div className="t14-form-foot">
        <button className="t14-pill lg" type="submit" disabled={state === "sending" || state === "sent"} aria-busy={state === "sending"}>
          {state === "sending" ? f.sending : f.submit}
        </button>
        {state === "sent" && <div className="t14-ok" role="status">{f.sent}</div>}
        {state === "error" && <div className="t14-ok t14-fail" role="alert">{f.error}</div>}
      </div>
    </form>
  );
}

export function CareersPage() {
  const { lang } = useCopy();
  const p = careersCopy[lang];
  return (
    <>
      <PageHead p={p.head} />

      <section className="t14-wrap t14-cr-areas" aria-label={p.areasLabel}>
        <Label>{p.areasLabel}</Label>
        <ol className="t14-cr-list">
          {p.areas.map((a, i) => (
            <li key={a}>
              <span className="t14-cr-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="t14-cr-name">{a}</span>
            </li>
          ))}
        </ol>
        <p className="t14-cr-note">{p.areasNote}</p>
      </section>

      <section className="t14-book t14-book-stack t14-wrap" id="apply">
        <div className="t14-book-side">
          <h2>{p.side.title}</h2>
          <p>{p.side.text}</p>
          <ol>
            {p.side.steps.map((st, i) => (
              <li key={st}><span>0{i + 1}</span>{st}</li>
            ))}
          </ol>
          <p className="t14-book-mail">
            {p.side.mail} <a href="mailto:hello@thynkagency.gr">hello@thynkagency.gr</a>
          </p>
        </div>
        <CareerForm />
      </section>
    </>
  );
}
