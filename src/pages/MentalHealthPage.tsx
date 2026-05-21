import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Save, ChevronDown, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mentalHealthArticles, type Phase } from "@/data/mentalHealthArticles";

const todayStr = () => new Date().toISOString().slice(0, 10);

function computePhase(lastPeriod: string | null, cycleLen: number | null): Phase {
  if (!lastPeriod) return "follicular";
  const start = new Date(lastPeriod + "T00:00:00");
  const today = new Date(todayStr() + "T00:00:00");
  const cycle = cycleLen && cycleLen > 0 ? cycleLen : 28;
  const days = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const dayInCycle = ((days % cycle) + cycle) % cycle + 1;
  if (dayInCycle <= 5) return "menstruation";
  if (dayInCycle <= 13) return "follicular";
  if (dayInCycle <= 16) return "ovulation";
  return "luteal";
}

const MentalHealthPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("follicular");
  const [mood, setMood] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<{ logged_on: string; note: string | null }[]>([]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const phaseLabel: Record<Phase, { en: string; es: string }> = {
    menstruation: { en: "Menstruation", es: "Menstruación" },
    follicular: { en: "Follicular", es: "Folicular" },
    ovulation: { en: "Ovulation", es: "Ovulación" },
    luteal: { en: "Luteal", es: "Lútea" },
    general: { en: "General", es: "General" },
  };

  const moods = [
    { key: "great", emoji: "😊", label: t.great },
    { key: "good", emoji: "🙂", label: t.good },
    { key: "okay", emoji: "😐", label: t.okay },
    { key: "not_great", emoji: "😔", label: t.notGreat },
  ];

  const phaseArticles = useMemo(
    () => mentalHealthArticles.filter((a) => a.phase === phase),
    [phase]
  );
  const generalArticles = useMemo(
    () => mentalHealthArticles.filter((a) => a.phase === "general"),
    []
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [{ data: profile }, { data: todayJournal }, { data: todayMood }, { data: recentJ }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("last_period_date, avg_cycle_length")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("symptom_logs")
            .select("note")
            .eq("user_id", user.id)
            .eq("logged_on", todayStr())
            .eq("symptom_key", "journal")
            .maybeSingle(),
          supabase
            .from("symptom_logs")
            .select("symptom_key")
            .eq("user_id", user.id)
            .eq("logged_on", todayStr())
            .like("symptom_key", "mood_%")
            .limit(1),
          supabase
            .from("symptom_logs")
            .select("logged_on, note")
            .eq("user_id", user.id)
            .eq("symptom_key", "journal")
            .order("logged_on", { ascending: false })
            .limit(7),
        ]);

      setPhase(computePhase(profile?.last_period_date ?? null, profile?.avg_cycle_length ?? null));
      if (todayJournal?.note) setJournal(todayJournal.note);
      if (todayMood && todayMood.length) setMood(todayMood[0].symptom_key.replace("mood_", ""));
      setRecent((recentJ ?? []).filter((r) => r.note));
      setLoading(false);
    })();
  }, [user]);

  const saveMood = async (key: string) => {
    if (!user || busy) return;
    setBusy(true);
    try {
      const today = todayStr();
      await supabase
        .from("symptom_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("logged_on", today)
        .like("symptom_key", "mood_%");
      const { error } = await supabase.from("symptom_logs").insert({
        user_id: user.id,
        symptom_key: `mood_${key}`,
        intensity: 2,
        logged_on: today,
      });
      if (error) throw error;
      setMood(key);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const saveJournal = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      const today = todayStr();
      await supabase
        .from("symptom_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("logged_on", today)
        .eq("symptom_key", "journal");
      if (journal.trim()) {
        const { error } = await supabase.from("symptom_logs").insert({
          user_id: user.id,
          symptom_key: "journal",
          intensity: 2,
          logged_on: today,
          note: journal.trim(),
        });
        if (error) throw error;
      }
      toast({ title: lang === "es" ? "Guardado" : "Saved" });
      // refresh recent
      const { data } = await supabase
        .from("symptom_logs")
        .select("logged_on, note")
        .eq("user_id", user.id)
        .eq("symptom_key", "journal")
        .order("logged_on", { ascending: false })
        .limit(7);
      setRecent((data ?? []).filter((r) => r.note));
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-5 pt-6 pb-10">
      <Seo
        title="Mental Health — Journal & Phase-Aware Reads | Pearl Femme"
        description="Write how you feel and read short mental-health articles tailored to your current cycle phase."
        path="/mental-health"
      />

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full bg-card shadow-card flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-muted-foreground font-body">
            {lang === "es" ? "Bienestar" : "Wellbeing"}
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">{t.mentalHealth}</h1>
        </div>
      </div>

      {/* Journal */}
      <motion.section
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 p-5 rounded-2xl bg-card shadow-card"
      >
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {lang === "es" ? "¿Cómo te sientes hoy?" : "How are you feeling today?"}
          </h2>
        </div>

        <div className="flex gap-2 mb-4">
          {moods.map((m) => {
            const selected = mood === m.key;
            return (
              <button
                key={m.key}
                disabled={busy}
                onClick={() => saveMood(m.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                  selected ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/40 hover:bg-muted"
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] text-muted-foreground font-body">{m.label}</span>
              </button>
            );
          })}
        </div>

        <Textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder={
            lang === "es"
              ? "Escribe lo que sientes. Solo tú lo ves."
              : "Write what's on your mind. Only you see this."
          }
          className="min-h-[120px] mb-3 font-body"
        />
        <Button onClick={saveJournal} disabled={busy} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {lang === "es" ? "Guardar entrada de hoy" : "Save today's entry"}
        </Button>

        {recent.length > 0 && (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-body mb-2">
              {lang === "es" ? "Últimos 7 días" : "Last 7 days"}
            </p>
            <div className="space-y-2">
              {recent.map((r) => (
                <div key={r.logged_on} className="p-3 rounded-xl bg-muted/40">
                  <p className="text-[11px] text-muted-foreground font-body mb-1">{r.logged_on}</p>
                  <p className="text-sm text-foreground font-body whitespace-pre-wrap line-clamp-4">
                    {r.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Phase reads */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {lang === "es" ? "Para tu fase actual" : "For your current phase"}
            <span className="ml-2 text-xs font-body font-normal text-muted-foreground">
              · {phaseLabel[phase][lang as "en" | "es"]}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-2">
            {phaseArticles.map((a) => {
              const open = openSlug === a.slug;
              const copy = a[lang as "en" | "es"];
              return (
                <div key={a.slug} className="rounded-2xl bg-card shadow-card overflow-hidden">
                  <button
                    onClick={() => setOpenSlug(open ? null : a.slug)}
                    className="w-full p-4 text-left flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {copy.title}
                      </h3>
                      <p className="text-xs font-body text-muted-foreground mt-1">{copy.summary}</p>
                      <p className="text-[10px] font-body text-muted-foreground/70 mt-1">
                        {a.readTime}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="px-4 pb-4 text-sm font-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {copy.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* General */}
      <section className="mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          {lang === "es" ? "Bienestar mental general" : "General mental wellness"}
        </h2>
        <div className="space-y-2">
          {generalArticles.map((a) => {
            const open = openSlug === a.slug;
            const copy = a[lang as "en" | "es"];
            return (
              <div key={a.slug} className="rounded-2xl bg-card shadow-card overflow-hidden">
                <button
                  onClick={() => setOpenSlug(open ? null : a.slug)}
                  className="w-full p-4 text-left flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {copy.title}
                    </h3>
                    <p className="text-xs font-body text-muted-foreground mt-1">{copy.summary}</p>
                    <p className="text-[10px] font-body text-muted-foreground/70 mt-1">
                      {a.readTime}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-4 pb-4 text-sm font-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {copy.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground font-body text-center">
        {lang === "es"
          ? "Este contenido es informativo y no reemplaza la atención médica profesional."
          : "This content is informational and not a substitute for professional medical care."}
      </p>
    </div>
  );
};

export default MentalHealthPage;
