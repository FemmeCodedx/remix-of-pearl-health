import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, FileDown, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { useSwanCopy } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import UpgradeGate from "@/components/UpgradeGate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { buildReportPdf, type SymptomRow, type CycleRow } from "@/lib/reportPdf";

interface DBSymptom {
  id: string;
  symptom_key: string;
  intensity: number;
  note: string | null;
  logged_on: string;
}
interface DBCycle {
  id: string;
  started_on: string;
  ended_on: string | null;
  flow: string | null;
}

const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const c = useSwanCopy();
  const { hasSwan, isLoading: tierLoading } = useTierAccess();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<DBSymptom[]>([]);
  const [cycles, setCycles] = useState<DBCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      const sinceFull = new Date(); sinceFull.setMonth(sinceFull.getMonth() - 12);
      const since7 = new Date(); since7.setDate(since7.getDate() - 7);
      const since = (hasSwan ? sinceFull : since7).toISOString().slice(0, 10);

      const [{ data: s }, { data: cy }] = await Promise.all([
        supabase
          .from("symptom_logs")
          .select("id,symptom_key,intensity,note,logged_on")
          .eq("user_id", user.id)
          .gte("logged_on", since)
          .order("logged_on", { ascending: false }),
        supabase
          .from("cycle_logs")
          .select("id,started_on,ended_on,flow")
          .eq("user_id", user.id)
          .order("started_on", { ascending: false }),
      ]);

      if (!active) return;
      setSymptoms((s as DBSymptom[]) ?? []);
      setCycles((cy as DBCycle[]) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [user, hasSwan]);

  const symptomLabel = (key: string) =>
    SYMPTOM_LABELS[lang]?.[key] ?? SYMPTOM_LABELS.en[key] ?? key;

  const topSymptoms = useMemo(() => {
    const counts = new Map<string, number>();
    symptoms.forEach((s) => counts.set(s.symptom_key, (counts.get(s.symptom_key) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([k, v]) => ({ label: symptomLabel(k), count: v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [symptoms, lang]);

  const daysSet = useMemo(() => new Set(symptoms.map((s) => s.logged_on)), [symptoms]);

  const handleExport = () => {
    if (!user) return;
    const symptomRows: SymptomRow[] = symptoms.map((s) => ({
      date: s.logged_on,
      symptom: symptomLabel(s.symptom_key),
      intensity: s.intensity,
      note: s.note,
    }));
    const cycleRows: CycleRow[] = cycles.map((cy) => ({
      started_on: cy.started_on,
      ended_on: cy.ended_on,
      flow: cy.flow,
    }));
    const oldest = symptoms.length ? symptoms[symptoms.length - 1].logged_on : new Date().toISOString().slice(0, 10);
    const newest = symptoms.length ? symptoms[0].logged_on : new Date().toISOString().slice(0, 10);

    const doc = buildReportPdf({
      userName: user.user_metadata?.full_name || user.email || "Pearl Femme user",
      rangeLabel: `${oldest} → ${newest}`,
      generatedLabel: new Date().toLocaleString(lang === "es" ? "es-ES" : "en-US"),
      symptoms: symptomRows,
      cycles: cycleRows,
      topSymptoms,
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
      },
    });
    doc.save(`pearl-femme-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: c.reports.exportPdf, description: "✓" });
  };

  const summary = (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard label={c.reports.symptomsLogged} value={symptoms.length} />
      <StatCard label={c.reports.daysTracked} value={daysSet.size} />
      <StatCard label={c.reports.cyclesLogged} value={cycles.length} />
    </div>
  );

  const recentList = (
    <div className="space-y-2">
      {symptoms.slice(0, 20).map((s) => (
        <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card">
          <span className="text-xs font-mono text-muted-foreground w-20 shrink-0">{s.logged_on}</span>
          <span className="text-sm font-semibold text-foreground flex-1 truncate">{symptomLabel(s.symptom_key)}</span>
          <span className="text-xs text-primary font-bold">{"★".repeat(s.intensity)}</span>
        </div>
      ))}
    </div>
  );

  const top = topSymptoms.length ? (
    <div className="rounded-2xl bg-card shadow-card p-4 mb-4">
      <h3 className="font-display font-bold text-sm text-foreground mb-3">{c.reports.topSymptoms}</h3>
      <div className="space-y-2">
        {topSymptoms.map((s) => {
          const max = topSymptoms[0].count || 1;
          const pct = Math.round((s.count / max) * 100);
          return (
            <div key={s.label}>
              <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                <span>{s.label}</span>
                <span>{s.count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-femme" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  const fullView = (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground mb-3">
        {c.reports.fullHistory}
      </h2>
      {summary}
      {top}
      <div className="flex justify-end mb-3">
        <Button onClick={handleExport} className="gradient-femme text-primary-foreground rounded-xl">
          <FileDown size={16} className="mr-2" />
          {c.reports.exportPdf}
        </Button>
      </div>
      {recentList}
    </div>
  );

  const pearlPreview = (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground mb-3">{c.reports.last7}</h2>
      {summary}
      {top}
      <div className="space-y-2">
        {symptoms.slice(0, 5).map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card">
            <span className="text-xs font-mono text-muted-foreground w-20 shrink-0">{s.logged_on}</span>
            <span className="text-sm font-semibold text-foreground flex-1 truncate">{symptomLabel(s.symptom_key)}</span>
            <span className="text-xs text-primary font-bold">{"★".repeat(s.intensity)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {c.reports.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5 ml-13">{c.reports.subtitle}</p>

      {loading || tierLoading ? (
        <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div>
      ) : symptoms.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 px-5 bg-card rounded-2xl shadow-card">
          <p className="text-sm text-muted-foreground font-body">{c.reports.noData}</p>
        </motion.div>
      ) : hasSwan ? (
        fullView
      ) : (
        <UpgradeGate
          required="swan"
          featureName={c.reports.upsellTitle}
          description={c.reports.upsellBody}
          preview={pearlPreview}
        >
          {fullView}
        </UpgradeGate>
      )}
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="p-3 rounded-xl bg-card shadow-card text-center">
    <p className="text-2xl font-display font-bold text-primary">{value}</p>
    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wide leading-tight mt-1">{label}</p>
  </div>
);

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

export default ReportsPage;
