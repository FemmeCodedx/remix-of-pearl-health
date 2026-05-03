import { Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, HeartPulse, ExternalLink, ShieldAlert, Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-display font-bold text-foreground mb-3">{children}</h2>
);

type Hotline = {
  name: string;
  number: string;
  display: string;
  href: string;
  icon: typeof Phone;
  desc: string;
  available: string;
};

const hotlines: Hotline[] = [
  {
    name: "National Maternal Mental Health Hotline",
    number: "1-833-852-6262",
    display: "1-833-TLC-MAMA",
    href: "tel:18338526262",
    icon: Phone,
    desc: "Free, confidential 24/7 support in English & Spanish for pregnant and new mothers.",
    available: "24/7 · EN/ES · Call or text",
  },
  {
    name: "Postpartum Support International",
    number: "1-800-944-4773",
    display: "1-800-944-4773",
    href: "tel:18009444773",
    icon: Phone,
    desc: "Help line for postpartum depression, anxiety, and perinatal mood disorders. Press 1 for Spanish.",
    available: "Call or text · EN/ES",
  },
  {
    name: "Crisis Text Line",
    number: "741741",
    display: "Text HOME to 741741",
    href: "sms:741741?body=HOME",
    icon: MessageSquare,
    desc: "Free 24/7 text support with a trained crisis counselor.",
    available: "24/7 · Text only",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    display: "Call or text 988",
    href: "tel:988",
    icon: ShieldAlert,
    desc: "24/7 nationwide crisis support for anyone in emotional distress.",
    available: "24/7 · EN/ES",
  },
];

const stats = [
  { value: "17.9", unit: "per 100K", label: "U.S. maternal mortality rate — highest among developed nations" },
  { value: "87%", unit: "", label: "of pregnancy-related deaths are considered preventable" },
  { value: "57%", unit: "", label: "of maternal deaths occur 1 week to 1 year postpartum" },
  { value: "3×", unit: "", label: "Black women's risk of dying from pregnancy-related causes vs white women" },
];

const disparities = [
  { group: "Black women", risk: "≈ 3× higher", note: "Highest mortality of any racial/ethnic group; gap persists across income and education." },
  { group: "Native / Indigenous women", risk: "≈ 2× higher", note: "Compounded by rural access barriers and chronic underfunding of IHS facilities." },
  { group: "Latina women", risk: "Elevated severe morbidity", note: "Hemorrhage, preeclampsia and language-access barriers contribute." },
  { group: "Women in rural areas", risk: "60% live in maternity care deserts", note: "Lack of nearby OB providers delays critical care." },
];

const factors = [
  { title: "Access to care", desc: "Insurance gaps, provider shortages, and maternity care deserts delay diagnosis of preeclampsia, hemorrhage, and infection." },
  { title: "Implicit bias in clinical settings", desc: "Pain reports from Black and brown patients are more often dismissed; symptoms get attributed to non-medical causes." },
  { title: "Insurance & Medicaid coverage", desc: "Postpartum Medicaid coverage now extends 12 months in most states — but gaps remain in 4 states." },
  { title: "Doula & midwife access", desc: "Continuous labor support reduces C-sections, preterm birth, and improves satisfaction. Coverage is expanding state by state." },
  { title: "Chronic conditions", desc: "Hypertension, diabetes, and cardiovascular disease are leading contributors — preconception care matters." },
  { title: "Mental health", desc: "Suicide and overdose are leading causes of postpartum death in the first year." },
];

const rights = [
  { title: "Informed consent", desc: "You have the right to a clear explanation of every procedure, its risks, alternatives, and to ask questions before agreeing." },
  { title: "Right to refuse", desc: "You can decline any test, intervention, or medication — including induction, episiotomy, or cesarean — without it affecting your care." },
  { title: "Birth plan & preferences", desc: "Your birth plan must be respected when medically safe. Bring a written copy and have it added to your chart." },
  { title: "Support person", desc: "You have the right to have a support person, partner, or doula present during labor and postpartum (with hospital policy adjustments)." },
  { title: "Second opinion", desc: "You can request another provider or a transfer of care if you feel dismissed or unsafe." },
  { title: "Medical records", desc: "Under HIPAA you can access, copy, and request corrections to your records." },
  { title: "Language access", desc: "Federally funded providers must offer free interpreter services — never use a family member as your medical interpreter." },
];

