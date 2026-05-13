import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { ArrowLeft, Download, Moon } from "lucide-react";
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

const LutealPhasePage = () => {
  const { t, lang } = useI18n();

  const hormoneRows = [
    { phase: "Early Luteal", days: "Days 15–18", hormones: "Progesterone ↑, Oestradiol ↑", effect: "Endometrial thickening; breast tissue stimulation" },
    { phase: "Mid Luteal", days: "Days 19–22", hormones: "Progesterone ↑↑ (peak), Oestradiol ↑", effect: "Peak progesterone; body temp rises ~0.3–0.5 °C" },
    { phase: "Late Luteal", days: "Days 23–27", hormones: "Progesterone ↓, Oestradiol ↓", effect: "Symptom peak; serotonin sensitivity; PMS window" },
    { phase: "Menses onset", days: "Day 28/1", hormones: "Both near baseline", effect: "Symptom resolution" },
  ];

  const prevalenceRows = [
    ["Any premenstrual symptom", "Up to 90–91%", "Cross-sectional global data; ObG Project 2023 (ACOG)"],
    ["PMS (clinical criteria met)", "20–47.8%", "Meta-analysis of 18,803 individuals"],
    ["Moderate–severe PMS", "13–30%", "Pelotas cohort (Brazil), n=2,082"],
    ["PMDD (confirmed)", "3.2%", "Meta-analysis of 50,659 participants"],
    ["PMDD (provisional)", "7.7%", "Same meta-analysis; any diagnostic method"],
    ["Breast tenderness (luteal)", "57–73%", "MedRxiv 2022 menstrual-app study"],
    ["Abdominal bloating", "73.7%", "South Indian PMS study, n=190"],
    ["Mood swings / irritability", "92.6–95.3%", "South Indian PMS study, n=190"],
    ["Fatigue", "90.5%", "South Indian PMS study, n=190"],
    ["Headache", "59.5%", "South Indian PMS study, n=190"],
    ["Food cravings / overeating", ">60%", "Brazil university cohort n=1,115"],
  ];

  const severityRows: Array<{ symptom: string; values: (1 | 2 | 3 | 4)[] }> = [
    { symptom: "Bloating", values: [1, 1, 2, 3, 4] },
    { symptom: "Cramps", values: [1, 1, 2, 3, 4] },
    { symptom: "Breast tenderness", values: [1, 2, 3, 4, 2] },
    { symptom: "Mood swings / irritability", values: [1, 1, 2, 4, 3] },
    { symptom: "Fatigue", values: [2, 1, 2, 3, 4] },
    { symptom: "Cravings", values: [1, 1, 2, 3, 4] },
    { symptom: "Positive mood", values: [3, 4, 3, 2, 1] },
  ];

  const supplementRows = [
    ["Calcium", "1,000–1,200 mg/day", "Mood, bloating, cramps", "STRONG"],
    ["Vitamin B6", "50–100 mg/day", "Irritability, depression", "MODERATE"],
    ["Magnesium", "200–360 mg/day", "Cramps, bloating, mood", "MODERATE"],
    ["Vitamin D", "1,000–2,000 IU/day", "Mood, fatigue", "MODERATE"],
    ["Omega-3 (EPA/DHA)", "1–2 g/day", "Cramps, mood", "MODERATE"],
    ["Chasteberry (Vitex)", "20–40 mg/day extract", "Breast tenderness, mood", "MODERATE"],
  ];

  const pmsPmddRows = [
    ["Prevalence", "90–91% any symptom", "20–47.8%", "3.2%"],
    ["Functional impairment", "None / minimal", "Mild–moderate", "Severe"],
    ["Mood symptoms required", "No", "Optional", "Required (≥1 core affective)"],
    ["Diagnosis method", "Self-report", "Clinical criteria", "Prospective ≥2-cycle DSM-5"],
    ["Treatment first-line", "Lifestyle", "Lifestyle + supplements", "SSRIs (often luteal-phase only)"],
  ];

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Seo title="Luteal Phase Guide — PMS, Mood & Nutrition | Pearl Femme" description="Navigate the luteal phase: PMS support, mood swings, hormone-friendly foods, and gentle movement." path="/learn/luteal-phase" />
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-magenta/10 flex items-center justify-center text-magenta">
          <Moon size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Luteal Phase Symptoms
          </h1>
          <p className="text-sm text-muted-foreground">A research-based clinical overview · Compiled May 2026</p>
        </div>
      </div>

      <a href="/resources/luteal-phase-report.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mb-5">
        <Button variant="outline" size="sm" className="gap-2 rounded-full">
          <Download size={14} /> {t.downloadFullPdf}
        </Button>
      </a>

      {lang === "es" && (
        <Card className="p-3 mb-5 bg-tangerine/10 border-tangerine/30">
          <p className="text-xs text-foreground">{t.spanishComingSoon}</p>
        </Card>
      )}

      {/* 1. What is the luteal phase */}
      <Card className="p-5 mb-4">
        <SectionTitle>1. What Is the Luteal Phase?</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          The luteal phase is the second half of the menstrual cycle, beginning immediately after ovulation and ending with menstruation. In a 28-day cycle, this spans approximately days 15–28, lasting 12–14 days on average. The phase is named for the corpus luteum — a temporary endocrine structure that secretes progesterone and oestradiol.
        </p>
        <p className="text-sm text-foreground/80 mb-4">
          If fertilisation does not occur, the corpus luteum degenerates, progesterone and oestradiol fall sharply, and menstruation is triggered. This hormonal withdrawal — especially the drop in progesterone — is the central driver of late-luteal symptoms.
        </p>
        <h3 className="text-sm font-semibold mb-2">Hormonal profile across the luteal phase</h3>
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
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Mechanism:</strong> Altered sensitivity of GABAergic inhibition to allopregnanolone (a progesterone-derived neurosteroid) plus reduced serotonin availability explain why low-dose SSRIs work rapidly in PMDD.
        </p>
      </Card>

      {/* 2. Prevalence */}
      <Card className="p-5 mb-4">
        <SectionTitle>2. Symptom Prevalence</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Condition</Th><Th>Prevalence</Th><Th>Source</Th></tr>
            </thead>
            <tbody>
              {prevalenceRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td className="text-muted-foreground">{r[2]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          ~50% of women self-report PMS, but fewer than 25% meet strict clinical criteria when prospective 2-cycle diary monitoring is applied.
        </p>
      </Card>

      {/* 3. Severity by cycle day */}
      <Card className="p-5 mb-4">
        <SectionTitle>3. Severity by Cycle Day</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          From an analysis of 570,123 cycles (MedRxiv 2022): somatic symptoms peak in the late luteal phase (days 24–28) and are lowest in the mid-follicular phase (days 6–10).
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr>
                <Th>Symptom</Th>
                <Th>Menses</Th><Th>Follicular</Th><Th>Ovulation</Th><Th>Early Luteal</Th><Th>Late Luteal</Th>
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
      </Card>

      {/* 4. Age & BMI */}
      <Card className="p-5 mb-4">
        <SectionTitle>4. Age & BMI Differences</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">Age</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Physical symptoms (bloating, breast tenderness, weight gain) peak in the late 20s to mid-30s and decline toward perimenopause.</li>
          <li>Mood and irritability symptoms remain relatively stable across reproductive years but can intensify during the perimenopausal transition.</li>
          <li>Adolescents report high prevalence of cramps and mood symptoms but lower rates of breast tenderness.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">BMI</h3>
        <p className="text-sm text-foreground/80">
          Higher BMI does not cause luteal symptoms but appears to amplify cravings, emotional eating, and fatigue via leptin-mediated mechanisms. Weight management, physical activity, and mood support are especially helpful for women with elevated BMI and significant luteal symptoms.
        </p>
      </Card>

      {/* 5. Management */}
      <Card className="p-5 mb-4">
        <SectionTitle>5. Evidence-Based Management</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          ACOG 2023 and Cochrane reviews recommend a stepwise approach: lifestyle and nutrition → targeted supplementation → pharmacotherapy for moderate-to-severe or PMDD cases.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/80">
          <li><strong>Diet:</strong> reduce sodium, caffeine, alcohol; increase complex carbs and tryptophan-rich foods.</li>
          <li><strong>Exercise:</strong> 150 min/week moderate aerobic activity reduces both physical and mood symptoms.</li>
          <li><strong>Sleep:</strong> 7–9 h, consistent schedule; protect circadian melatonin in the late luteal phase.</li>
          <li><strong>CBT & MBSR:</strong> emerging evidence for reducing irritability and emotional reactivity.</li>
          <li><strong>SSRIs:</strong> first-line for PMDD; effective at low doses, often given luteal-phase only.</li>
        </ul>
      </Card>

      {/* 6. Supplements */}
      <Card className="p-5 mb-4">
        <SectionTitle>6. Supplements (Evidence Summary)</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Supplement</Th><Th>Dose</Th><Th>Targets</Th><Th>Evidence</Th></tr>
            </thead>
            <tbody>
              {supplementRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td>{r[2]}</Td>
                  <Td><span className="text-primary font-semibold">{r[3]}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Source: PMC11723155 — systematic review of 31 RCTs, n=3,254. Always consult a healthcare provider before starting supplements.
        </p>
      </Card>

      {/* 7. Lifestyle tips */}
      <Card className="p-5 mb-4">
        <SectionTitle>7. Lifestyle Quick-Reference</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1 text-magenta">Nutrition</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Small, frequent meals every 3–4 hours</li>
              <li>Complex carbs: oats, quinoa, sweet potato</li>
              <li>Tryptophan-rich foods: turkey, eggs, seeds</li>
              <li>Anti-inflammatory: berries, leafy greens, fatty fish</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-tangerine">Movement & Mindset</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Gentle movement: walking, yoga, swimming</li>
              <li>Mindfulness 10–15 min/day reduces irritability</li>
              <li>Plan demanding tasks during follicular phase</li>
              <li>Track symptoms — predictability reduces anxiety</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 8. PMS vs PMDD */}
      <Card className="p-5 mb-4">
        <SectionTitle>8. PMS vs PMDD — When to See a Doctor</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Feature</Th><Th>Normal</Th><Th>PMS</Th><Th>PMDD</Th></tr>
            </thead>
            <tbody>
              {pmsPmddRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td>{r[3]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          PMDD is significantly under-diagnosed; women wait an average of 12 years for an accurate diagnosis. Track symptoms prospectively for 2–3 cycles before your appointment.
        </p>
      </Card>

      {/* 9. Consensus */}
      <Card className="p-5 mb-4">
        <SectionTitle>9. Research Consensus & Controversies</SectionTitle>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-primary mb-1">Consensus</p>
            <p className="text-foreground/80">Hormonal fluctuations of progesterone and oestradiol drive cyclic physical symptoms in most women. SSRIs are effective for PMDD. Lifestyle interventions help across severity levels.</p>
          </div>
          <div>
            <p className="font-semibold text-magenta mb-1">Controversy</p>
            <p className="text-foreground/80">Diagnostic criteria for luteal phase defect (LPD) remain unstandardized. Cultural and methodological differences explain wide variability in PMS prevalence estimates (10%–98% across countries).</p>
          </div>
        </div>
      </Card>

      {/* 10. References */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="refs" className="border rounded-2xl px-4 bg-card">
          <AccordionTrigger className="text-sm font-display font-semibold">Key References</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
              <li>ACOG Clinical Practice Guideline (2023). Management of PMS and PMDD.</li>
              <li>Dennerstein L et al. (2011–2012). Epidemiology of premenstrual symptoms.</li>
              <li>Direkvand-Moghadam A et al. (2014). Epidemiology of PMS: A Systematic Review.</li>
              <li>PMC11723155 (2024). Systematic review of nutritional interventions for PMS (31 RCTs).</li>
              <li>PMC9066446 (2022). Allopregnanolone, GABA, and PMDD pathophysiology.</li>
              <li>MedRxiv (2022). Menstrual cycle symptoms in 570,123 cycles from a tracking app.</li>
              <li>PMC11823361 (2025). Age-stratified premenstrual disorder severity, Brazil.</li>
              <li>Cochrane reviews on calcium, vitamin B6, magnesium, and vitamin D for PMS.</li>
              <li>DSM-5 criteria for Premenstrual Dysphoric Disorder.</li>
              <li>Merck Manual: Menstrual Cycle and Premenstrual Syndrome.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Disclaimer text={t.educationalDisclaimer} />
    </div>
  );
};

export default LutealPhasePage;
