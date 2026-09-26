import { useState, type FormEvent } from "react";
import { about, contact, method, solutions } from "@/content/site-v5";

export function AboutView() {
  return (
    <>
      <span className="t5-mono t5-kicker">About</span>
      <h2>{about.headline}</h2>
      {about.body.map((p) => (
        <p key={p.slice(0, 20)}>{p}</p>
      ))}
      <div className="t5-hr" />
      <div className="t5-grid2">
        {about.founders.map((f) => (
          <div key={f.name} className="t5-card t5-founder">
            <div className="t5-av">{f.initials}</div>
            <div>
              <h3>{f.name}</h3>
              <p>{f.bio}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="t5-signoff">{about.signoff}</p>
    </>
  );
}

export function SolutionsView() {
  const [open, setOpen] = useState<string[]>([solutions.pillars[0].id]);
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <>
      <span className="t5-mono t5-kicker">Solutions</span>
      <h2>{solutions.headline}</h2>
      <p>{solutions.intro}</p>
      {solutions.pillars.map((p) => {
        const isOpen = open.includes(p.id);
        return (
          <div key={p.id} className={`t5-pillar${isOpen ? " open" : ""}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => toggle(p.id)}>
              <span className="t5-pdot" />
              <span className="t5-ptitle">
                <span className="t5-mono">{p.tag}</span>
                <strong>{p.title}</strong>
                <span>{p.sub}</span>
              </span>
              <span className="t5-chev">+</span>
            </button>
            <div className="t5-pbody">
              <div>
                <div className="t5-pgroups">
                  {p.groups.map((g) => (
                    <div key={g.title}>
                      <span className="t5-mono">{g.title}</span>
                      <ul>
                        {g.items.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                        {"note" in g && g.note ? <li className="no">{g.note}</li> : null}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function MethodView() {
  return (
    <>
      <span className="t5-mono t5-kicker">Method</span>
      <h2>{method.headline}</h2>
      <p>{method.intro}</p>
      <div className="t5-steps">
        {method.steps.map((s) => (
          <div key={s.n} className="t5-card t5-step">
            <div className="t5-n">{s.n}</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="t5-meta">
                {s.chips.map((c) => (
                  <span key={c} className="t5-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="t5-hr" />
      <h3 className="t5-h3big">{method.rulesTitle}</h3>
      <div className="t5-rules">
        {method.rules.map((r) => (
          <div key={r.title} className="t5-card">
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
      <div className="t5-hr" />
      <h3 className="t5-h3big">{method.faqTitle}</h3>
      {method.faq.map((f) => (
        <details key={f.q} className="t5-faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </>
  );
}

function CopyRow({ label, email }: { label: string; email: string }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard
      ?.writeText(email)
      .then(() => {
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      })
      .catch(() => undefined);
  };
  return (
    <div className="t5-crow">
      <div>
        <small>{label}</small>
        <span>{email}</span>
      </div>
      <button type="button" className="t5-copy" onClick={copy}>
        {done ? "Αντιγράφηκε" : "Αντιγραφή"}
      </button>
    </div>
  );
}

export function ContactView() {
  const [note, setNote] = useState<{ text: string; ok: boolean } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const em = e.currentTarget.querySelector<HTMLInputElement>("#d-email");
    if (!em || !em.value || !em.checkValidity()) {
      setNote({ text: "Χρειαζόμαστε ένα έγκυρο email για να σου απαντήσουμε.", ok: false });
      em?.focus();
      return;
    }
    setNote({ text: contact.demoPending, ok: true });
  };

  return (
    <>
      <span className="t5-mono t5-kicker">Contact</span>
      <h2>{contact.headline}</h2>
      <div className="t5-contact-list">
        {contact.emails.map((c) => (
          <CopyRow key={c.email} label={c.label} email={c.email} />
        ))}
      </div>
      <form id="demo" className="t5-card t5-demo" noValidate onSubmit={onSubmit}>
        <h3>{contact.demoTitle}</h3>
        <p className="t5-demo-intro">{contact.demoIntro}</p>
        <div className="t5-two">
          <div className="t5-field">
            <label htmlFor="d-name">Όνομα</label>
            <input type="text" id="d-name" placeholder="Γιώργος Παπαδόπουλος" />
          </div>
          <div className="t5-field">
            <label htmlFor="d-biz">Επιχείρηση</label>
            <input type="text" id="d-biz" placeholder="π.χ. Ξενοδοχείο στο Μέτσοβο" />
          </div>
        </div>
        <div className="t5-field">
          <label htmlFor="d-email">Email</label>
          <input type="email" id="d-email" placeholder="you@business.gr" />
        </div>
        <div className="t5-field">
          <label htmlFor="d-msg">Τι θα ήθελες να σταματήσεις να κάνεις με το χέρι;</label>
          <textarea id="d-msg" placeholder="π.χ. απαντάω σε ίδιες ερωτήσεις για διαθεσιμότητα όλη μέρα" />
        </div>
        <div className="t5-row">
          <button className="t5-cta" type="submit">
            Στείλε αίτημα <span className="t5-dot">→</span>
          </button>
          {note && <span className={`t5-note${note.ok ? " ok" : ""}`}>{note.text}</span>}
        </div>
      </form>
      <p className="t5-foot">{contact.copyright}</p>
    </>
  );
}