type Resource = { name: string; url: string; desc: string };
const federal: Resource[] = [
  { name: "WIC (Women, Infants & Children)", url: "https://www.fns.usda.gov/wic", desc: "Free nutrition, breastfeeding support, and food benefits for pregnant and postpartum women." },
  { name: "Medicaid & CHIP", url: "https://www.medicaid.gov/medicaid/eligibility/index.html", desc: "Pregnancy and postpartum coverage — many states now extend 12 months postpartum." },
  { name: "Maternal & Child Health Bureau (HRSA)", url: "https://mchb.hrsa.gov/", desc: "Federal programs for maternal and infant health, including home visiting." },
  { name: "Healthy Start", url: "https://mchb.hrsa.gov/programs-impact/healthy-start", desc: "Community-based programs in high-risk areas to reduce infant mortality." },
];

const doulas: Resource[] = [
  { name: "DONA International", url: "https://www.dona.org/", desc: "Find a certified birth or postpartum doula." },
  { name: "HealthConnect One", url: "https://www.healthconnectone.org/", desc: "Community-based doula and peer counselor programs." },
  { name: "National Black Doulas Association", url: "https://www.blackdoulas.org/", desc: "Directory of Black-identified doulas across the U.S." },
  { name: "Ancient Song Doula Services", url: "https://www.ancientsongdoulaservices.com/", desc: "Reproductive justice training and doula care for Black, Indigenous & people of color." },
];

const advocacy: Resource[] = [
  { name: "Black Mamas Matter Alliance", url: "https://blackmamasmatter.org/", desc: "Black women-led advocacy for maternal health, rights, and justice." },
  { name: "National Birth Equity Collaborative", url: "https://birthequity.org/", desc: "Research, training, and policy to end racial inequities in birth outcomes." },
  { name: "Postpartum Support International", url: "https://www.postpartum.net/", desc: "Resources, provider directory, and support groups for perinatal mental health." },
  { name: "Every Mother Counts", url: "https://everymothercounts.org/", desc: "Global advocacy and grants for maternal health equity." },
  { name: "March of Dimes", url: "https://www.marchofdimes.org/", desc: "Education and advocacy for maternal & infant health, including preterm birth prevention." },
  { name: "SisterSong", url: "https://www.sistersong.net/", desc: "Reproductive justice collective centering women of color." },
];

const warningSigns = [
  "Severe headache that won't go away",
  "Vision changes (blurriness, spots, flashes)",
  "Chest pain or trouble breathing",
  "Heavy bleeding (soaking a pad in 1 hour)",
  "Severe swelling in face, hands, or one leg",
  "Fever of 100.4°F (38°C) or higher",
  "Thoughts of harming yourself or your baby",
  "Severe pain in belly that doesn't go away",
];

