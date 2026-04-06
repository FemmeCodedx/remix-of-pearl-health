import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Apple, Dumbbell, Heart, Leaf } from "lucide-react";

interface PhaseData {
  phase: string;
  nutrition: string[];
  exercise: string[];
  selfCare: string[];
  seeds: string[];
  color: string;
}

const SyncPage = () => {
  const { t } = useI18n();
  const [activePhase, setActivePhase] = useState(0);

  const phases: PhaseData[] = [
    {
      phase: t.menstrual,
      nutrition: ["Iron-rich foods", "Warm soups & stews", "Dark chocolate", "Herbal teas"],
      exercise: ["Gentle yoga", "Walking", "Stretching", "Rest days"],
      selfCare: ["Hot baths", "Journaling", "Extra sleep", "Comfort foods"],
      seeds: ["Flax seeds", "Pumpkin seeds"],
      color: "from-primary to-magenta",
    },
    {
      phase: t.follicular,
      nutrition: ["Fermented foods", "Lean protein", "Leafy greens", "Citrus fruits"],
      exercise: ["HIIT", "Running", "Dance", "Strength training"],
      selfCare: ["Try new things", "Socialize", "Creative projects", "Plan ahead"],
      seeds: ["Flax seeds", "Pumpkin seeds"],
      color: "from-tangerine to-gold",
    },
    {
      phase: t.ovulation,
      nutrition: ["Raw veggies", "Whole grains", "Light meals", "Berries"],
      exercise: ["High intensity", "Group classes", "Swimming", "Boxing"],
      selfCare: ["Connect with others", "Public speaking", "Date nights", "Networking"],
      seeds: ["Sesame seeds", "Sunflower seeds"],
      color: "from-gold to-tangerine",
    },
    {
      phase: t.luteal,
      nutrition: ["Complex carbs", "Magnesium-rich foods", "Root vegetables", "Omega-3s"],
      exercise: ["Pilates", "Light weights", "Yoga", "Nature walks"],
      selfCare: ["Slow down", "Organize", "Cozy evenings", "Reduce caffeine"],
      seeds: ["Sesame seeds", "Sunflower seeds"],
      color: "from-magenta to-primary",
    },
  ];

  const current = phases[activePhase];

  const sections = [
    { icon: Apple, title: t.nutrition, items: current.nutrition },
    { icon: Dumbbell, title: t.exercise, items: current.exercise },
    { icon: Heart, title: t.selfCare, items: current.selfCare },
    { icon: Leaf, title: t.foodSwaps + " (Seed Cycling)", items: current.seeds },
  ];

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">{t.cycleSync}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t.cycleSyncDesc}</p>

      {/* Phase selector */}
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

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {sections.map((section) => (
            <div key={section.title} className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <section.icon size={18} className="text-primary" />
                <h3 className="text-sm font-display font-bold text-foreground">{section.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full bg-soft-pink text-foreground text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SyncPage;
