// Pure, deterministic rules that turn symptom + cycle logs into "discuss with your doctor" flags.
// These are informational only — never presented as medical advice.

export interface SymptomEntry {
  symptom_key: string;
  intensity: number; // 1-3
  logged_on: string; // YYYY-MM-DD
}

export interface CycleEntry {
  started_on: string; // YYYY-MM-DD
  ended_on?: string | null;
}

export type FlagSeverity = "info" | "watch" | "discuss";

export interface HealthFlag {
  id: string;
  severity: FlagSeverity;
  title: string;
  detail: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / DAY_MS);

const monthKey = (d: string) => d.slice(0, 7);

const stdev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return Math.sqrt(v);
};

interface Copy {
  shortCycles: (n: number) => { title: string; detail: string };
  longCycles: (n: number) => { title: string; detail: string };
  irregular: (sd: number) => { title: string; detail: string };
  missedPeriod: (days: number) => { title: string; detail: string };
  heavyBleeding: (n: number) => { title: string; detail: string };
  persistentSevere: (s: string, n: number) => { title: string; detail: string };
  recurringSevere: (s: string, m: number) => { title: string; detail: string };
  newSpike: (s: string, n: number) => { title: string; detail: string };
}

const COPY: Record<"en" | "es", Copy> = {
  en: {
    shortCycles: (n) => ({
      title: "Short cycles",
      detail: `${n} cycles under 21 days in the last 6 months. Consistently short cycles can be worth discussing with a provider.`,
    }),
    longCycles: (n) => ({
      title: "Long cycles",
      detail: `${n} cycles over 35 days in the last 6 months. Consider mentioning this at your next visit.`,
    }),
    irregular: (sd) => ({
      title: "Cycle length variability",
      detail: `Your last 6 cycles varied by about ${sd.toFixed(0)} days. Highly irregular cycles can have many causes worth exploring.`,
    }),
    missedPeriod: (days) => ({
      title: "Missed period",
      detail: `It has been ${days} days since your last logged period. If pregnancy is not expected, consider checking in with a provider.`,
    }),
    heavyBleeding: (n) => ({
      title: "Long periods",
      detail: `${n} periods longer than 7 days in the last 6 months. Persistent heavy or long bleeding is worth a conversation.`,
    }),
    persistentSevere: (s, n) => ({
      title: `Severe ${s.toLowerCase()}`,
      detail: `Logged at the highest intensity on ${n} days in a single month.`,
    }),
    recurringSevere: (s, m) => ({
      title: `Recurring severe ${s.toLowerCase()}`,
      detail: `Highest-intensity ${s.toLowerCase()} logged across ${m} months in a row.`,
    }),
    newSpike: (s, n) => ({
      title: `New ${s.toLowerCase()} pattern`,
      detail: `${s} appeared ${n} times this month after not being logged in the prior 3 months.`,
    }),
  },
  es: {
    shortCycles: (n) => ({
      title: "Ciclos cortos",
      detail: `${n} ciclos de menos de 21 días en los últimos 6 meses. Vale la pena comentarlo con tu proveedor.`,
    }),
    longCycles: (n) => ({
      title: "Ciclos largos",
      detail: `${n} ciclos de más de 35 días en los últimos 6 meses. Considera mencionarlo en tu próxima visita.`,
    }),
    irregular: (sd) => ({
      title: "Variabilidad del ciclo",
      detail: `Tus últimos 6 ciclos variaron alrededor de ${sd.toFixed(0)} días. Ciclos muy irregulares pueden tener varias causas.`,
    }),
    missedPeriod: (days) => ({
      title: "Período ausente",
      detail: `Han pasado ${days} días desde tu último período registrado. Si no esperas un embarazo, considera consultar a un proveedor.`,
    }),
    heavyBleeding: (n) => ({
      title: "Períodos largos",
      detail: `${n} períodos de más de 7 días en los últimos 6 meses. Sangrado abundante o prolongado merece una consulta.`,
    }),
    persistentSevere: (s, n) => ({
      title: `${s} severa`,
      detail: `Registrada en la intensidad más alta durante ${n} días en un solo mes.`,
    }),
    recurringSevere: (s, m) => ({
      title: `${s} severa recurrente`,
      detail: `Intensidad alta de ${s.toLowerCase()} registrada durante ${m} meses seguidos.`,
    }),
    newSpike: (s, n) => ({
      title: `Nuevo patrón: ${s.toLowerCase()}`,
      detail: `${s} apareció ${n} veces este mes tras no registrarse en los 3 meses anteriores.`,
    }),
  },
};

