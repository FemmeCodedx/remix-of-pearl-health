import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Droplets, Plus, CalendarDays, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSwanCopy } from "@/lib/i18nSwan";

interface SymptomDef { key: string; emoji: string; label_en: string; label_es: string; }
const SYMPTOMS: SymptomDef[] = [
  { key: "cramps", emoji: "🤕", label_en: "Cramps", label_es: "Cólicos" },
  { key: "fatigue", emoji: "😴", label_en: "Fatigue", label_es: "Fatiga" },
  { key: "nausea", emoji: "🤢", label_en: "Nausea", label_es: "Náusea" },
  { key: "bloating", emoji: "😤", label_en: "Bloating", label_es: "Hinchazón" },
  { key: "headache", emoji: "💆", label_en: "Headache", label_es: "Dolor de cabeza" },
  { key: "mood_swings", emoji: "😢", label_en: "Mood swings", label_es: "Cambios de humor" },
  { key: "cravings", emoji: "🍫", label_en: "Cravings", label_es: "Antojos" },
  { key: "anxiety", emoji: "😰", label_en: "Anxiety", label_es: "Ansiedad" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const TrackPage = () => {
  const { t, lang } = useI18n();
  const c = useSwanCopy();
  const { user } = useAuth();
  const { toast } = useToast();
  const [periodToday, setPeriodToday] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  // Load today's existing logs
  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = todayStr();
      const [{ data: syms }, { data: cyc }] = await Promise.all([
        supabase
          .from("symptom_logs")
          .select("symptom_key")
          .eq("user_id", user.id)
          .eq("logged_on", today),
        supabase
          .from("cycle_logs")
          .select("id")
          .eq("user_id", user.id)
          .eq("started_on", today)
          .limit(1),
      ]);
      setTodaySymptoms(new Set((syms ?? []).map((s: any) => s.symptom_key)));
      setPeriodToday(!!(cyc && cyc.length));
    })();
  }, [user]);

  const togglePeriod = async () => {
    if (!user || busy) return;
    setBusy(true);
    const today = todayStr();
    try {
      if (periodToday) {
        await supabase.from("cycle_logs").delete().eq("user_id", user.id).eq("started_on", today);
        setPeriodToday(false);
      } else {
        const { error } = await supabase
          .from("cycle_logs")
          .insert({ user_id: user.id, started_on: today });
        if (error) throw error;
        setPeriodToday(true);
        toast({ title: c.track.periodSaved });
      }
    } catch (e: any) {
      toast({ title: c.track.saveError, description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const toggleSymptom = async (key: string) => {
    if (!user || busy) return;
    setBusy(true);
    const today = todayStr();
    const isOn = todaySymptoms.has(key);
    try {
      if (isOn) {
        await supabase.from("symptom_logs").delete()
          .eq("user_id", user.id).eq("logged_on", today).eq("symptom_key", key);
        const next = new Set(todaySymptoms); next.delete(key); setTodaySymptoms(next);
      } else {
        const { error } = await supabase.from("symptom_logs").insert({
          user_id: user.id, symptom_key: key, intensity: 2, logged_on: today,
        });
        if (error) throw error;
        const next = new Set(todaySymptoms); next.add(key); setTodaySymptoms(next);
        toast({ title: c.track.saved });
      }
    } catch (e: any) {
      toast({ title: c.track.saveError, description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const phases = [
    { name: t.menstrual, days: "1-5", color: "bg-primary/20 text-primary", active: false },
    { name: t.follicular, days: "6-13", color: "bg-tangerine/20 text-tangerine", active: true },
    { name: t.ovulation, days: "14-16", color: "bg-gold/20 text-accent", active: false },
    { name: t.luteal, days: "17-28", color: "bg-magenta/20 text-magenta", active: false },
  ];

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">{t.track}</h1>
        <Link
          to="/reports"
          className="flex items-center gap-1 text-xs font-bold text-primary px-3 py-1.5 rounded-full bg-primary/10"
        >
          <BarChart3 size={14} /> {c.reports.title}
        </Link>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={togglePeriod}
        disabled={busy}
        className={`w-full flex items-center gap-4 p-5 rounded-2xl mb-6 transition-all ${
          periodToday ? "gradient-femme shadow-glow" : "bg-card shadow-card"
        }`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          periodToday ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}>
          <Droplets size={28} className={periodToday ? "text-primary-foreground" : "text-primary"} />
        </div>
        <div className="text-left">
          <p className={`text-lg font-display font-semibold ${periodToday ? "text-primary-foreground" : "text-foreground"}`}>
            {t.logPeriod}
          </p>
          <p className={`text-sm ${periodToday ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {periodToday ? "✓ Logged today" : "Tap to log"}
          </p>
        </div>
      </motion.button>

      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <CalendarDays size={18} className="inline mr-2" />
        {t.currentPhase}
      </h2>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {phases.map((phase) => (
          <div
            key={phase.name}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl ${phase.color} ${
              phase.active ? "ring-2 ring-primary shadow-soft" : ""
            }`}
          >
            <p className="text-sm font-bold">{phase.name}</p>
            <p className="text-xs opacity-70">{t.day} {phase.days}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-display font-semibold text-foreground mb-3">
        <Plus size={18} className="inline mr-2" />
        {t.logSymptom}
      </h2>
      <MedicalDisclaimer variant="banner" className="mb-4" />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {SYMPTOMS.map((s) => {
          const isSelected = todaySymptoms.has(s.key);
          const label = lang === "es" ? s.label_es : s.label_en;
          return (
            <button
              key={s.key}
              onClick={() => toggleSymptom(s.key)}
              disabled={busy}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-card shadow-card"
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] text-muted-foreground font-body leading-tight text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrackPage;
