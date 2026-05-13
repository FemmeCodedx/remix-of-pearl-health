import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
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
  const colors = ["bg-primary/15", "bg-primary/35", "bg-primary/60", "bg-primary"];
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`w-2 h-4 rounded-sm ${i <= level ? colors[level - 1] : "bg-muted"}`} />
      ))}
    </div>
  );
};

const OvulationPhasePage = () => {
  const { t, lang } = useI18n();

  const timelineRows = [
    { phase: "Late Follicular / Pre-Ovulation", days: "Days 11–13", hormones: "Oestradiol ↑↑ peak, LH rising", effect: "Dominant follicle at max size; peak fertile mucus; libido peaks" },
    { phase: "LH Surge Onset", days: "~Day 13", hormones: "LH surges sharply (↑↑↑)", effect: "Pituitary releases LH peak; detectable on OPK" },
    { phase: "Ovulation", days: "Day 14 (±1–3)", hormones: "LH peak → follicle rupture", effect: "Egg released; viable for 12–24 hours" },
    { phase: "Post-Ovulation", days: "Days 15–16", hormones: "LH drops; progesterone ↑", effect: "Corpus luteum forms; luteal phase begins" },
  ];

  const signsRows = [
    ["Egg-white cervical mucus", "Most fertile women", "HIGH — best natural marker", "Clear, stretchy, slippery; peaks 1–2 days before ovulation"],
    ["Mittelschmerz (ovulation pain)", "~20–40%", "MODERATE — timing variable", "One-sided pelvic ache; minutes to hours; Day 13–14"],
    ["LH detected on OPK", "~90% accuracy", "HIGH — predicts, not confirms", "Detects LH 24–36 hrs before; PCOS may cause false positives"],
    ["BBT rise (0.2–0.5 °C)", "Consistent in ovulatory cycles", "MODERATE — confirms after the fact", "Progesterone-driven temp rise; not predictive"],
    ["Increased libido", "Common", "LOW–MODERATE", "Testosterone & oestrogen peak; evolutionary signalling"],
    ["Breast tenderness (mild)", "Some women", "LOW", "Mild as progesterone begins rising"],
    ["Ovulation spotting", "~20%", "LOW–MODERATE", "Light pink/brown spotting from follicle rupture; 1–2 days"],
    ["Cervical position change", "Trained users", "MODERATE with mucus", "Cervix becomes high, soft, open when fertile"],
    ["Heightened senses", "Some women", "LOW", "Smell & taste acuity may increase"],
    ["Sociable / confident mood", "Common", "LOW", "Oestrogen + testosterone peak; social engagement up"],
  ];

  const dayRows: Array<{ symptom: string; values: (1 | 2 | 3 | 4)[] }> = [
    { symptom: "Cervical mucus (egg-white)", values: [4, 4, 3, 1] },
    { symptom: "Libido", values: [4, 4, 3, 2] },
    { symptom: "LH surge", values: [3, 4, 1, 1] },
    { symptom: "Mittelschmerz", values: [1, 3, 2, 1] },
    { symptom: "BBT", values: [1, 1, 2, 4] },
    { symptom: "Mood", values: [3, 4, 3, 2] },
  ];

  const trackingRows = [
    ["Ovulation Predictor Kits (OPK)", "Urine LH surge", "~90% (correct use)", "Predicts ovulation 24–36 hrs ahead", "False positives in PCOS; doesn't confirm rupture"],
    ["Cervical mucus (Billings)", "Oestrogen-driven mucus changes", "High with training", "Free; no equipment", "Subjective; learning curve"],
    ["Basal Body Temperature (BBT)", "Post-ovulatory progesterone rise", "Confirms retrospectively", "Cheap; confirms ovulation", "Doesn't predict; needs daily AM measurement"],
    ["Sympto-thermal method", "Combined mucus + BBT + symptoms", "~98% (perfect use, Cochrane)", "Most accurate non-tech method", "Time and training required"],
    ["Wearables (Oura, Apple, etc.)", "Continuous BBT, HRV, skin temp", "Variable; improving", "Passive; integrated tracking", "Lower accuracy for irregular cycles"],
    ["Serum progesterone (Day 21)", "Mid-luteal progesterone >10 ng/mL", "Clinical gold standard", "Confirms ovulation occurred", "Requires blood draw and timing"],
  ];

  const nutritionRows = [
    ["Antioxidants (Vit C, E, CoQ10)", "Protect egg quality from oxidative stress", "MODERATE", "Berries, nuts, seeds, leafy greens"],
    ["Folate / Folic acid", "DNA synthesis; pre-conception essential", "STRONG", "Leafy greens, lentils, fortified grains; 400 mcg/day"],
    ["Omega-3 (DHA/EPA)", "Egg quality, follicular fluid composition", "MODERATE", "Oily fish 2x/week, flax, chia, walnuts"],
    ["Mediterranean diet pattern", "Improved ovulatory function", "STRONG (observational)", "Whole grains, olive oil, fish, vegetables"],
    ["Limit trans-fats", "Trans-fats linked to anovulatory infertility", "STRONG (Nurses' Health Study)", "Avoid ultra-processed and fried foods"],
    ["Iron (plant + heme)", "Higher iron intake reduces anovulation risk", "MODERATE", "Lentils, spinach, red meat + Vit C"],
  ];

  const concernsRows = [
    ["PCOS", "Irregular/absent periods, acne, excess hair", "Ultrasound, androgens, insulin", "Lifestyle, metformin, ovulation induction"],
    ["Hypothalamic anovulation", "Absent periods, low body weight, high stress/exercise", "FSH/LH/E2, nutrition assessment", "Increase intake, reduce training, stress care"],
    ["Hyperprolactinaemia", "Irregular cycles, galactorrhoea", "Prolactin, MRI pituitary", "Dopamine agonists (cabergoline)"],
    ["Thyroid dysfunction", "Fatigue, weight changes, irregular cycles", "TSH, free T4, antibodies", "Endocrinology referral"],
    ["Premature ovarian insufficiency", "Hot flushes, irregular/absent periods <40", "FSH, AMH, oestradiol", "HRT, fertility specialist"],
  ];

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Seo title="Ovulation Phase Guide — Energy, Fertility & Wellness | Pearl Femme" description="Your ovulation phase guide: peak energy, fertility window, supportive foods, and what to track." path="/learn/ovulation-phase" />
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Ovulation Phase
          </h1>
          <p className="text-sm text-muted-foreground">A research-based clinical overview · Compiled May 2026</p>
        </div>
      </div>

      <a href="/resources/ovulation-phase-report.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mb-5">
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
        <SectionTitle>1. What Is the Ovulation Phase?</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Ovulation is the release of a mature egg from the dominant ovarian follicle, triggered by a surge in <strong>Luteinising Hormone (LH)</strong>. In a 28-day cycle this typically occurs around Day 14 (range Day 10–20+). The egg is viable for fertilisation for only <strong>12–24 hours</strong>.
        </p>
        <p className="text-sm text-foreground/80 mb-4">
          The LH surge precedes egg release by 24–36 hours. The fertile window spans 5–6 days — the 5 days before ovulation (sperm survival) plus ovulation day itself. The two days immediately before and on ovulation day carry the highest conception probability.
        </p>
        <h3 className="text-sm font-semibold mb-2">Peri-ovulatory hormonal timeline</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Window</Th><Th>Days</Th><Th>Hormones</Th><Th>What's happening</Th></tr>
            </thead>
            <tbody>
              {timelineRows.map((r) => (
                <tr key={r.phase}>
                  <Td><strong>{r.phase}</strong></Td><Td>{r.days}</Td><Td>{r.hormones}</Td><Td>{r.effect}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Silent anovulation:</strong> HUNT3 (Norway, n~1,000) found only 73–84% of apparently regular cycles are truly ovulatory. Confirm with mid-luteal serum progesterone &gt;10 ng/mL or follicle ultrasound.
        </p>
      </Card>

      {/* 2. Signs */}
      <Card className="p-5 mb-4">
        <SectionTitle>2. Symptom & Sign Prevalence</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Ovulation produces a distinct cluster of signs, though many women ovulate without clear symptoms ("silent ovulators").
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Sign</Th><Th>Prevalence</Th><Th>Reliability</Th><Th>Notes</Th></tr>
            </thead>
            <tbody>
              {signsRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td>
                  <Td><span className="text-primary font-semibold">{r[2]}</span></Td>
                  <Td className="text-muted-foreground">{r[3]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Day-by-day */}
      <Card className="p-5 mb-4">
        <SectionTitle>3. Day-by-Day Changes</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr>
                <Th>Sign</Th><Th>Day 12</Th><Th>Day 13–14</Th><Th>Day 15</Th><Th>Day 16</Th>
              </tr>
            </thead>
            <tbody>
              {dayRows.map((r) => (
                <tr key={r.symptom}>
                  <Td><strong>{r.symptom}</strong></Td>
                  {r.values.map((v, i) => <Td key={i}><Intensity level={v} /></Td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Day 12: oestradiol near peak, mucus abundant, LH starting to rise. Day 13–14: LH peak, ovulation, possible mittelschmerz. Day 15–16: temp rises, progesterone takes over.
        </p>
      </Card>

      {/* 4. Age & BMI */}
      <Card className="p-5 mb-4">
        <SectionTitle>4. Age & BMI Influences</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">Age</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li><strong>Adolescents:</strong> Often irregular in the first 2–3 years post-menarche; anovulatory cycles common.</li>
          <li><strong>20s–30s:</strong> Peak ovulatory regularity (73–84% of regular cycles).</li>
          <li><strong>35+:</strong> Egg quality declines, anovulation rates rise; LH surge may persist without rupture.</li>
          <li><strong>Perimenopause:</strong> Increasingly erratic ovulation; surges may not yield mature eggs.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">BMI</h3>
        <p className="text-sm text-foreground/80">
          Both very low BMI (&lt;18.5, hypothalamic suppression) and elevated BMI (&gt;30, insulin resistance and PCOS-pattern anovulation) reduce ovulation rates. The most regular ovulation occurs in the BMI 18.5–25 range.
        </p>
      </Card>

      {/* 5. Tracking methods */}
      <Card className="p-5 mb-4">
        <SectionTitle>5. Fertility Tracking Methods</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Method</Th><Th>Detects</Th><Th>Accuracy</Th><Th>Pros</Th><Th>Cons</Th></tr>
            </thead>
            <tbody>
              {trackingRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td>
                  <Td><span className="text-primary font-semibold">{r[2]}</span></Td>
                  <Td>{r[3]}</Td><Td className="text-muted-foreground">{r[4]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. Optimisation */}
      <Card className="p-5 mb-4">
        <SectionTitle>6. Evidence-Based Management & Optimisation</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">Managing ovulation pain</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Warm compress to the lower abdomen.</li>
          <li>NSAIDs (ibuprofen, naproxen) if disruptive — note: may theoretically delay rupture, use only when needed.</li>
          <li>Seek review for severe pain &gt;24 hours, fever, or heavy bleeding.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">Supporting healthy ovulation</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/80">
          <li><strong>Maintain BMI 18.5–25</strong> for the most regular ovulation.</li>
          <li><strong>Manage stress:</strong> cortisol directly suppresses GnRH and delays the LH surge.</li>
          <li><strong>Sleep 7–9 hours</strong> — LH pulsatility is partly sleep-dependent.</li>
          <li><strong>Reduce alcohol</strong> to &lt;7 units/week; abstain if trying to conceive.</li>
          <li><strong>Check thyroid:</strong> even subclinical hypothyroidism disrupts ovulation.</li>
        </ul>
      </Card>

      {/* 7. Nutrition */}
      <Card className="p-5 mb-4">
        <SectionTitle>7. Nutrition for Ovulatory Health</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Nutrient / Strategy</Th><Th>Role</Th><Th>Evidence</Th><Th>Foods</Th></tr>
            </thead>
            <tbody>
              {nutritionRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td>
                  <Td><span className="text-primary font-semibold">{r[2]}</span></Td>
                  <Td className="text-muted-foreground">{r[3]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 8. Lifestyle */}
      <Card className="p-5 mb-4">
        <SectionTitle>8. Lifestyle Quick-Reference</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1 text-primary">Daily habits</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Folic acid 400 mcg/day if trying to conceive</li>
              <li>Oily fish 2x/week for DHA</li>
              <li>Caffeine &lt;200 mg/day pre-conception</li>
              <li>Avoid trans-fats and ultra-processed foods</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-magenta">When to act</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>No LH surge for 3+ tracked cycles → see a doctor</li>
              <li>Cycles &gt;35 or &lt;21 days → hormonal workup</li>
              <li>TTC &gt;12 months (6 if 35+) → fertility referral</li>
              <li>Severe ovulation pain &gt;24 hrs → urgent review</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 9. When to see a doctor */}
      <Card className="p-5 mb-4">
        <SectionTitle>9. When to See a Doctor — Ovulation Disorders</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Condition</Th><Th>Signs</Th><Th>Investigation</Th><Th>Management</Th></tr>
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
          Also flag: galactorrhoea (unexplained breast milk), persistently strongly-positive OPKs (possible PCOS), or hot flushes/absent periods under 40 (possible POI).
        </p>
      </Card>

      {/* 10. Consensus */}
      <Card className="p-5 mb-4">
        <SectionTitle>10. Research Consensus & Controversies</SectionTitle>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-primary mb-1">Consensus</p>
            <p className="text-foreground/80">LH surge precedes ovulation by 24–36 hrs. The egg is viable 12–24 hrs. Sympto-thermal tracking is the most accurate non-clinical method. BMI &lt;18.5 or &gt;30 reduces ovulation rates. Trans-fats are linked to anovulatory infertility.</p>
          </div>
          <div>
            <p className="font-semibold text-magenta mb-1">Controversy</p>
            <p className="text-foreground/80">Wearable accuracy for ovulation prediction is improving but still variable. Most ovulation–diet studies are observational, making causality hard to establish. Mittelschmerz pathophysiology is debated (follicle stretch vs prostaglandins vs peritoneal irritation).</p>
          </div>
        </div>
      </Card>

      {/* References */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="refs" className="border rounded-2xl px-4 bg-card">
          <AccordionTrigger className="text-sm font-display font-semibold">Key References</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
              <li>Chavarro JE et al. (2007). Diet and Lifestyle in Ovulatory Disorder Infertility. Obstet Gynecol — Nurses' Health Study.</li>
              <li>Frank-Herrmann P et al. (2007). Effectiveness of a fertility awareness method. Hum Reprod 22(5).</li>
              <li>StatPearls — Mittelschmerz.</li>
              <li>Fertility Foundation (2024). Ovulation Symptoms.</li>
              <li>Samphire Neuroscience — peri-ovulatory neuroendocrine review.</li>
              <li>Natural Cycles — large-scale cycle tracking dataset.</li>
              <li>HUNT3 Norway population study — ovulation regularity in healthy cycles.</li>
              <li>Cochrane review — sympto-thermal fertility awareness methods.</li>
              <li>NIH/PMC reviews on LH pulsatility, sleep and stress.</li>
              <li>ACOG — anovulation and fertility evaluation.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Disclaimer text={t.educationalDisclaimer} />
    </div>
  );
};

export default OvulationPhasePage;