export interface FlagInput {
  symptoms: SymptomEntry[];
  cycles: CycleEntry[];
  lang: "en" | "es";
  symptomLabel: (key: string) => string;
  now?: Date;
}

export function computeHealthFlags(input: FlagInput): HealthFlag[] {
  const { symptoms, cycles, lang, symptomLabel } = input;
  const now = input.now ?? new Date();
  const flags: HealthFlag[] = [];
  const copy = COPY[lang];

  const sortedCycles = [...cycles].sort((a, b) => a.started_on.localeCompare(b.started_on));
  const sixMoAgo = new Date(now); sixMoAgo.setMonth(sixMoAgo.getMonth() - 6);
  const recentCycles = sortedCycles.filter((c) => new Date(c.started_on) >= sixMoAgo);

  // Cycle length distribution (gap between consecutive starts)
  const cycleLengths: number[] = [];
  for (let i = 1; i < recentCycles.length; i++) {
    cycleLengths.push(daysBetween(recentCycles[i - 1].started_on, recentCycles[i].started_on));
  }
  const short = cycleLengths.filter((d) => d < 21).length;
  const long = cycleLengths.filter((d) => d > 35).length;
  if (short >= 2) {
    const c = copy.shortCycles(short);
    flags.push({ id: "short_cycles", severity: "discuss", ...c });
  }
  if (long >= 2) {
    const c = copy.longCycles(long);
    flags.push({ id: "long_cycles", severity: "discuss", ...c });
  }
  const last6 = cycleLengths.slice(-6);
  const sd = stdev(last6);
  if (last6.length >= 4 && sd > 7) {
    const c = copy.irregular(sd);
    flags.push({ id: "irregular_cycles", severity: "watch", ...c });
  }

  // Missed period
  if (sortedCycles.length) {
    const lastStart = sortedCycles[sortedCycles.length - 1].started_on;
    const gap = daysBetween(lastStart, now.toISOString().slice(0, 10));
    if (gap > 45) {
      const c = copy.missedPeriod(gap);
      flags.push({ id: "missed_period", severity: "discuss", ...c });
    }
  }

  // Heavy/long bleeding
  const longPeriods = recentCycles.filter((c) => {
    if (!c.ended_on) return false;
    return daysBetween(c.started_on, c.ended_on) > 7;
  }).length;
  if (longPeriods >= 2) {
    const c = copy.heavyBleeding(longPeriods);
    flags.push({ id: "long_periods", severity: "discuss", ...c });
  }

  // Symptom analysis
  // Severe per (month, symptom)
  const severeByMonthSymptom = new Map<string, Map<string, number>>();
  const allByMonthSymptom = new Map<string, Map<string, number>>();
  symptoms.forEach((s) => {
    const m = monthKey(s.logged_on);
    if (!allByMonthSymptom.has(m)) allByMonthSymptom.set(m, new Map());
    const am = allByMonthSymptom.get(m)!;
    am.set(s.symptom_key, (am.get(s.symptom_key) ?? 0) + 1);
    if (s.intensity >= 3) {
      if (!severeByMonthSymptom.has(m)) severeByMonthSymptom.set(m, new Map());
      const sm = severeByMonthSymptom.get(m)!;
      sm.set(s.symptom_key, (sm.get(s.symptom_key) ?? 0) + 1);
    }
  });

  // Persistent severe in any single month (>=5 days)
  const persistentSeen = new Set<string>();
  severeByMonthSymptom.forEach((m) => {
    m.forEach((count, key) => {
      if (count >= 5 && !persistentSeen.has(key)) {
        persistentSeen.add(key);
        const c = copy.persistentSevere(symptomLabel(key), count);
        flags.push({ id: `severe_${key}`, severity: "watch", ...c });
      }
    });
  });

  // Recurring severe across 3+ consecutive months
  const months = Array.from(severeByMonthSymptom.keys()).sort();
  const recurringSeen = new Set<string>();
  const allSymptomKeys = new Set<string>();
  severeByMonthSymptom.forEach((m) => m.forEach((_, k) => allSymptomKeys.add(k)));
  allSymptomKeys.forEach((key) => {
    let streak = 0;
    let bestStreak = 0;
    let prev: number | null = null;
    months.forEach((mk) => {
      if (!severeByMonthSymptom.get(mk)?.has(key)) return;
      const [y, mo] = mk.split("-").map(Number);
      const idx = y * 12 + mo;
      if (prev !== null && idx === prev + 1) streak += 1;
      else streak = 1;
      bestStreak = Math.max(bestStreak, streak);
      prev = idx;
    });
    if (bestStreak >= 3 && !recurringSeen.has(key)) {
      recurringSeen.add(key);
      const c = copy.recurringSevere(symptomLabel(key), bestStreak);
      flags.push({ id: `recurring_${key}`, severity: "discuss", ...c });
    }
  });

  // New spike: appears 5+ times current month, 0 in prior 3 months
  const thisMonth = monthKey(now.toISOString().slice(0, 10));
  const prior3: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now); d.setMonth(d.getMonth() - i);
    prior3.push(monthKey(d.toISOString().slice(0, 10)));
  }
  const thisMap = allByMonthSymptom.get(thisMonth);
  if (thisMap) {
    thisMap.forEach((count, key) => {
      if (count < 5) return;
      const inPrior = prior3.some((mk) => (allByMonthSymptom.get(mk)?.get(key) ?? 0) > 0);
      if (!inPrior) {
        const c = copy.newSpike(symptomLabel(key), count);
        flags.push({ id: `spike_${key}`, severity: "watch", ...c });
      }
    });
  }

  return flags;
}

