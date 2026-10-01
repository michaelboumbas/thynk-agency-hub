import { useMemo, useState, type FormEvent } from "react";
import { calculator as C } from "@/content/site-v5";

type TaskId = keyof typeof C.tasks;
const TASK_IDS = Object.keys(C.tasks) as TaskId[];

const fmt = (n: number) => Math.round(n).toLocaleString("el-GR");
const pct = (v: number, min: number, max: number) => `${((v - min) / (max - min)) * 100}%`;

function Range({
  id,
  label,
  value,
  min,
  max,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="t5-field">
      <label htmlFor={id}>
        {label} <output>{display}</output>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        value={value}
        style={{ ["--p" as string]: pct(value, min, max) }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

const VOICE = {
  you: {
    badEmail: "Γράψε ένα έγκυρο email, π.χ. you@business.gr",
    eats: "Τι σου τρώει χρόνο;",
    picked: "διάλεξες",
    placeholder: "το email σου",
    send: "Στείλε μου την αναφορά",
    sendNote: "",
    sendPending: "",
  },
  formal: {
    badEmail: "Συμπληρώστε έγκυρη διεύθυνση email, π.χ. name@business.gr",
    eats: "Πού χάνεται χρόνος;",
    picked: "επιλέξατε",
    placeholder: "το email σας",
    send: "Στείλτε μου την εκτίμηση",
    sendNote: "Θα λάβετε την εκτίμηση στο email σας.",
    sendPending: "Η αποστολή μέσω email ενεργοποιείται σύντομα. Μέχρι τότε, επικοινωνήστε μαζί μας στο hello@thynkagency.gr.",
  },
};

// Formal (v9+) copy: corporate register, one name per task across chips, calculator and form.
// Savings are shown as a range (25–40% of the hours on the picked tasks), decision Mike 01/10/2026,
// until Δημήτρης validates per-task shares.
const FORMAL_RANGE = [0.25, 0.4] as const;
const FORMAL_LABELS: Partial<Record<TaskId, { label?: string; opp?: string }>> = {
  phone: { label: "Κλήσεις & ραντεβού", opp: "Ψηφιακός βοηθός για κλήσεις & ραντεβού" },
  msg: { label: "Μηνύματα & email" },
  docs: { opp: "Αυτόματη καταχώριση παραστατικών" },
  reports: { opp: "Αυτοματοποιημένες αναφορές" },
  social: { opp: "Οργάνωση παραγωγής & δημοσίευσης περιεχομένου" },
  quotes: { opp: "Αυτοματοποιημένο follow-up προσφορών" },
};
const FORMAL_INDUSTRY: Record<string, string> = { other: "Άλλος κλάδος" };

/** `initialTasks` pre-selects what eats the visitor's time (v7 passes the pain picked in the hero). */
/** `formal` switches the copy to the plural/formal voice (v9 onwards). */
export function Calculator({ initialTasks, formal = false }: { initialTasks?: string[]; formal?: boolean } = {}) {
  const V = formal ? VOICE.formal : VOICE.you;
  const [industry, setIndustry] = useState(C.defaultIndustry);
  const [team, setTeam] = useState(6);
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(9);
  const [tasks, setTasks] = useState<TaskId[]>((initialTasks?.length ? initialTasks : C.defaultTasks) as TaskId[]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<{ text: string; ok: boolean }>({ text: formal ? V.sendNote : C.sendNote, ok: false });

  const r = useMemo(() => {
    const picked = tasks.length ? tasks : TASK_IDS;
    const monthHours = team * hours * C.weeksPerMonth;
    const share = picked.reduce((s, k) => s + C.tasks[k].share, 0) / picked.length;
    const save = monthHours * share;
    const w = C.weights[industry] ?? {};
    const ranked = picked
      .map((k) => ({ k, score: C.tasks[k].share * (w[k] ?? 1) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const tot = ranked.reduce((s, o) => s + o.score, 0) || 1;
    const lo = monthHours * FORMAL_RANGE[0];
    const hi = monthHours * FORMAL_RANGE[1];
    return {
      lo,
      hi,
      oppsRange: ranked.map((o) => ({
        label: FORMAL_LABELS[o.k]?.opp ?? C.tasks[o.k].opp,
        lo: (lo * o.score) / tot,
        hi: (hi * o.score) / tot,
      })),
      yearCost: monthHours * 12 * rate,
      monthHours,
      save,
      share,
      opps: ranked.map((o) => ({ label: C.tasks[o.k].opp, hours: (save * o.score) / tot })),
    };
  }, [industry, team, hours, rate, tasks]);

  const toggle = (k: TaskId) =>
    setTasks((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));

  const onSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    if (!email || (input && !input.checkValidity())) {
      setNote({ text: V.badEmail, ok: false });
      input?.focus();
      return;
    }
    setNote({ text: formal ? V.sendPending : C.sendPending, ok: true });
  };

  return (
    <div className="t5-calc">
      <form className="t5-calc-form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="t5-field">
          <label htmlFor="c-ind">Κλάδος</label>
          <select id="c-ind" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {C.industries.map((i) => (
              <option key={i.id} value={i.id}>
                {(formal && FORMAL_INDUSTRY[i.id]) || i.label}
              </option>
            ))}
          </select>
        </div>
        <Range id="c-team" label="Άτομα στην ομάδα" value={team} min={1} max={40} display={String(team)} onChange={setTeam} />
        <Range
          id="c-hours"
          label={formal ? "Ώρες την εβδομάδα ανά άτομο σε επαναλαμβανόμενες εργασίες" : "Ώρες την εβδομάδα ανά άτομο σε επαναλαμβανόμενες δουλειές"}
          value={hours}
          min={1}
          max={25}
          display={String(hours)}
          onChange={setHours}
        />
        <Range id="c-rate" label="Κόστος ώρας εργασίας" value={rate} min={5} max={40} display={`€${rate}`} onChange={setRate} />
        <div className="t5-field">
          <span className="t5-lbl">{V.eats}</span>
          <div className="t5-tasks">
            {TASK_IDS.map((k) => (
              <label key={k} className={tasks.includes(k) ? "on" : undefined}>
                <input type="checkbox" checked={tasks.includes(k)} onChange={() => toggle(k)} />
                {(formal && FORMAL_LABELS[k]?.label) || C.tasks[k].label}
              </label>
            ))}
          </div>
        </div>
      </form>

      <aside className="t5-result" aria-live="polite">
        <span className="t5-mono">{formal ? "Ετήσιο κόστος επαναλαμβανόμενων εργασιών" : "Σε αγγαρείες, κάθε χρόνο"}</span>
        <div className="t5-big">
          €{fmt(r.yearCost)} <small>/ έτος</small>
        </div>
        <div className="t5-kpis">
          <div className="t5-kpi">
            <b>{fmt(r.monthHours)}</b>
            <span>ώρες τον μήνα</span>
          </div>
          <div className="t5-kpi">
            <b>{formal ? `${fmt(r.lo)}–${fmt(r.hi)}` : `~${fmt(r.save)}`}</b>
            <span>{formal ? "ώρες/μήνα που μπορούν να αυτοματοποιηθούν" : "ώρες/μήνα που μπορούν να φύγουν"}</span>
          </div>
        </div>
        <span className="t5-mono">{formal ? "Προτεινόμενα σημεία εκκίνησης" : "Από πού θα ξεκινούσαμε"}</span>
        <ol className="t5-opps">
          {formal
            ? r.oppsRange.map((o) => (
                <li key={o.label}>
                  <span>{o.label}</span>
                  <span>
                    {fmt(o.lo)}–{fmt(o.hi)} ώρ.
                  </span>
                </li>
              ))
            : r.opps.map((o) => (
                <li key={o.label}>
                  <span>{o.label}</span>
                  <span>~{fmt(o.hours)} ώρ.</span>
                </li>
              ))}
        </ol>
        {formal ? (
          <p className="t5-how">
            {team} άτομα × {hours} ώρες × 4,33 εβδομάδες × €{rate}. Η εκτίμηση υποθέτει αυτοματοποίηση του 25–40% των
            εργασιών που {V.picked}. Το πραγματικό ποσοστό μετράται στο audit.
          </p>
        ) : (
          <p className="t5-how">
            {team} άτομα × {hours} ώρες × 4,33 εβδομάδες × €{rate}. Υποθέτουμε ότι φεύγει περίπου το{" "}
            {Math.round(r.share * 100)}% των δουλειών που {V.picked}. Το audit το μετράει στην πράξη.
          </p>
        )}
        <form className="t5-sendrow" noValidate onSubmit={onSend}>
          <label htmlFor="c-email" className="t5-sr">
            Email
          </label>
          <input
            type="email"
            id="c-email"
            placeholder={V.placeholder}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="t5-btn" type="submit">
            {V.send}
          </button>
        </form>
        <div className={`t5-note${note.ok ? " ok" : ""}`}>{note.text}</div>
      </aside>
    </div>
  );
}
