import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { ArrowLeft, Download, Snowflake } from "lucide-react";
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

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left font-semibold p-2 border-b border-border bg-muted/40">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-2 align-top border-b border-border/60 ${className}`}>{children}</td>
);

const EggFreezingPage = () => {
  const { t, lang } = useI18n();

  const ageRows = [
    ["25–30", "~5–7% per egg", "Highest egg quality; ideal window"],
    ["30–34", "~4–6% per egg", "Strong outcomes; still prime time"],
    ["35–37", "~3–5% per egg", "Declining slightly; act proactively"],
    ["38+", "~2–4% per egg", "Lower reserve; consult REI promptly"],
  ];

  const stepRows = [
    ["1", "Initial Consultation & Fertility Assessment (Weeks 1–2)", "Meet a reproductive endocrinologist (REI). Baseline AMH bloodwork and transvaginal ultrasound count antral follicles to predict ovarian response."],
    ["2", "Ovarian Stimulation (Days 1–10)", "Daily self-injected hormones (FSH/LH) for ~9–12 days stimulate multiple follicles. Monitoring scans and bloodwork every 2–3 days."],
    ["3", "Trigger Shot (~36 h before retrieval)", "hCG or GnRH agonist finalises egg maturation. Timing is precise — usually exactly 36 hours before retrieval."],
    ["4", "Egg Retrieval (20–30 min outpatient)", "Under IV sedation, a thin needle aspirates eggs from each follicle via ultrasound guidance. Home the same day."],
    ["5", "Assessment & Vitrification", "Embryologist evaluates maturity. Mature MII oocytes are flash-frozen at −196 °C, preventing damaging ice crystals."],
    ["6", "Storage", "Eggs stored in liquid nitrogen — viable 10+ years. Annual fees typically $500–$1,000."],
    ["7", "Thaw, Fertilize, Transfer", "When ready: warm, fertilise via ICSI, culture embryos, and transfer to uterus. Separate IVF cycle with its own costs."],
  ];

  const nutritionRows = [
    ["Antioxidant-rich foods", "Protect eggs from oxidative damage", "Berries, leafy greens, sweet potato, bell peppers"],
    ["Healthy fats (omega-3s)", "Support hormone production & cell membranes", "Salmon, sardines, walnuts, flaxseed, avocado"],
    ["Whole grains", "Regulate blood sugar & hormone balance", "Quinoa, brown rice, oats, farro"],
    ["Plant-based proteins", "Reduce inflammation", "Lentils, black beans, chickpeas, edamame"],
    ["Folate-rich foods", "Critical for cell division & DNA health", "Dark leafy greens, lentils, asparagus, fortified grains"],
    ["Full-fat dairy (moderate)", "Linked to improved ovulatory function", "Whole milk yogurt, cheese in moderation"],
  ];

  const lifestyleRows = [
    ["Exercise", "Moderate movement (walking, yoga, swimming) encouraged. Avoid HIIT during stimulation to prevent ovarian torsion."],
    ["Sleep", "7–9 hours/night. Sleep deprivation disrupts reproductive hormones."],
    ["Alcohol", "Minimise or eliminate — even moderate intake impacts egg quality."],
    ["Caffeine", "Limit to 1 cup/day."],
    ["Smoking / Vaping", "Stop ASAP — accelerates egg quality decline."],
    ["Stress", "Chronic stress raises cortisol and disrupts hormonal balance."],
    ["Environmental toxins", "Reduce BPA, phthalates, pesticides where possible."],
    ["Body weight", "Both extremes affect egg quality — work with a provider on sustainable approaches."],
  ];

  const supplements = [
    { name: "Prenatal with methylfolate", note: "Start 3 months before retrieval. Methylfolate preferred if MTHFR variant present (more common in WOC)." },
    { name: "CoQ10 / Ubiquinol (200–600 mg/day)", note: "Antioxidant supporting mitochondrial function in eggs; may improve quality, especially over 30." },
    { name: "Vitamin D (1,000–2,000 IU/day)", note: "Deficiency disproportionately common in WOC (melanin reduces UV synthesis); linked to lower IVF success." },
    { name: "Omega-3 (EPA/DHA)", note: "Supports egg membrane health and reduces inflammation." },
    { name: "Iron", note: "Low iron is linked to ovulatory dysfunction. Test levels first." },
  ];

  const finance = [
    ["Tinina Q. Cade Foundation", "Grants up to $10,000 for infertility treatment & adoption — focus on families of color.", "cadefoundation.org"],
    ["Baby Quest Foundation", "Grants for IVF, egg freezing, and other treatments.", "babyquestfoundation.org"],
    ["RESOLVE Financial Resources", "Loans, grants, shared-risk programs, insurance navigation.", "resolve.org"],
    ["Compassionate Care Program", "EMD Serono medication discount program for qualified patients.", "emdserono.com"],
    ["LendingClub / CapexMD", "Specialised fertility financing with flexible terms.", "capexmd.com"],
    ["Insurance / Employer Benefits", "16 US states mandate fertility coverage as of 2024. Many large employers now cover egg freezing.", "ncsl.org"],
  ];

  const orgs = [
    { name: "Fertility for Colored Girls", site: "fertilityforcoloredgirls.org", desc: "Education, advocacy and support groups for Black women experiencing infertility, miscarriage and loss." },
    { name: "The Broken Brown Egg", site: "thebrokenbrownegg.org", desc: "Community forums and stories for the Black community experiencing infertility." },
    { name: "The Resilient Sisterhood Project", site: "resilientsisters.org", desc: "Education on fibroids, endometriosis and PCOS in women of African descent." },
    { name: "Sister Girl Foundation", site: "sistergirlconnect.com", desc: "Endometriosis awareness and specialist locator for Black women." },
    { name: "Sisters in Loss", site: "sistersinloss.com", desc: "Doula, bereavement and grief support for Black women experiencing pregnancy loss and infertility." },
    { name: "Therapy for Black Girls", site: "therapyforblackgirls.com", desc: "Find therapists specialising in fertility grief and reproductive trauma." },
    { name: "PMHA for People of Color", site: "pmhapoc.org", desc: "Bridges perinatal mental health gaps for birthing persons of color." },
    { name: "RESOLVE", site: "resolve.org", desc: "National infertility advocacy: clinic finder, support groups, insurance guides." },
  ];

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Seo title="Egg Freezing Guide — Process, Cost & What to Expect | Pearl Femme" description="A clear, evidence-based egg-freezing guide: the process, timeline, costs, success factors, and questions to ask your clinic." path="/learn/egg-freezing" />
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Snowflake size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Your Fertility Journey: Egg Freezing
          </h1>
          <p className="text-sm text-muted-foreground">Fertility preservation for Women of Color · Ages 25–38</p>
        </div>
      </div>

      <a href="/resources/egg-freezing-guide.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mb-5">
        <Button variant="outline" size="sm" className="gap-2 rounded-full">
          <Download size={14} /> {t.downloadFullPdf}
        </Button>
      </a>

      {lang === "es" && (
        <Card className="p-3 mb-5 bg-tangerine/10 border-tangerine/30">
          <p className="text-xs text-foreground">{t.spanishComingSoon}</p>
        </Card>
      )}

      {/* Stats banner */}
      <Card className="p-5 mb-4 bg-gradient-to-br from-primary/10 via-magenta/5 to-tangerine/10">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-display font-bold text-primary">1 in 6</p>
            <p className="text-[11px] text-muted-foreground">couples affected by infertility nationwide</p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-magenta">2×</p>
            <p className="text-[11px] text-muted-foreground">Black women more likely to experience infertility than white women</p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-tangerine">50%</p>
            <p className="text-[11px] text-muted-foreground">less likely for Black women to seek fertility treatment</p>
          </div>
        </div>
        <p className="text-[11px] italic text-muted-foreground mt-3 text-center">Sources: CDC NSFG · Shady Grove Fertility · Journal of Clinical Medicine (2024)</p>
      </Card>

      {/* 1. Why this guide */}
      <Card className="p-5 mb-4">
        <SectionTitle>1. Why This Guide Matters</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Fertility decisions are deeply personal — and for women of color, they are also shaped by a healthcare landscape that has not always been equitable, inclusive, or well-informed about our unique medical needs. This guide gives you clear, research-backed information so you can make empowered choices about your reproductive future.
        </p>
        <p className="text-xs italic text-muted-foreground">
          For informational purposes only. Always consult a board-certified reproductive endocrinologist (REI) before beginning any fertility treatment.
        </p>
      </Card>

      {/* 2. What is egg freezing */}
      <Card className="p-5 mb-4">
        <SectionTitle>2. Understanding Fertility & Egg Freezing</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Egg freezing — medically called <strong>oocyte cryopreservation</strong> — is a fertility preservation method in which a woman's eggs are extracted, frozen, and stored for future use. When ready, eggs are thawed, fertilised with sperm via ICSI, and the resulting embryos are transferred to the uterus.
        </p>
        <p className="text-sm text-foreground/80 mb-4">
          ASRM officially recognised it as non-experimental in 2012. Advances in <strong>vitrification</strong> (flash-freezing) have dramatically improved egg survival rates.
        </p>
        <h3 className="text-sm font-semibold mb-2">Success rate by age at freezing</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead><tr><Th>Age</Th><Th>Estimated success per egg</Th><Th>Key consideration</Th></tr></thead>
            <tbody>
              {ageRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td>{r[2]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Estimates from SART. Experts typically recommend freezing <strong>10–20 mature eggs</strong> to maximise the chance of one future pregnancy.</p>
      </Card>

      {/* 3. Disparities */}
      <Card className="p-5 mb-4">
        <SectionTitle>3. Racial Disparities in Fertility Care</SectionTitle>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/80 mb-3">
          <li><strong>Medical mistrust</strong> rooted in a documented history of exploitation and abuse.</li>
          <li><strong>Financial barriers:</strong> $10,000–$15,000 per cycle plus $500–$1,000/year storage. Only 16 US states mandate coverage.</li>
          <li><strong>Implicit bias</strong> affects referral patterns and care quality, often delaying diagnosis.</li>
          <li><strong>Cultural stigma</strong> and persistent myths (e.g. that Black women are "naturally fertile") discourage help-seeking.</li>
          <li><strong>Lack of representation</strong> — few REIs identify as Black or Hispanic.</li>
          <li><strong>Higher rates of fibroids and tubal disease</strong> can complicate fertility and go undiagnosed longer.</li>
        </ul>
        <div className="p-3 rounded-xl bg-magenta/5 border border-magenta/20">
          <p className="text-sm text-foreground/80">
            <strong>Self-advocacy:</strong> bring a written list of symptoms and questions, ask for plain-language explanations, request interpreters, look for clinics with explicit DEI commitments, and consider a fertility doula or patient advocate.
          </p>
        </div>
      </Card>

      {/* 4. Process */}
      <Card className="p-5 mb-4">
        <SectionTitle>4. The Egg Freezing Process, Step by Step</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">From first consultation to retrieval typically takes <strong>6–10 weeks</strong>. The stimulation and retrieval phase itself is about 2 weeks.</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead><tr><Th>Step</Th><Th>Stage</Th><Th>What happens</Th></tr></thead>
            <tbody>
              {stepRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td><strong>{r[1]}</strong></Td><Td>{r[2]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3"><strong>Side effects:</strong> bloating, mild cramping, mood swings, breast tenderness during stimulation are normal. <strong>OHSS</strong> (ovarian hyperstimulation) is rare but serious — clinics monitor closely.</p>
      </Card>

      {/* 5. Body care */}
      <Card className="p-5 mb-4">
        <SectionTitle>5. Body Care, Nutrition & Lifestyle</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">Eggs take ~90 days to mature. The <strong>3 months before retrieval</strong> is your prime support window.</p>
        <p className="text-sm text-foreground/80 mb-3">A <strong>Mediterranean-style</strong> eating pattern is associated with ~40% higher IVF success vs diets high in processed and fried foods (FertilityIQ, 2024).</p>

        <h3 className="text-sm font-semibold mb-2">Nutrition</h3>
        <div className="overflow-x-auto -mx-2 mb-4">
          <table className="w-full text-xs mx-2">
            <thead><tr><Th>Food group</Th><Th>Why it matters</Th><Th>Examples</Th></tr></thead>
            <tbody>
              {nutritionRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td className="text-muted-foreground">{r[2]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold mb-2">Key supplements (discuss with your doctor)</h3>
        <ul className="space-y-2 text-sm text-foreground/80 mb-4">
          {supplements.map((s) => (
            <li key={s.name}><strong className="text-primary">{s.name}</strong> — {s.note}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mb-4">Always inform your fertility clinic of every supplement and medication before starting stimulation.</p>

        <h3 className="text-sm font-semibold mb-2">Lifestyle</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead><tr><Th>Factor</Th><Th>Recommendation</Th></tr></thead>
            <tbody>
              {lifestyleRows.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. Provider */}
      <Card className="p-5 mb-4">
        <SectionTitle>6. Finding the Right Provider</SectionTitle>
        <h3 className="text-sm font-semibold mb-1">What to look for</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-4">
          <li>Board certification in <strong>Reproductive Endocrinology & Infertility (REI)</strong></li>
          <li>SART membership (standardised quality benchmarks)</li>
          <li>Transparent CDC/SART success rates by age</li>
          <li>Inclusive culture — explicit DEI / BIPOC programs</li>
          <li>Clear upfront financial guidance</li>
          <li>Patient navigator or coordinator support</li>
        </ul>

        <h3 className="text-sm font-semibold mb-1">Questions to ask</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-4">
          <li>What does my AMH indicate about ovarian reserve?</li>
          <li>How many eggs should I aim to freeze for my profile?</li>
          <li>Should I address fibroids, PCOS, or endometriosis first?</li>
          <li>What stimulation protocol — and how is it adjusted?</li>
          <li>How will OHSS risk be monitored?</li>
          <li>What is the full cost (medication, monitoring, storage)?</li>
          <li>Do you have providers experienced caring for Black or Latina patients?</li>
        </ul>

        <h3 className="text-sm font-semibold mb-1">Culturally competent specialists</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
          <li><strong>Cofertility's Black Fertility Doctor Directory</strong> — cofertility.com/family-learn/black-fertility-doctors</li>
          <li><strong>Shady Grove Fertility</strong> — FertilityEquity™ program (with Morehouse) — shadygrovefertility.com</li>
          <li><strong>Laurel Fertility Care</strong> (San Francisco, Dr. Collin Smikle) — laurelfertility.com</li>
          <li><strong>NYU Langone Fertility Center</strong> — fertilityny.org</li>
          <li><strong>RESOLVE Clinic Finder</strong> — resolve.org/find-a-doctor/</li>
        </ul>
      </Card>

      {/* 7. Financial */}
      <Card className="p-5 mb-4">
        <SectionTitle>7. Financial Resources & Assistance</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">A single cycle can cost $10,000–$15,000 plus $5,000–$7,000+ in medications and ongoing storage.</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs mx-2">
            <thead><tr><Th>Resource</Th><Th>Description</Th><Th>Website</Th></tr></thead>
            <tbody>
              {finance.map((r) => (
                <tr key={r[0]}><Td><strong>{r[0]}</strong></Td><Td>{r[1]}</Td><Td className="text-muted-foreground">{r[2]}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3"><strong>Pro tip:</strong> ask clinics about <em>shared-risk</em> or <em>refund</em> programs that guarantee a refund if no live birth occurs after a set number of IVF cycles.</p>
      </Card>

      {/* 8. Support orgs */}
      <Card className="p-5 mb-4">
        <SectionTitle>8. Support Organizations</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">You don't have to navigate this alone — these organisations specifically serve women of color and BIPOC communities.</p>
        <ul className="space-y-2 text-sm text-foreground/80">
          {orgs.map((o) => (
            <li key={o.name}>
              <strong className="text-primary">{o.name}</strong> · <span className="text-muted-foreground">{o.site}</span>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* 9. Checklist */}
      <Card className="p-5 mb-4">
        <SectionTitle>9. Master Checklist</SectionTitle>
        <h3 className="text-sm font-semibold mb-1 text-primary">3–6 months before (body prep)</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Preconception check-up; bloodwork: AMH, FSH, Vitamin D, iron, thyroid, CBC</li>
          <li>Start prenatal with methylfolate; consider CoQ10/Ubiquinol</li>
          <li>Mediterranean-style eating; reduce alcohol; eliminate smoking/vaping</li>
          <li>Limit caffeine to 1 cup/day; moderate exercise 3–5×/week</li>
          <li>7–9 h sleep; address chronic stress; reduce BPA/phthalates</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1 text-magenta">Choosing your provider</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Research SART-member clinics; consult at least 2 before choosing</li>
          <li>Ask about stimulation protocols, OHSS monitoring, all costs and insurance</li>
          <li>Trust your gut — you should feel heard and respected</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1 text-tangerine">During stimulation</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 mb-3">
          <li>Take injections at consistent times; attend every monitoring appointment</li>
          <li>Report severe bloating, breathlessness, or extreme pain immediately</li>
          <li>Avoid HIIT; stay hydrated; arrange a driver for retrieval day</li>
          <li>Avoid alcohol and NSAIDs unless cleared</li>
        </ul>
        <h3 className="text-sm font-semibold mb-1 text-primary">After retrieval & ongoing</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
          <li>Confirm number of mature eggs frozen with embryologist</li>
          <li>Understand storage terms, fees and renewal timeline</li>
          <li>Connect with community; consider counselling for grief/anxiety</li>
          <li>Celebrate yourself — this is a brave, powerful step</li>
        </ul>
      </Card>

      {/* References */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="refs" className="border rounded-2xl px-4 bg-card">
          <AccordionTrigger className="text-sm font-display font-semibold">Sources & References</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
              <li>Gadson AK, Sauerbrun-Cutler MT, Eaton JL (2024). Racial Disparities in Fertility Care: A Narrative Review. <em>J Clin Med</em> 13(4):1060.</li>
              <li>CDC National Survey of Family Growth.</li>
              <li>American Society for Reproductive Medicine (ASRM) — Egg Freezing Guidelines.</li>
              <li>SART — Society for Assisted Reproductive Technology, IVF cycle data.</li>
              <li>Shady Grove Fertility (2024) reports.</li>
              <li>FertilityIQ — Mediterranean diet and IVF outcomes.</li>
              <li>Fertility for Colored Girls; The Broken Brown Egg; PMHA for People of Color.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-[11px] italic text-muted-foreground text-center">{t.educationalDisclaimer}</p>
    </div>
  );
};

export default EggFreezingPage;