// Monthly trend bucketing helpers
export interface MonthlyCyclePoint {
  month: string; // YYYY-MM
  cycleLength: number | null;
  periodLength: number | null;
}

export function bucketCycleTrends(cycles: CycleEntry[], months: number): MonthlyCyclePoint[] {
  const sorted = [...cycles].sort((a, b) => a.started_on.localeCompare(b.started_on));
  const buckets = new Map<string, { cycleLens: number[]; periodLens: number[] }>();

  for (let i = 0; i < sorted.length; i++) {
    const m = monthKey(sorted[i].started_on);
    if (!buckets.has(m)) buckets.set(m, { cycleLens: [], periodLens: [] });
    if (i > 0) {
      const len = daysBetween(sorted[i - 1].started_on, sorted[i].started_on);
      if (len > 0 && len < 90) buckets.get(m)!.cycleLens.push(len);
    }
    if (sorted[i].ended_on) {
      const pl = daysBetween(sorted[i].started_on, sorted[i].ended_on!);
      if (pl > 0 && pl < 30) buckets.get(m)!.periodLens.push(pl);
    }
  }

  const out: MonthlyCyclePoint[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i);
    const mk = monthKey(d.toISOString().slice(0, 10));
    const b = buckets.get(mk);
    const avg = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
    out.push({
      month: mk,
      cycleLength: b ? avg(b.cycleLens) : null,
      periodLength: b ? avg(b.periodLens) : null,
    });
  }
  return out;
}

export interface MonthlySymptomPoint {
  month: string;
  count: number;
}

export function bucketSymptomCounts(symptoms: SymptomEntry[], months: number): MonthlySymptomPoint[] {
  const counts = new Map<string, number>();
  symptoms.forEach((s) => {
    const m = monthKey(s.logged_on);
    counts.set(m, (counts.get(m) ?? 0) + 1);
  });
  const out: MonthlySymptomPoint[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i);
    const mk = monthKey(d.toISOString().slice(0, 10));
    out.push({ month: mk, count: counts.get(mk) ?? 0 });
  }
  return out;
}
