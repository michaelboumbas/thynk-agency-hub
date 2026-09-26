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

export function Calculator() {
  const [industry, setIndustry] = useState(C.defaultIndustry);
  const [team, setTeam] = useState(6);
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(9);
  const [tasks, setTasks] = useState<TaskId[]>(C.defaultTasks as TaskId[]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<{ text: string; ok: boolean }>({ text: C.sendNote, ok: false });

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
    return {
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
      setNote({ text: "Γράψε ένα έγκυρο email, π.χ. you@business.gr", ok: false });
      input?.focus();
      return;
    }
    setNote({ text: C.sendPending, ok: true });
  };

  return (
    <div className="t5-calc">
      <form className="t5-calc-form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="t5-field">
          <label htmlFor="c-ind">Κλάδος</label>
          <select id="c-ind" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {C.industries.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <Range id="c-team" label="Άτομα στην ομάδα" value={team} min={1} max={40} display={String(team)} onChange={setTeam} />
        <Range
          id="c-hours"
          label="Ώρες την εβδομάδα ανά άτομο σε επαναλαμβανόμενες δουλειές"
          value={hours}
          min={1}
          max={25}
          display={String(hours)}
          onChange={setHours}
        />
        <Range id="c-rate" label="Κόστος ώρας εργασίας" value={rate} min={5} max={40} display={`€${rate}`} onChange={setRate} />
        <div className="t5-field">
          <span className="t5-lbl">Τι σου τρώει χρόνο;</span>
          <div className="t5-tasks">
            {TASK_IDS.map((k) => (
              <label key={k} className={tasks.includes(k) ? "on" : undefined}>
                <input type="checkbox" checked={tasks.includes(k)} onChange={() => toggle(k)} />
                {C.tasks[k].label}
              </label>
            ))}
          </div>
        </div>
      </form>

      <aside className="t5-result" aria-live="polite">
        <span className="t5-mono">Σε αγγαρείες, κάθε χρόνο</span>
        <div className="t5-big">
          €{fmt(r.yearCost)} <small>/ έτος</small>
        </div>
        <div className="t5-kpis">
          <div className="t5-kpi">
            <b>{fmt(r.monthHours)}</b>
            <span>ώρες τον μήνα</span>
          </div>
          <div className="t5-kpi">
            <b>~{fmt(r.save)}</b>
            <span>ώρες/μήνα που μπορούν να φύγουν</span>
          </div>
        </div>
        <span className="t5-mono">Από πού θα ξεκινούσαμε</span>
        <ol className="t5-opps">
          {r.opps.map((o) => (
            <li key={o.label}>
              <span>{o.label}</span>
              <span>~{fmt(o.hours)} ώρ.</span>
            </li>
          ))}
        </ol>
        <p className="t5-how">
          {team} άτομα × {hours} ώρες × 4,33 εβδομάδες × €{rate}. Υποθέτουμε ότι φεύγει περίπου το{" "}
          {Math.round(r.share * 100)}% των δουλειών που διάλεξες. Το audit το μετράει στην πράξη.
        </p>
        <form className="t5-sendrow" noValidate onSubmit={onSend}>
          <label htmlFor="c-email" className="t5-sr">
            Email
          </label>
          <input
            type="email"
            id="c-email"
            placeholder="το email σου"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="t5-btn" type="submit">
            Στείλε μου την αναφορά
          </button>
        </form>
        <div className={`t5-note${note.ok ? " ok" : ""}`}>{note.text}</div>
      </aside>
    </div>
  );
}
