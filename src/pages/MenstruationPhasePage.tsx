import { Link } from "react-router-dom";
import { ArrowLeft, Download, Droplet } from "lucide-react";
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
  const colors = ["bg-magenta/15", "bg-magenta/35", "bg-magenta/60", "bg-magenta"];
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`w-2 h-4 rounded-sm ${i <= level ? colors[level - 1] : "bg-muted"}`} />
      ))}
    </div>
  );
};

const MenstruationPhasePage = () => {
  const { t, lang } = useI18n();

  const hormoneRows = [
    { day: "Day 1", e2: "Very low ↓", p4: "Crashed ↓↓", pg: "Peak ↑↑", effect: "Maximum cramping; bleeding onset; GI effects" },
    { day: "Day 2", e2: "Very low", p4: "Near zero", pg: "Very high", effect: "Peak pain & heavy flow; systemic symptoms" },
    { day: "Day 3", e2: "Starting ↑", p4: "Near zero", pg: "Declining", effect: "Bleeding heaviest; some symptom relief" },
    { day: "Day 4", e2: "Rising ↑", p4: "Low", pg: "Low–moderate", effect: "Pain easing; energy improving" },
    { day: "Day 5", e2: "Moderate ↑", p4: "Low", pg: "Low", effect: "Bleeding ending; follicular recovery begins" },
  ];

  const prevalenceRows = [
    ["Any menstrual pain (dysmenorrhea)", "45–95%", "WHO systematic review; multiple meta-analyses"],
    ["Primary dysmenorrhea (no pelvic pathology)", "17–81%", "WHO 2006 systematic review (global)"],
    ["Severe dysmenorrhea", "12–14%", "WHO systematic review"],
    ["School/work absence from period pain", "Up to 15%", "Primary dysmenorrhea review PMC10309238"],
    ["Daily activities impacted", "~65.7%", "Portugal cross-sectional study"],
    ["Sought medical help for dysmenorrhea", "Only 14–28%", "India n=1,000; Portugal — grossly under-treated"],
    ["Fatigue / tiredness during menses", "Most common symptom", "India dysmenorrhea study (n=1,000)"],
    ["Sleep disturbance on Days 1–2", "~28%", "National Sleep Foundation Women & Sleep Poll"],
    ["Endometriosis (secondary)", "~10% of reproductive-age women", "Global prevalence estimates"],
  ];

  const severityRows: Array<{ symptom: string; values: (1 | 2 | 3 | 4)[] }> = [
    { symptom: "Cramps", values: [4, 4, 3, 2, 1] },
    { symptom: "Heavy flow", values: [3, 4, 4, 2, 1] },
    { symptom: "Nausea", values: [3, 3, 2, 1, 1] },
    { symptom: "Headache", values: [3, 3, 2, 1, 1] },
    { symptom: "Fatigue", values: [4, 4, 3, 2, 2] },
    { symptom: "Low mood", values: [3, 2, 1, 1, 1] },
    { symptom: "Energy (rising)", values: [1, 1, 2, 3, 4] },
  ];

  const nutritionRows = [
    ["Iron-rich foods", "Replace blood-loss iron; prevent fatigue", "STRONG", "Red meat, lentils, spinach, fortified grains"],
    ["Vitamin C with iron", "Triples non-haem iron absorption", "STRONG", "Citrus, peppers, berries with iron-rich meals"],
    ["Magnesium", "Smooth-muscle relaxation; cramp reduction", "MODERATE", "Pumpkin seeds, dark chocolate, almonds; 200–360 mg/day"],
    ["Omega-3 (EPA/DHA)", "Reduces prostaglandin synthesis", "MODERATE (multiple RCTs)", "Oily fish 2x/week; 1–2 g/day fish oil"],
    ["Hydration", "Reduces headache; supports flow", "STRONG", "2–3 L/day; warm fluids may ease cramps"],
    ["Limit caffeine & alcohol", "Both worsen cramps and dehydration", "MODERATE", "Minimise on Days 1–3"],
    ["Ginger", "Anti-nausea; mild anti-inflammatory", "Promising; AAFP says insufficient", "Fresh ginger tea, 250 mg capsules"],
  ];

  const primaryVsSecondaryRows = [
    ["Cause", "No identifiable pelvic pathology", "Endometriosis, adenomyosis, fibroids, PID"],
    ["Onset", "Within 6–12 months of menarche", "Years after menarche; new pain in 30s+"],
    ["Pain timing", "Starts with bleeding; eases by Day 3", "Often begins before bleeding; lasts longer"],
    ["Trajectory", "Often improves with age & childbirth", "Worsens year-on-year"],
    ["Other symptoms", "Limited to menses", "Dyspareunia, bowel symptoms, mid-cycle pain"],
    ["First-line workup", "Clinical diagnosis; trial NSAIDs", "Pelvic exam, ultrasound, gynaecology referral"],
  ];

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-magenta/10 flex items-center justify-center text-magenta">
          <Droplet size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Menstruation Phase
          </h1>
          <p className="text-sm text-muted-foreground">A research-based clinical overview · Compiled May 2026</p>
        </div>
      </div>

      <a href="/resources/menstruation-phase-report.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mb-5">
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
        <SectionTitle>1. What Is the Menstruation Phase?</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Menstruation marks Day 1 of the cycle. When implantation does not occur, oestradiol and progesterone fall sharply from luteal peaks. This withdrawal triggers <strong>prostaglandin</strong> release (mainly PGF2α and PGE2) from the endometrium, causing uterine contractions, vasoconstriction, ischaemia, and shedding of the lining. Bleeding normally lasts 2–7 days.
        </p>
        <p className="text-sm text-foreground/80 mb-4">
          Prostaglandins also act systemically on GI smooth muscle (nausea, diarrhoea) and blood vessels (headache, dizziness) — explaining the broad symptom cluster.
        </p>
        <h3 className="text-sm font-semibold mb-2">Hormonal & prostaglandin profile</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Day</Th><Th>Oestradiol</Th><Th>Progesterone</Th><Th>Prostaglandins</Th><Th>Primary effect</Th></tr>
            </thead>
            <tbody>
              {hormoneRows.map((r) => (
                <tr key={r.day}>
                  <Td><strong>{r.day}</strong></Td><Td>{r.e2}</Td><Td>{r.p4}</Td><Td>{r.pg}</Td><Td>{r.effect}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Mechanism:</strong> Women with dysmenorrhea have significantly higher prostaglandin concentrations in menstrual fluid. NSAIDs block COX-mediated synthesis — first-line treatment.
        </p>
      </Card>

      {/* 2. Prevalence */}
      <Card className="p-5 mb-4">
        <SectionTitle>2. Symptom Prevalence & Epidemiology</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Condition</Th><Th>Prevalence</Th><Th>Source</Th></tr>
            </thead>
            <tbody>
              {prevalenceRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td className="text-muted-foreground">{r[2]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Dysmenorrhea is the leading cause of school and work absenteeism among menstruating people worldwide — yet remains undertreated and under-reported.
        </p>
      </Card>

      {/* 3. Severity by day */}
      <Card className="p-5 mb-4">
        <SectionTitle>3. Severity by Day of Bleeding</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Symptom burden tracks prostaglandin levels — highest on Day 1, falling over subsequent days.
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr>
                <Th>Symptom</Th><Th>Day 1</Th><Th>Day 2</Th><Th>Day 3</Th><Th>Day 4</Th><Th>Day 5</Th>
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
        <p className="text-sm text-foreground/80 mb-3">
          A 2023 systematic review of 77 studies (PMC9819475) identified factors associated with dysmenorrhea severity:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li><strong>Age ≥ 20:</strong> OR 1.18 — peaks in 20s–30s, then declines.</li>
          <li><strong>Low BMI (&lt;18.5):</strong> OR 1.51 — significantly higher risk.</li>
          <li><strong>High stress:</strong> OR 1.88 — central sensitisation amplifies pain.</li>
          <li><strong>Short sleep (&lt;7 h):</strong> OR 1.19; late bedtime (&gt;23:00): OR 1.30.</li>
          <li><strong>Smoking:</strong> consistently worsens dysmenorrhea.</li>
        </ul>
        <p className="text-sm text-foreground/80">
          <strong>Perimenopause note:</strong> primary dysmenorrhea usually improves with age, but secondary causes (endometriosis, adenomyosis) often worsen or newly present in the 30s–40s. Worsening pain in this window warrants evaluation.
        </p>
      </Card>

      {/* 5. Management */}
      <Card className="p-5 mb-4">
        <SectionTitle>5. Evidence-Based Management</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">NSAIDs (first-line)</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Gold standard — superior to placebo and acetaminophen across 35+ RCTs.</li>
          <li>No NSAID is clearly superior; ibuprofen, naproxen and mefenamic acid all effective.</li>
          <li><strong>Start 1–2 days before expected menses</strong> if predictable to pre-empt the prostaglandin surge.</li>
          <li>Take with food to protect the stomach lining.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">Hormonal options</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Combined OCPs and the levonorgestrel IUD reduce flow and pain in many users.</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1">Non-pharmacological</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/80">
          <li><strong>Heat:</strong> 40 °C heat pad to lower abdomen for 30–60 min — comparable to NSAIDs in some trials.</li>
          <li><strong>TENS:</strong> high-frequency reduces pain signalling; safe wearable option.</li>
          <li><strong>Gentle exercise:</strong> yoga, walking — improves flow and endorphins.</li>
          <li><strong>Acupuncture:</strong> small RCTs promising; Cochrane evidence not yet conclusive.</li>
          <li><strong>Smoking cessation:</strong> formally recommended.</li>
        </ul>
      </Card>

      {/* 6. Nutrition */}
      <Card className="p-5 mb-4">
        <SectionTitle>6. Nutrition & Supplementation</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Nutrient / Strategy</Th><Th>Role</Th><Th>Evidence</Th><Th>Foods / Dose</Th></tr>
            </thead>
            <tbody>
              {nutritionRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td>
                  <Td><span className="text-magenta font-semibold">{r[2]}</span></Td>
                  <Td className="text-muted-foreground">{r[3]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          AAFP 2021 considers evidence insufficient to specifically recommend fenugreek, fish oil alone, ginger, valerian, or zinc for dysmenorrhea — though omega-3s and magnesium show promising benefit in individual RCTs.
        </p>
      </Card>

      {/* 7. Lifestyle */}
      <Card className="p-5 mb-4">
        <SectionTitle>7. Lifestyle Quick-Reference</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1 text-magenta">Pain relief</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Heat pad to lower abdomen (40 °C, 30–60 min)</li>
              <li>Start NSAIDs 1–2 days before period if predictable</li>
              <li>TENS device on high-frequency setting</li>
              <li>Hot bath/shower for systemic muscle relaxation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-tangerine">Rest & wellbeing</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground/80">
              <li>Iron-rich foods + vitamin C every day (Days 1–5)</li>
              <li>Small frequent meals if Day 1–2 nausea</li>
              <li>Prioritise sleep — heat pad reduces night cramps</li>
              <li>Track cycles to anticipate Day 1 and plan ahead</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 8. Primary vs secondary */}
      <Card className="p-5 mb-4">
        <SectionTitle>8. Primary vs Secondary Dysmenorrhea</SectionTitle>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead>
              <tr><Th>Feature</Th><Th>Primary</Th><Th>Secondary</Th></tr>
            </thead>
            <tbody>
              {primaryVsSecondaryRows.map((r) => (
                <tr key={r[0]}>
                  <Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td>{r[2]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold mt-4 mb-1">See a doctor if:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
          <li>Period pain worsens year-on-year</li>
          <li>Pain occurs outside menses (mid-cycle or constant)</li>
          <li>Pain during/after intercourse, or bowel symptoms with menses</li>
          <li>Soaking a pad/tampon hourly for 2+ consecutive hours</li>
          <li>Dizziness or syncope with bleeding (urgent care)</li>
          <li>Symptoms impair work, school, or daily life despite treatment</li>
          <li>Trying to conceive — endometriosis warrants early diagnosis</li>
        </ul>
      </Card>

      {/* 9. Consensus */}
      <Card className="p-5 mb-4">
        <SectionTitle>9. Research Consensus & Controversies</SectionTitle>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-primary mb-1">Consensus</p>
            <p className="text-foreground/80">Prostaglandins drive primary dysmenorrhea. NSAIDs are first-line. Heat is genuinely effective. Dysmenorrhea is severely under-treated globally — only 14–28% of affected women seek help.</p>
          </div>
          <div>
            <p className="font-semibold text-magenta mb-1">Controversy</p>
            <p className="text-foreground/80">Causality between low BMI and dysmenorrhea is unclear (does undernutrition worsen pain, or does pain reduce intake?). Optimal evidence base for ginger, fish oil and acupuncture is still evolving. Reasons for the global care gap (normalisation vs clinician under-recognition vs systemic barriers) vary by country.</p>
          </div>
        </div>
      </Card>

      {/* References */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="refs" className="border rounded-2xl px-4 bg-card">
          <AccordionTrigger className="text-sm font-display font-semibold">Key References</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
              <li>AAFP (2021). Dysmenorrhea: Diagnosis and Treatment. Am Fam Physician 104(2).</li>
              <li>Bajalan Z et al. (2023). Factors Associated with Menstrual-Related Symptoms — Systematic Review (77 studies). PMC9819475.</li>
              <li>Ferries-Rowe E et al. (2020). Primary Dysmenorrhea: Diagnosis and Therapy. Obstet Gynecol 136(5).</li>
              <li>WHO (2006). Systematic review of dysmenorrhea prevalence.</li>
              <li>StatPearls — Dysmenorrhea (NBK560834).</li>
              <li>PMC10309238 — Primary dysmenorrhea narrative review.</li>
              <li>PMC5585876 — Menstrual symptom cluster epidemiology.</li>
              <li>National Sleep Foundation — Women & Sleep Poll.</li>
              <li>Cochrane reviews — NSAIDs, heat therapy, acupuncture for dysmenorrhea.</li>
              <li>ACOG — Adolescent dysmenorrhea management.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Disclaimer text={t.educationalDisclaimer} />
    </div>
  );
};

export default MenstruationPhasePage;
