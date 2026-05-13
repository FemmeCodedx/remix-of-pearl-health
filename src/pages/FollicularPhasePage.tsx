import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { ArrowLeft, Download, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-display font-bold text-foreground mb-3">{children}</h2>
);

const Disclaimer = ({ text }: { text: string }) => (
  <p className="text-[11px] italic text-muted-foreground mt-3">{text}</p>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left font-semibold p-2 border-b border-border bg-muted/40">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-2 align-top border-b border-border/60 ${className}`}>{children}</td>
);

const Intensity = ({ level }: { level: 1 | 2 | 3 | 4 }) => {
  const colors = ["bg-tangerine/15", "bg-tangerine/35", "bg-tangerine/60", "bg-tangerine"];
  return (
    <div className="flex gap-0.5">
      <Seo title="Follicular Phase Guide — Symptoms, Nutrition & Lifestyle | Pearl Femme" description="Understand your follicular phase: hormonal shifts, symptoms, supportive nutrition, movement, and lifestyle tips." path="/learn/follicular-phase" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`w-2 h-4 rounded-sm ${i <= level ? colors[level - 1] : "bg-muted"}`} />
      ))}
    </div>
  );
};

const FollicularPhasePage = () => {
  const { t, lang } = useI18n();

  const hormoneRows = [
    { phase: "Early Follicular", days: "Days 1–5", hormones: "FSH ↑, oestradiol very low", effect: "Follicle recruitment; uterine shedding still occurring" },
    { phase: "Mid Follicular", days: "Days 6–10", hormones: "FSH moderate, oestradiol ↑", effect: "Dominant follicle selected; energy starts recovering" },
    { phase: "Late Follicular", days: "Days 11–13", hormones: "Oestradiol ↑↑ (peak), LH rising", effect: "Peak energy, mood, cognition; libido rising; appetite suppressed" },
    { phase: "Pre-Ovulation", days: "Day 13–14", hormones: "LH surge; oestradiol dips slightly", effect: "Ovulation imminent; cervical mucus changes" },
  ];

  const experienceRows = [
    ["Energy levels", "Improving → HIGH", "Rising oestrogen increases energy expenditure and subjective vitality"],
    ["Mood / emotional state", "Improving → POSITIVE", "Serotonin and dopamine modulated by rising E2; most women feel uplifted"],
    ["Sleep quality", "BEST of the cycle", "Low progesterone = no sedative effect; oestrogen supports deep sleep"],
    ["Cognitive focus", "HIGH", "Peak verbal memory and processing speed in late follicular phase"],
    ["Appetite / hunger", "REDUCED", "Oestrogen suppresses appetite and increases insulin sensitivity"],
    ["Libido", "Rising", "Testosterone rises toward ovulation; oestrogen enhances receptivity"],
    ["Breast tenderness", "None / minimal", "Low progesterone; no ductal stimulation"],
    ["Bloating", "None / minimal", "Low progesterone = normal GI motility"],
    ["Skin", "Often BEST", "Oestrogen promotes collagen synthesis and regulates sebum"],
    ["Physical performance", "PEAK", "Strength gains and endurance peak in late follicular phase"],
    ["Anxiety", "LOW", "No allopregnanolone-GABA dysregulation; high serotonergic activity"],
    ["Ovulation pain (end)", "~40% of women", "Mittelschmerz: brief one-sided twinge at ovulation; self-limiting"],
  ];

  const severityRows: Array<{ symptom: string; values: (1 | 2 | 3 | 4)[] }> = [
    { symptom: "Energy", values: [2, 3, 4] },
    { symptom: "Positive mood", values: [2, 3, 4] },
    { symptom: "Cognitive focus", values: [2, 3, 4] },
    { symptom: "Sleep quality", values: [3, 4, 4] },
    { symptom: "Libido", values: [1, 2, 4] },
    { symptom: "Appetite", values: [3, 2, 1] },
    { symptom: "Anxiety/Tension", values: [2, 1, 1] },
  ];

  const nutritionRows = [
    ["Iron + Vitamin C", "Replenish post-menstrual iron; prevent fatigue", "STRONG", "Red meat, lentils, spinach + citrus, peppers"],
    ["Cruciferous vegetables", "Support healthy oestrogen metabolism (DIM)", "MODERATE", "Broccoli, kale, cauliflower, Brussels sprouts"],
    ["Lean protein", "Supports follicle development & muscle synthesis", "STRONG", "Eggs, chicken, fish, tofu, Greek yogurt"],
    ["Fermented foods", "Gut–oestrogen axis (estrobolome) support", "MODERATE", "Kefir, kimchi, sauerkraut, yogurt"],
    ["Complex carbs", "Steady energy for HIIT & strength sessions", "STRONG", "Oats, quinoa, sweet potato, brown rice"],
    ["Healthy fats", "Hormone synthesis precursors", "MODERATE", "Avocado, olive oil, nuts, seeds"],
    ["Limit alcohol", "Excess disrupts liver oestrogen clearance", "MODERATE", "Minimise throughout cycle"],
  ];

  const concernsRows = [
    ["Anovulation", "Irregular cycles; no BBT shift; no LH surge on OPK", "Cycle tracking, hormone panel", "Lifestyle review; gynaecology referral"],
    ["PCOS", "Irregular cycles, acne, excess hair, weight changes", "Ultrasound, androgens, insulin", "Diet, exercise, metformin, OCP"],
    ["Hypothalamic amenorrhoea", "Absent periods, low body weight, high stress/exercise", "FSH/LH/E2, nutrition assessment", "Increase intake, reduce training"],
    ["Thyroid dysfunction", "Fatigue, weight changes, irregular cycles", "TSH, free T4, antibodies", "Endocrinology referral"],
  ];

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-tangerine/10 flex items-center justify-center text-tangerine">
          <Sun size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Follicular Phase
          </h1>
          <p className="text-sm text-muted-foreground">A research-based clinical overview · Compiled May 2026</p>
        </div>
      </div>

      <a href="/resources/follicular-phase-report.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mb-5">
        <Button variant="outline" size="sm" className="gap-2 rounded-full">
          <Download size={14} /> {t.downloadFullPdf}
        </Button>
      </a>

      {lang === "es" && (
        <Card className="p-3 mb-5 bg-tangerine/10 border-tangerine/30">
          <p className="text-xs text-foreground">{t.spanishComingSoon}</p>
        </Card>
      )}

      {/* 1. What is */}
      <Card className="p-5 mb-4">
        <SectionTitle>1. What Is the Follicular Phase?</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          The follicular phase is the first half of the menstrual cycle, beginning on Day 1 of menstruation and ending at ovulation. It typically lasts 10–14 days and is the most variable phase. FSH stimulates follicle growth; the dominant follicle secretes rising oestradiol, which thickens the endometrium and produces characteristic improvements in energy, mood, sleep, and cognitive performance.
        </p>
        <p className="text-sm text-foreground/80 mb-4">
          Oestradiol increases insulin sensitivity, suppresses appetite, and modulates serotonin, dopamine, and norepinephrine — explaining the phase's mood-lifting, performance-enhancing effects.
        </p>
        <h3 className="text-sm font-semibold mb-2">Hormonal profile across the follicular phase</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Window</Th><Th>Days</Th><Th>Hormones</Th><Th>Primary effect</Th></tr>
            </thead>
            <tbody>
              {hormoneRows.map((r) => (
                <tr key={r.phase}>
                  <Td><strong>{r.phase}</strong></Td><Td>{r.days}</Td><Td>{r.hormones}</Td><Td>{r.effect}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Experience profile */}
      <Card className="p-5 mb-4">
        <SectionTitle>2. Symptom & Experience Profile</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Unlike the luteal and menstruation phases, the follicular phase is characterised by <strong>positive physiological changes</strong> rather than distressing symptoms.
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Experience</Th><Th>Direction</Th><Th>Notes</Th></tr>
            </thead>
            <tbody>
              {experienceRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td className="text-muted-foreground">{r[2]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Severity by sub-phase */}
      <Card className="p-5 mb-4">
        <SectionTitle>3. Changes Across Sub-Phases</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr>
                <Th>Domain</Th><Th>Early (1–5)</Th><Th>Mid (6–10)</Th><Th>Late (11–13)</Th>
              </tr>
            </thead>
            <tbody>
              {severityRows.map((r) => (
                <tr key={r.symptom}>
                  <Td><strong>{r.symptom}</strong></Td>
                  {r.values.map((v, i) => <Td key={i}><Intensity level={v} /></Td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Days 1–3: menstrual symptoms still present. Days 4–6: bleeding ends, energy lifts. Days 7–10: mid-follicular peak — great window for new habits and demanding cognitive work. Days 11–13: peak oestradiol, libido rising, ovulation imminent.
        </p>
      </Card>

      {/* 4. Age & BMI */}
      <Card className="p-5 mb-4">
        <SectionTitle>4. Age & BMI Influences</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">Age</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li><strong>Adolescents:</strong> Variable, often longer follicular phase as the HPO axis matures; anovulatory cycles more common.</li>
          <li><strong>20s–30s:</strong> Most predictable. Ovulation occurs in ~73–84% of regular cycles (HUNT3 Norway).</li>
          <li><strong>40s / Perimenopause:</strong> Follicular phase shortens; oestradiol surges become erratic.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">PCOS</h3>
        <p className="text-sm text-foreground/80">
          PCOS (~10% of women) features follicles that develop but fail to ovulate, producing a chronically extended follicular phase with elevated androgens and insulin resistance. The typical oestrogen-driven benefits may be blunted.
        </p>
      </Card>

      {/* 5. Optimisation */}
      <Card className="p-5 mb-4">
        <SectionTitle>5. Evidence-Based Optimisation</SectionTitle>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/80">
          <li><strong>HIIT:</strong> Faster recovery than in luteal phase; oestrogen supports fast-twitch fibre recruitment.</li>
          <li><strong>Strength training:</strong> Best window for personal records — oestrogen is anti-catabolic.</li>
          <li><strong>Cognitive work:</strong> Schedule presentations, negotiations, and exams in the late follicular window (Days 9–13).</li>
          <li><strong>Habit formation:</strong> Motivation and willpower peak — ideal for starting new routines.</li>
          <li><strong>Social & professional:</strong> Confidence and communication enhanced — great for interviews.</li>
        </ul>
      </Card>

      {/* 6. Nutrition */}
      <Card className="p-5 mb-4">
        <SectionTitle>6. Nutrition for the Follicular Phase</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Nutrient / Strategy</Th><Th>Role</Th><Th>Evidence</Th><Th>Foods</Th></tr>
            </thead>
            <tbody>
              {nutritionRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td>
                  <Td><span className="text-tangerine font-semibold">{r[2]}</span></Td>
                  <Td className="text-muted-foreground">{r[3]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Appetite naturally decreases in the late follicular and ovulatory windows due to oestrogen's appetite-suppressing effects. Prioritise nutrient density over volume.
        </p>
      </Card>

      {/* 7. Lifestyle tips */}
      <Card className="p-5 mb-4">
        <SectionTitle>7. Lifestyle Quick-Reference</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1 text-tangerine">Movement</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>HIIT and strength training 3–4x/week</li>
              <li>Try a new sport — coordination peaks here</li>
              <li>Aim for personal records mid-late follicular</li>
              <li>Outdoor activity to align with rising energy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-magenta">Wellbeing</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Establish consistent sleep routines now</li>
              <li>Plan demanding work in this window each month</li>
              <li>Lean into social activities — oestrogen boosts outgoingness</li>
              <li>Track symptoms — flat phases can flag PCOS or thyroid issues</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 8. When to see a doctor */}
      <Card className="p-5 mb-4">
        <SectionTitle>8. When to See a Doctor</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Concern</Th><Th>Signs</Th><Th>Investigation</Th><Th>Initial management</Th></tr>
            </thead>
            <tbody>
              {concernsRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td>{r[3]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          See a clinician if you've never experienced a late-follicular "peak", have irregular/absent periods with acne or excess hair growth, or have been trying to conceive for 12 months (6 months if over 35).
        </p>
      </Card>

      {/* 9. Consensus */}
      <Card className="p-5 mb-4">
        <SectionTitle>9. Research Consensus & Controversies</SectionTitle>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-primary mb-1">Consensus</p>
            <p className="text-foreground/80">Rising oestradiol drives improvements in mood, energy, cognition, and physical performance. Iron repletion in early follicular days reduces fatigue. Low body weight and chronic undereating suppress the HPO axis and remove these benefits.</p>
          </div>
          <div>
            <p className="font-semibold text-magenta mb-1">Controversy</p>
            <p className="text-foreground/80">Strict cycle-syncing protocols for diet and exercise show benefits in subjective outcomes but limited objective performance gains. The exact body-fat threshold for HPO suppression varies between individuals.</p>
          </div>
        </div>
      </Card>

      {/* References */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="refs" className="border rounded-2xl px-4 bg-card">
          <AccordionTrigger className="text-sm font-display font-semibold">Key References</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
              <li>Banner Health (2026). Cycle Syncing — Diet, Exercise and Your Menstrual Cycle.</li>
              <li>Cleveland Clinic (2023). Nutrition and Exercise Throughout Your Menstrual Cycle.</li>
              <li>Geisinger Health (2026). Cycle Syncing Through Your Menstrual Phases.</li>
              <li>Joffe H et al. (2016). Follicular-phase estradiol and the menstrual cycle. J Clin Endocrinol Metab.</li>
              <li>HUNT3 Norway population study — ovulation regularity in healthy cycles.</li>
              <li>NIH/PMC reviews on oestrogen, cognition, and exercise performance.</li>
              <li>NewYork-Presbyterian — Follicular phase and reproductive physiology.</li>
              <li>ACOG — Menstrual cycle and ovulation disorders.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Disclaimer text={t.educationalDisclaimer} />
    </div>
  );
};

export default FollicularPhasePage;
