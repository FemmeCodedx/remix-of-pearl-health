import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useSwanCopy, type Phase } from "@/lib/i18nSwan";
import { Apple, Dumbbell, Heart, Leaf, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTierAccess } from "@/hooks/useTierAccess";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PhaseData {
  key: Phase;
  phase: string;
  nutrition: string[];
  exercise: string[];
  selfCare: string[];
  seeds: string[];
  color: string;
}

const SyncPage = () => {
  const { t } = useI18n();
  const c = useSwanCopy();
  const { user } = useAuth();
  const { hasSwan } = useTierAccess();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState(0);
  const [saving, setSaving] = useState(false);

  const phases: PhaseData[] = [
    { key: "menstrual", phase: t.menstrual,
      nutrition: ["Iron-rich foods", "Warm soups & stews", "Dark chocolate", "Herbal teas"],
      exercise: ["Gentle yoga", "Walking", "Stretching", "Rest days"],
      selfCare: ["Hot baths", "Journaling", "Extra sleep", "Comfort foods"],
      seeds: ["Flax seeds", "Pumpkin seeds"], color: "from-primary to-magenta" },
    { key: "follicular", phase: t.follicular,
      nutrition: ["Fermented foods", "Lean protein", "Leafy greens", "Citrus fruits"],
      exercise: ["HIIT", "Running", "Dance", "Strength training"],
      selfCare: ["Try new things", "Socialize", "Creative projects", "Plan ahead"],
      seeds: ["Flax seeds", "Pumpkin seeds"], color: "from-tangerine to-gold" },
    { key: "ovulation", phase: t.ovulation,
      nutrition: ["Raw veggies", "Whole grains", "Light meals", "Berries"],
      exercise: ["High intensity", "Group classes", "Swimming", "Boxing"],
      selfCare: ["Connect with others", "Public speaking", "Date nights", "Networking"],
      seeds: ["Sesame seeds", "Sunflower seeds"], color: "from-gold to-tangerine" },
    { key: "luteal", phase: t.luteal,
      nutrition: ["Complex carbs", "Magnesium-rich foods", "Root vegetables", "Omega-3s"],
      exercise: ["Pilates", "Light weights", "Yoga", "Nature walks"],
      selfCare: ["Slow down", "Organize", "Cozy evenings", "Reduce caffeine"],
      seeds: ["Sesame seeds", "Sunflower seeds"], color: "from-magenta to-primary" },
  ];

  const current = phases[activePhase];

  const sections = [
    { icon: Apple, title: t.nutrition, items: current.nutrition },
    { icon: Dumbbell, title: t.exercise, items: current.exercise },
    { icon: Heart, title: t.selfCare, items: current.selfCare },
    { icon: Leaf, title: t.foodSwaps + " (Seed Cycling)", items: current.seeds },
  ];

  const savePlan = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!hasSwan) { navigate("/pricing"); return; }
    setSaving(true);
    try {
      const title = `${current.phase} — ${new Date().toLocaleDateString()}`;
      const { error } = await supabase.from("monthly_plans").insert({
        user_id: user.id,
        phase: current.key,
        title,
        plan_json: {
          nutrition: current.nutrition,
          exercise: current.exercise,
          selfCare: current.selfCare,
          seeds: current.seeds,
        },
      });
      if (error) throw error;
      toast({ title: c.savedPlans.saved, description: c.savedPlans.savedDesc });
    } catch (e: any) {
      toast({ title: c.track.saveError, description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">{t.cycleSync}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t.cycleSyncDesc}</p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {phases.map((p, i) => (
          <button
            key={p.phase}
            onClick={() => setActivePhase(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activePhase === i
                ? `bg-gradient-to-r ${p.color} text-primary-foreground shadow-glow`
                : "bg-card text-muted-foreground shadow-card"
            }`}
          >
            {p.phase}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }} className="space-y-4"
        >
          {sections.map((section) => (
            <div key={section.title} className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <section.icon size={18} className="text-primary" />
                <h3 className="text-sm font-display font-bold text-foreground">{section.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full bg-soft-pink text-foreground text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={savePlan} disabled={saving}
            className={`w-full rounded-xl h-12 font-body font-semibold ${
              hasSwan ? "gradient-femme text-primary-foreground" : "bg-card text-foreground border-2 border-primary/30"
            }`}
          >
            <BookmarkPlus size={18} className="mr-2" />
            {hasSwan ? c.savedPlans.saveBtn : c.unlock(c.savedPlans.title)}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SyncPage;