const MaternalHealthPage = () => {
  const { t, lang } = useI18n();

  return (
    <div className="px-5 pt-6 pb-12 max-w-3xl mx-auto">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowLeft size={16} /> {t.learn}
      </Link>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-magenta/10 flex items-center justify-center text-magenta">
          <HeartPulse size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
            Maternal Health & Your Rights
          </h1>
          <p className="text-sm text-muted-foreground">Crisis support, equity data, and resources for pregnancy and postpartum.</p>
        </div>
      </div>

      {lang === "es" && (
        <Card className="p-3 mb-5 bg-tangerine/10 border-tangerine/30">
          <p className="text-xs text-foreground">{t.spanishComingSoon}</p>
        </Card>
      )}

      {/* Crisis hotlines — always at top */}
      <Card className="p-5 mb-4 bg-gradient-to-br from-magenta/15 via-primary/5 to-tangerine/10 border-magenta/30">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-magenta" />
          <h2 className="text-lg font-display font-bold text-foreground">If you need help right now</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          If you or someone you know is in immediate danger, call <a href="tel:911" className="font-bold text-magenta underline">911</a>.
        </p>
        <div className="space-y-2.5">
          {hotlines.map((h) => {
            const Icon = h.icon;
            return (
              <a
                key={h.name}
                href={h.href}
                className="flex items-start gap-3 p-3 rounded-xl bg-card hover:shadow-soft transition-all border border-border"
              >
                <div className="w-9 h-9 rounded-lg bg-magenta/10 flex items-center justify-center text-magenta shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{h.name}</p>
                  <p className="text-base font-display font-bold text-magenta mt-0.5">{h.display}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{h.desc}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80 mt-1 font-semibold">{h.available}</p>
                </div>
              </a>
            );
          })}
        </div>
      </Card>

      {/* Urgent warning signs */}
      <Card className="p-5 mb-4 border-tangerine/30">
        <SectionTitle>Urgent Warning Signs — Get Care Now</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">During pregnancy and up to one year postpartum, call your provider or go to the ER for any of these:</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
          {warningSigns.map((s) => (
            <li key={s} className="flex gap-2 p-2 rounded-lg bg-tangerine/5 border border-tangerine/20">
              <span className="text-tangerine font-bold">!</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs italic text-muted-foreground mt-3">Source: CDC "Hear Her" campaign · AWHONN Postpartum Discharge Education.</p>
      </Card>

      {/* Stats */}
      <Card className="p-5 mb-4">
        <SectionTitle>The State of Maternal Health</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {stats.map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-magenta/5 border border-border">
              <p className="text-2xl font-display font-bold text-magenta">
                {s.value} <span className="text-xs font-normal text-muted-foreground">{s.unit}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] italic text-muted-foreground">Sources: CDC Pregnancy Mortality Surveillance System · Commonwealth Fund · MMRC reports.</p>
      </Card>

      {/* Disparities */}
      <Card className="p-5 mb-4">
        <SectionTitle>Racial & Structural Disparities</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">
          Maternal outcomes in the U.S. are not distributed equally. The disparities below persist <strong>across income and education levels</strong> — meaning structural racism, not poverty alone, drives the gap.
        </p>
        <div className="space-y-2">
          {disparities.map((d) => (
            <div key={d.group} className="p-3 rounded-xl bg-card border border-border">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <p className="text-sm font-bold text-foreground">{d.group}</p>
                <p className="text-xs font-display font-bold text-magenta whitespace-nowrap">{d.risk}</p>
              </div>
              <p className="text-xs text-muted-foreground">{d.note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Social factors */}
      <Card className="p-5 mb-4">
        <SectionTitle>Social & Structural Factors</SectionTitle>
        <ul className="space-y-3">
          {factors.map((f) => (
            <li key={f.title} className="text-sm">
              <p className="font-semibold text-foreground">{f.title}</p>
              <p className="text-foreground/80">{f.desc}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Rights */}
      <Card className="p-5 mb-4">
        <SectionTitle>Know Your Rights in Pregnancy & Birth</SectionTitle>
        <ul className="space-y-3">
          {rights.map((r) => (
            <li key={r.title} className="p-3 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm font-bold text-foreground mb-1">{r.title}</p>
              <p className="text-xs text-foreground/80">{r.desc}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs italic text-muted-foreground mt-3">Based on the WHO Charter on Respectful Maternity Care and U.S. patient rights law.</p>
      </Card>

      {/* Resources */}
      <Card className="p-5 mb-4">
        <SectionTitle>Resource Directory</SectionTitle>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-2">Federal programs & coverage</h3>
        <div className="space-y-2 mb-4">
          {federal.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-soft transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground flex items-center gap-1">{r.name} <ExternalLink size={12} className="text-muted-foreground" /></p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">Doula & midwife support</h3>
        <div className="space-y-2 mb-4">
          {doulas.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-soft transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground flex items-center gap-1">{r.name} <ExternalLink size={12} className="text-muted-foreground" /></p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">Advocacy & equity organizations</h3>
        <div className="space-y-2">
          {advocacy.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-soft transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground flex items-center gap-1">{r.name} <ExternalLink size={12} className="text-muted-foreground" /></p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30">
        <div className="flex gap-2">
          <Baby size={16} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {t.educationalDisclaimer} If you are experiencing a medical emergency, call <a href="tel:911" className="font-bold text-foreground underline">911</a> immediately.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MaternalHealthPage;
