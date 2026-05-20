import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, FileDown, TrendingUp, Stethoscope, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { useSwanCopy } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import UpgradeGate from "@/components/UpgradeGate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { buildReportPdf, type SymptomRow, type CycleRow } from "@/lib/reportPdf";
import {
  computeHealthFlags, bucketCycleTrends, bucketSymptomCounts,
  type SymptomEntry, type CycleEntry, type HealthFlag,
} from "@/lib/healthFlags";

const SYMPTOM_LABELS: Record<string, Record<string, string>> = {
  en: {
    cramps: "Cramps", fatigue: "Fatigue", nausea: "Nausea", bloating: "Bloating",
    headache: "Headache", mood_swings: "Mood swings", cravings: "Cravings", anxiety: "Anxiety",
  },
  es: {
    cramps: "Cólicos", fatigue: "Fatiga", nausea: "Náusea", bloating: "Hinchazón",
    headache: "Dolor de cabeza", mood_swings: "Cambios de humor", cravings: "Antojos", anxiety: "Ansiedad",
  },
};

const COPY = {
  en: {
    title: "Insights",
    subtitle: "Monthly trends and patterns worth a closer look.",
    range3: "3 mo", range6: "6 mo", range12: "12 mo",
    cycleTrend: "Cycle length", periodTrend: "Period length",
    symptomMonthly: "Symptoms logged per month",
    days: "days",
    flagsTitle: "Discuss with your doctor",
    flagsDisclaimer: "Informational only — not medical advice.",
    flagsEmpty: "Nothing unusual right now. Keep tracking — patterns become clearer with more data.",
    exportPdf: "Export PDF",
    noData: "Log a few cycles and symptoms on the Track page to unlock insights.",
    upsellTitle: "Insights & doctor-ready report",
    upsellBody: "See monthly trends, get pattern alerts, and export a PDF you can hand to your provider.",
    loading: "Loading…",
  },
  es: {
    title: "Análisis",
    subtitle: "Tendencias mensuales y patrones a observar.",
    range3: "3 m", range6: "6 m", range12: "12 m",
    cycleTrend: "Duración del ciclo", periodTrend: "Duración del período",
    symptomMonthly: "Síntomas registrados por mes",
    days: "días",
    flagsTitle: "Habla con tu doctora",
    flagsDisclaimer: "Solo informativo — no es consejo médico.",
    flagsEmpty: "Nada inusual por ahora. Sigue registrando — los patrones se ven con más datos.",
    exportPdf: "Exportar PDF",
    noData: "Registra ciclos y síntomas en Rastrear para desbloquear el análisis.",
    upsellTitle: "Análisis e informe para tu doctora",
    upsellBody: "Mira tendencias mensuales, recibe alertas de patrones y exporta un PDF para tu proveedor.",
    loading: "Cargando…",
  },
} as const;

type Range = 3 | 6 | 12;

const InsightsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useI18n();
  const c = useSwanCopy();
  const { hasSwan, isLoading: tierLoading } = useTierAccess();
  const { toast } = useToast();
  const copy = COPY[lang === "es" ? "es" : "en"];

  const [range, setRange] = useState<Range>(6);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [cycles, setCycles] = useState<CycleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      const since = new Date(); since.setMonth(since.getMonth() - 12);
      const sinceStr = since.toISOString().slice(0, 10);
      const [{ data: s }, { data: cy }] = await Promise.all([
        supabase.from("symptom_logs")
          .select("symptom_key,intensity,logged_on")
          .eq("user_id", user.id)
          .gte("logged_on", sinceStr)
          .order("logged_on", { ascending: false }),
        supabase.from("cycle_logs")
          .select("started_on,ended_on")
          .eq("user_id", user.id)
          .order("started_on", { ascending: true }),
      ]);
      if (!active) return;
      setSymptoms((s as SymptomEntry[]) ?? []);
      setCycles((cy as CycleEntry[]) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [user]);

  const symptomLabel = (key: string) =>
    SYMPTOM_LABELS[lang]?.[key] ?? SYMPTOM_LABELS.en[key] ?? key;

  const cycleTrend = useMemo(() => bucketCycleTrends(cycles, range), [cycles, range]);
  const symptomTrend = useMemo(() => bucketSymptomCounts(symptoms, range), [symptoms, range]);
  const flags = useMemo<HealthFlag[]>(
    () => computeHealthFlags({ symptoms, cycles, lang: lang === "es" ? "es" : "en", symptomLabel }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [symptoms, cycles, lang]
  );

  const topSymptoms = useMemo(() => {
    const counts = new Map<string, number>();
    symptoms.forEach((s) => counts.set(s.symptom_key, (counts.get(s.symptom_key) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([k, v]) => ({ label: symptomLabel(k), count: v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptoms, lang]);

  const monthShort = (mk: string) => {
    const [, mo] = mk.split("-");
    return mo;
  };

  const handleExport = () => {
    if (!user) return;
    const symptomRows: SymptomRow[] = symptoms.map((s) => ({
      date: s.logged_on,
      symptom: symptomLabel(s.symptom_key),
      intensity: s.intensity,
      note: null,
    }));
    const cycleRows: CycleRow[] = cycles.map((cy) => ({
      started_on: cy.started_on,
      ended_on: cy.ended_on ?? null,
      flow: null,
    }));
    const doc = buildReportPdf({
      userName: user.user_metadata?.full_name || user.email || "Pearl Femme",
      rangeLabel: `${range} ${copy.days}`,
      generatedLabel: new Date().toLocaleString(lang === "es" ? "es-ES" : "en-US"),
      symptoms: symptomRows,
      cycles: cycleRows,
      topSymptoms,
      monthlyTrend: cycleTrend,
      flags: flags.map((f) => ({ title: f.title, detail: f.detail })),
      copy: {
        title: c.reports.pdfTitle,
        generated: c.reports.pdfGenerated,
        range: c.reports.pdfRange,
        summary: c.reports.summary,
        symptomsLogged: c.reports.symptomsLogged,
        daysTracked: c.reports.daysTracked,
        topSymptoms: c.reports.topSymptoms,
        recent: c.reports.recent,
        cyclesLogged: c.reports.cyclesLogged,
        avgCycle: c.reports.avgCycle,
        days: c.reports.days,
        intensity: c.reports.intensity,
        noSymptoms: c.reports.pdfNoSymptoms,
        insights: copy.cycleTrend,
        monthHeader: lang === "es" ? "Mes" : "Month",
        cycleLenHeader: lang === "es" ? "Ciclo prom. (días)" : "Avg cycle (days)",
        periodLenHeader: lang === "es" ? "Período prom. (días)" : "Avg period (days)",
        flagsTitle: copy.flagsTitle,
        flagsDisclaimer: copy.flagsDisclaimer,
      },
    });
    doc.save(`pearl-femme-insights-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: copy.exportPdf, description: "✓" });
  };

  const severityStyles: Record<HealthFlag["severity"], string> = {
    info: "border-l-muted",
    watch: "border-l-accent",
    discuss: "border-l-primary",
  };

  const fullView = (
    <div className="space-y-5">
      <div className="flex gap-2">
        {([3, 6, 12] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              range === r
                ? "gradient-femme text-primary-foreground"
                : "bg-card text-muted-foreground shadow-card"
            }`}
          >
            {r === 3 ? copy.range3 : r === 6 ? copy.range6 : copy.range12}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-card p-4">
        <h3 className="font-display font-bold text-sm text-foreground mb-2">{copy.cycleTrend}</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cycleTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--muted))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickFormatter={monthShort} fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" domain={[15, 'dataMax + 5']} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="cycleLength" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey="periodLength" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 text-[10px] font-body text-muted-foreground mt-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />{copy.cycleTrend}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />{copy.periodTrend}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-card p-4">
        <h3 className="font-display font-bold text-sm text-foreground mb-2">{copy.symptomMonthly}</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={symptomTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--muted))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickFormatter={monthShort} fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground">{copy.flagsTitle}</h3>
        </div>
        <p className="text-[11px] italic text-muted-foreground mb-3">{copy.flagsDisclaimer}</p>
        {flags.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body">{copy.flagsEmpty}</p>
        ) : (
          <ul className="space-y-2">
            {flags.map((f) => (
              <li
                key={f.id}
                className={`pl-3 py-2 border-l-4 bg-muted/30 rounded-r-lg ${severityStyles[f.severity]}`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{f.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleExport} className="gradient-femme text-primary-foreground rounded-xl">
          <FileDown size={16} className="mr-2" />
          {copy.exportPdf}
        </Button>
      </div>
    </div>
  );

  const pearlPreview = (
    <div className="space-y-3">
      <div className="rounded-2xl bg-card shadow-card p-4 opacity-60">
        <h3 className="font-display font-bold text-sm text-foreground mb-3">{copy.cycleTrend}</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cycleTrend.slice(-3)} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" tickFormatter={monthShort} fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <Line type="monotone" dataKey="cycleLength" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {copy.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5 ml-13">{copy.subtitle}</p>

      {loading || tierLoading ? (
        <div className="text-center text-sm text-muted-foreground py-12">{copy.loading}</div>
      ) : cycles.length === 0 && symptoms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 px-5 bg-card rounded-2xl shadow-card"
        >
          <p className="text-sm text-muted-foreground font-body">{copy.noData}</p>
        </motion.div>
      ) : hasSwan ? (
        fullView
      ) : (
        <UpgradeGate
          required="swan"
          featureName={copy.upsellTitle}
          description={copy.upsellBody}
          preview={pearlPreview}
        >
          {fullView}
        </UpgradeGate>
      )}
    </div>
  );
};

export default InsightsPage;
