import { Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, HeartPulse, ExternalLink, ShieldAlert, Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-display font-bold text-foreground mb-3">{children}</h2>
);

type Hotline = {
  name: string;
  display: string;
  href: string;
  icon: typeof Phone;
  desc: string;
  available: string;
};

const content = {
  en: {
    subtitle: "Crisis support, equity data, and resources for pregnancy and postpartum.",
    crisisHeading: "If you need help right now",
    crisisEmergency: (
      <>If you or someone you know is in immediate danger, call <a href="tel:911" className="font-bold text-magenta underline">911</a>.</>
    ),
    hotlines: [
      { name: "National Maternal Mental Health Hotline", display: "1-833-TLC-MAMA", href: "tel:18338526262", icon: Phone,
        desc: "Free, confidential 24/7 support in English & Spanish for pregnant and new mothers.", available: "24/7 · EN/ES · Call or text" },
      { name: "Postpartum Support International", display: "1-800-944-4773", href: "tel:18009444773", icon: Phone,
        desc: "Help line for postpartum depression, anxiety, and perinatal mood disorders. Press 1 for Spanish.", available: "Call or text · EN/ES" },
      { name: "Crisis Text Line", display: "Text HOME to 741741", href: "sms:741741?body=HOME", icon: MessageSquare,
        desc: "Free 24/7 text support with a trained crisis counselor.", available: "24/7 · Text only" },
      { name: "988 Suicide & Crisis Lifeline", display: "Call or text 988", href: "tel:988", icon: ShieldAlert,
        desc: "24/7 nationwide crisis support for anyone in emotional distress.", available: "24/7 · EN/ES" },
    ] as Hotline[],
    warningTitle: "Urgent Warning Signs — Get Care Now",
    warningIntro: "During pregnancy and up to one year postpartum, call your provider or go to the ER for any of these:",
    warningSigns: [
      "Severe headache that won't go away",
      "Vision changes (blurriness, spots, flashes)",
      "Chest pain or trouble breathing",
      "Heavy bleeding (soaking a pad in 1 hour)",
      "Severe swelling in face, hands, or one leg",
      "Fever of 100.4°F (38°C) or higher",
      "Thoughts of harming yourself or your baby",
      "Severe pain in belly that doesn't go away",
    ],
    warningSource: 'Source: CDC "Hear Her" campaign · AWHONN Postpartum Discharge Education.',
    statsTitle: "The State of Maternal Health",
    stats: [
      { value: "17.9", unit: "per 100K", label: "U.S. maternal mortality rate — highest among developed nations" },
      { value: "87%", unit: "", label: "of pregnancy-related deaths are considered preventable" },
      { value: "57%", unit: "", label: "of maternal deaths occur 1 week to 1 year postpartum" },
      { value: "3×", unit: "", label: "Black women's risk of dying from pregnancy-related causes vs white women" },
    ],
    statsSource: "Sources: CDC Pregnancy Mortality Surveillance System · Commonwealth Fund · MMRC reports.",
    disparitiesTitle: "Racial & Structural Disparities",
    disparitiesIntro: (
      <>Maternal outcomes in the U.S. are not distributed equally. The disparities below persist <strong>across income and education levels</strong> — meaning structural racism, not poverty alone, drives the gap.</>
    ),
    disparities: [
      { group: "Black women", risk: "≈ 3× higher", note: "Highest mortality of any racial/ethnic group; gap persists across income and education." },
      { group: "Native / Indigenous women", risk: "≈ 2× higher", note: "Compounded by rural access barriers and chronic underfunding of IHS facilities." },
      { group: "Latina women", risk: "Elevated severe morbidity", note: "Hemorrhage, preeclampsia and language-access barriers contribute." },
      { group: "Women in rural areas", risk: "60% live in maternity care deserts", note: "Lack of nearby OB providers delays critical care." },
    ],
    factorsTitle: "Social & Structural Factors",
    factors: [
      { title: "Access to care", desc: "Insurance gaps, provider shortages, and maternity care deserts delay diagnosis of preeclampsia, hemorrhage, and infection." },
      { title: "Implicit bias in clinical settings", desc: "Pain reports from Black and brown patients are more often dismissed; symptoms get attributed to non-medical causes." },
      { title: "Insurance & Medicaid coverage", desc: "Postpartum Medicaid coverage now extends 12 months in most states — but gaps remain in 4 states." },
      { title: "Doula & midwife access", desc: "Continuous labor support reduces C-sections, preterm birth, and improves satisfaction. Coverage is expanding state by state." },
      { title: "Chronic conditions", desc: "Hypertension, diabetes, and cardiovascular disease are leading contributors — preconception care matters." },
      { title: "Mental health", desc: "Suicide and overdose are leading causes of postpartum death in the first year." },
    ],
    rightsTitle: "Know Your Rights in Pregnancy & Birth",
    rights: [
      { title: "Informed consent", desc: "You have the right to a clear explanation of every procedure, its risks, alternatives, and to ask questions before agreeing." },
      { title: "Right to refuse", desc: "You can decline any test, intervention, or medication — including induction, episiotomy, or cesarean — without it affecting your care." },
      { title: "Birth plan & preferences", desc: "Your birth plan must be respected when medically safe. Bring a written copy and have it added to your chart." },
      { title: "Support person", desc: "You have the right to have a support person, partner, or doula present during labor and postpartum (with hospital policy adjustments)." },
      { title: "Second opinion", desc: "You can request another provider or a transfer of care if you feel dismissed or unsafe." },
      { title: "Medical records", desc: "Under HIPAA you can access, copy, and request corrections to your records." },
      { title: "Language access", desc: "Federally funded providers must offer free interpreter services — never use a family member as your medical interpreter." },
    ],
    rightsSource: "Based on the WHO Charter on Respectful Maternity Care and U.S. patient rights law.",
    resourcesTitle: "Resource Directory",
    federalHeading: "Federal programs & coverage",
    doulaHeading: "Doula & midwife support",
    advocacyHeading: "Advocacy & equity organizations",
    federal: [
      { name: "WIC (Women, Infants & Children)", url: "https://www.fns.usda.gov/wic", desc: "Free nutrition, breastfeeding support, and food benefits for pregnant and postpartum women." },
      { name: "Medicaid & CHIP", url: "https://www.medicaid.gov/medicaid/eligibility/index.html", desc: "Pregnancy and postpartum coverage — many states now extend 12 months postpartum." },
      { name: "Maternal & Child Health Bureau (HRSA)", url: "https://mchb.hrsa.gov/", desc: "Federal programs for maternal and infant health, including home visiting." },
      { name: "Healthy Start", url: "https://mchb.hrsa.gov/programs-impact/healthy-start", desc: "Community-based programs in high-risk areas to reduce infant mortality." },
    ],
    doulas: [
      { name: "DONA International", url: "https://www.dona.org/", desc: "Find a certified birth or postpartum doula." },
      { name: "HealthConnect One", url: "https://www.healthconnectone.org/", desc: "Community-based doula and peer counselor programs." },
      { name: "National Black Doulas Association", url: "https://www.blackdoulas.org/", desc: "Directory of Black-identified doulas across the U.S." },
      { name: "Ancient Song Doula Services", url: "https://www.ancientsongdoulaservices.com/", desc: "Reproductive justice training and doula care for Black, Indigenous & people of color." },
    ],
    advocacy: [
      { name: "Black Mamas Matter Alliance", url: "https://blackmamasmatter.org/", desc: "Black women-led advocacy for maternal health, rights, and justice." },
      { name: "National Birth Equity Collaborative", url: "https://birthequity.org/", desc: "Research, training, and policy to end racial inequities in birth outcomes." },
      { name: "Postpartum Support International", url: "https://www.postpartum.net/", desc: "Resources, provider directory, and support groups for perinatal mental health." },
      { name: "Every Mother Counts", url: "https://everymothercounts.org/", desc: "Global advocacy and grants for maternal health equity." },
      { name: "March of Dimes", url: "https://www.marchofdimes.org/", desc: "Education and advocacy for maternal & infant health, including preterm birth prevention." },
      { name: "SisterSong", url: "https://www.sistersong.net/", desc: "Reproductive justice collective centering women of color." },
    ],
    disclaimerEmergency: (
      <> If you are experiencing a medical emergency, call <a href="tel:911" className="font-bold text-foreground underline">911</a> immediately.</>
    ),
  },
  es: {
    subtitle: "Apoyo en crisis, datos de equidad y recursos para el embarazo y el posparto.",
    crisisHeading: "Si necesitas ayuda ahora mismo",
    crisisEmergency: (
      <>Si tú o alguien que conoces está en peligro inmediato, llama al <a href="tel:911" className="font-bold text-magenta underline">911</a>.</>
    ),
    hotlines: [
      { name: "Línea Nacional de Salud Mental Materna", display: "1-833-TLC-MAMA", href: "tel:18338526262", icon: Phone,
        desc: "Apoyo gratuito y confidencial 24/7 en inglés y español para embarazadas y madres recientes.", available: "24/7 · EN/ES · Llamada o texto" },
      { name: "Postpartum Support International", display: "1-800-944-4773", href: "tel:18009444773", icon: Phone,
        desc: "Línea de ayuda para depresión posparto, ansiedad y trastornos del estado de ánimo perinatal. Marca 1 para español.", available: "Llamada o texto · EN/ES" },
      { name: "Crisis Text Line", display: "Envía HOME al 741741", href: "sms:741741?body=HOME", icon: MessageSquare,
        desc: "Apoyo gratuito por mensaje de texto 24/7 con un consejero de crisis capacitado.", available: "24/7 · Solo texto" },
      { name: "988 Línea de Prevención del Suicidio y Crisis", display: "Llama o envía un texto al 988", href: "tel:988", icon: ShieldAlert,
        desc: "Apoyo nacional 24/7 para cualquier persona en angustia emocional.", available: "24/7 · EN/ES" },
    ] as Hotline[],
    warningTitle: "Señales de Alerta Urgentes — Busca Atención Ahora",
    warningIntro: "Durante el embarazo y hasta un año después del parto, llama a tu proveedor o ve a la sala de emergencias si tienes alguno de estos síntomas:",
    warningSigns: [
      "Dolor de cabeza intenso que no se quita",
      "Cambios en la visión (borrosa, manchas, destellos)",
      "Dolor en el pecho o dificultad para respirar",
      "Sangrado abundante (empapas una toalla en 1 hora)",
      "Hinchazón severa en cara, manos o una pierna",
      "Fiebre de 38 °C (100.4 °F) o más",
      "Pensamientos de hacerte daño a ti o a tu bebé",
      "Dolor abdominal severo que no cede",
    ],
    warningSource: 'Fuente: campaña "Hear Her" de los CDC · Educación de Alta Posparto de AWHONN.',
    statsTitle: "El Estado de la Salud Materna",
    stats: [
      { value: "17.9", unit: "por 100K", label: "tasa de mortalidad materna en EE. UU. — la más alta entre países desarrollados" },
      { value: "87%", unit: "", label: "de las muertes relacionadas con el embarazo se consideran prevenibles" },
      { value: "57%", unit: "", label: "de las muertes maternas ocurren entre 1 semana y 1 año después del parto" },
      { value: "3×", unit: "", label: "más riesgo de morir por causas del embarazo para mujeres negras vs. mujeres blancas" },
    ],
    statsSource: "Fuentes: Sistema de Vigilancia de Mortalidad en el Embarazo de los CDC · Commonwealth Fund · informes MMRC.",
    disparitiesTitle: "Disparidades Raciales y Estructurales",
    disparitiesIntro: (
      <>Los resultados maternos en EE. UU. no se distribuyen de forma equitativa. Las disparidades a continuación persisten <strong>en todos los niveles de ingreso y educación</strong> — lo que significa que el racismo estructural, no solo la pobreza, impulsa la brecha.</>
    ),
    disparities: [
      { group: "Mujeres negras", risk: "≈ 3× más alto", note: "La mortalidad más alta de cualquier grupo racial/étnico; la brecha persiste en todos los niveles de ingreso y educación." },
      { group: "Mujeres nativas / indígenas", risk: "≈ 2× más alto", note: "Agravado por barreras de acceso rural y subfinanciación crónica de los centros del IHS." },
      { group: "Mujeres latinas", risk: "Mayor morbilidad severa", note: "Hemorragias, preeclampsia y barreras de acceso lingüístico contribuyen al riesgo." },
      { group: "Mujeres en zonas rurales", risk: "60% viven en desiertos de atención materna", note: "La falta de proveedores obstétricos cercanos retrasa la atención crítica." },
    ],
    factorsTitle: "Factores Sociales y Estructurales",
    factors: [
      { title: "Acceso a la atención", desc: "Las brechas de seguro, la escasez de proveedores y los desiertos de atención materna retrasan el diagnóstico de preeclampsia, hemorragia e infección." },
      { title: "Sesgo implícito en entornos clínicos", desc: "Los reportes de dolor de pacientes negras y morenas se descartan con más frecuencia; los síntomas se atribuyen a causas no médicas." },
      { title: "Cobertura de seguro y Medicaid", desc: "La cobertura posparto de Medicaid ahora se extiende 12 meses en la mayoría de los estados — pero quedan brechas en 4 estados." },
      { title: "Acceso a doulas y parteras", desc: "El apoyo continuo durante el parto reduce las cesáreas, los partos prematuros y mejora la satisfacción. La cobertura se amplía estado por estado." },
      { title: "Condiciones crónicas", desc: "Hipertensión, diabetes y enfermedades cardiovasculares son contribuyentes principales — la atención preconcepcional importa." },
      { title: "Salud mental", desc: "El suicidio y la sobredosis son causas principales de muerte posparto en el primer año." },
    ],
    rightsTitle: "Conoce Tus Derechos en el Embarazo y el Parto",
    rights: [
      { title: "Consentimiento informado", desc: "Tienes derecho a una explicación clara de cada procedimiento, sus riesgos, alternativas, y a hacer preguntas antes de aceptar." },
      { title: "Derecho a rechazar", desc: "Puedes rechazar cualquier prueba, intervención o medicación — incluyendo inducción, episiotomía o cesárea — sin que afecte tu atención." },
      { title: "Plan de parto y preferencias", desc: "Tu plan de parto debe respetarse cuando sea médicamente seguro. Lleva una copia escrita y agrégala a tu expediente." },
      { title: "Persona de apoyo", desc: "Tienes derecho a tener una persona de apoyo, pareja o doula presente durante el parto y el posparto (según las políticas del hospital)." },
      { title: "Segunda opinión", desc: "Puedes solicitar otro proveedor o una transferencia de atención si te sientes ignorada o insegura." },
      { title: "Expediente médico", desc: "Bajo HIPAA puedes acceder, copiar y solicitar correcciones a tu expediente médico." },
      { title: "Acceso a idioma", desc: "Los proveedores con financiamiento federal deben ofrecer servicios gratuitos de intérprete — nunca uses a un familiar como intérprete médico." },
    ],
    rightsSource: "Basado en la Carta de la OMS sobre Atención Materna Respetuosa y la ley de derechos del paciente en EE. UU.",
    resourcesTitle: "Directorio de Recursos",
    federalHeading: "Programas y cobertura federales",
    doulaHeading: "Apoyo de doulas y parteras",
    advocacyHeading: "Organizaciones de defensa y equidad",
    federal: [
      { name: "WIC (Mujeres, Infantes y Niños)", url: "https://www.fns.usda.gov/wic", desc: "Nutrición gratuita, apoyo a la lactancia y beneficios alimentarios para mujeres embarazadas y posparto." },
      { name: "Medicaid y CHIP", url: "https://www.medicaid.gov/medicaid/eligibility/index.html", desc: "Cobertura para embarazo y posparto — muchos estados extienden 12 meses posparto." },
      { name: "Oficina de Salud Materno-Infantil (HRSA)", url: "https://mchb.hrsa.gov/", desc: "Programas federales de salud materna e infantil, incluidas visitas a domicilio." },
      { name: "Healthy Start", url: "https://mchb.hrsa.gov/programs-impact/healthy-start", desc: "Programas comunitarios en zonas de alto riesgo para reducir la mortalidad infantil." },
    ],
    doulas: [
      { name: "DONA International", url: "https://www.dona.org/", desc: "Encuentra una doula de parto o posparto certificada." },
      { name: "HealthConnect One", url: "https://www.healthconnectone.org/", desc: "Programas comunitarios de doulas y consejeras pares." },
      { name: "National Black Doulas Association", url: "https://www.blackdoulas.org/", desc: "Directorio de doulas que se identifican como negras en todo EE. UU." },
      { name: "Ancient Song Doula Services", url: "https://www.ancientsongdoulaservices.com/", desc: "Capacitación en justicia reproductiva y atención de doulas para personas negras, indígenas y de color." },
    ],
    advocacy: [
      { name: "Black Mamas Matter Alliance", url: "https://blackmamasmatter.org/", desc: "Defensa liderada por mujeres negras por la salud, los derechos y la justicia materna." },
      { name: "National Birth Equity Collaborative", url: "https://birthequity.org/", desc: "Investigación, capacitación y políticas para acabar con las inequidades raciales en los resultados del parto." },
      { name: "Postpartum Support International", url: "https://www.postpartum.net/", desc: "Recursos, directorio de proveedores y grupos de apoyo para salud mental perinatal." },
      { name: "Every Mother Counts", url: "https://everymothercounts.org/", desc: "Defensa global y subvenciones para la equidad en salud materna." },
      { name: "March of Dimes", url: "https://www.marchofdimes.org/", desc: "Educación y defensa por la salud materna e infantil, incluida la prevención del parto prematuro." },
      { name: "SisterSong", url: "https://www.sistersong.net/", desc: "Colectivo de justicia reproductiva que centra a las mujeres de color." },
    ],
    disclaimerEmergency: (
      <> Si estás teniendo una emergencia médica, llama al <a href="tel:911" className="font-bold text-foreground underline">911</a> de inmediato.</>
    ),
  },
};

const MaternalHealthPage = () => {
  const { t, lang } = useI18n();
  const c = content[lang];

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
            {t.maternalHealthTitle.replace(/^Deep Dive: |^Profundiza: /, "")}
          </h1>
          <p className="text-sm text-muted-foreground">{c.subtitle}</p>
        </div>
      </div>

      {/* Crisis hotlines */}
      <Card className="p-5 mb-4 bg-gradient-to-br from-magenta/15 via-primary/5 to-tangerine/10 border-magenta/30">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-magenta" />
          <h2 className="text-lg font-display font-bold text-foreground">{c.crisisHeading}</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{c.crisisEmergency}</p>
        <div className="space-y-2.5">
          {c.hotlines.map((h) => {
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

      {/* Warning signs */}
      <Card className="p-5 mb-4 border-tangerine/30">
        <SectionTitle>{c.warningTitle}</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">{c.warningIntro}</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
          {c.warningSigns.map((s) => (
            <li key={s} className="flex gap-2 p-2 rounded-lg bg-tangerine/5 border border-tangerine/20">
              <span className="text-tangerine font-bold">!</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs italic text-muted-foreground mt-3">{c.warningSource}</p>
      </Card>

      {/* Stats */}
      <Card className="p-5 mb-4">
        <SectionTitle>{c.statsTitle}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {c.stats.map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-magenta/5 border border-border">
              <p className="text-2xl font-display font-bold text-magenta">
                {s.value} <span className="text-xs font-normal text-muted-foreground">{s.unit}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] italic text-muted-foreground">{c.statsSource}</p>
      </Card>

      {/* Disparities */}
      <Card className="p-5 mb-4">
        <SectionTitle>{c.disparitiesTitle}</SectionTitle>
        <p className="text-sm text-foreground/80 mb-3">{c.disparitiesIntro}</p>
        <div className="space-y-2">
          {c.disparities.map((d) => (
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

      {/* Factors */}
      <Card className="p-5 mb-4">
        <SectionTitle>{c.factorsTitle}</SectionTitle>
        <ul className="space-y-3">
          {c.factors.map((f) => (
            <li key={f.title} className="text-sm">
              <p className="font-semibold text-foreground">{f.title}</p>
              <p className="text-foreground/80">{f.desc}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Rights */}
      <Card className="p-5 mb-4">
        <SectionTitle>{c.rightsTitle}</SectionTitle>
        <ul className="space-y-3">
          {c.rights.map((r) => (
            <li key={r.title} className="p-3 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm font-bold text-foreground mb-1">{r.title}</p>
              <p className="text-xs text-foreground/80">{r.desc}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs italic text-muted-foreground mt-3">{c.rightsSource}</p>
      </Card>

      {/* Resources */}
      <Card className="p-5 mb-4">
        <SectionTitle>{c.resourcesTitle}</SectionTitle>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-2">{c.federalHeading}</h3>
        <div className="space-y-2 mb-4">
          {c.federal.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-soft transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground flex items-center gap-1">{r.name} <ExternalLink size={12} className="text-muted-foreground" /></p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">{c.doulaHeading}</h3>
        <div className="space-y-2 mb-4">
          {c.doulas.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border hover:shadow-soft transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground flex items-center gap-1">{r.name} <ExternalLink size={12} className="text-muted-foreground" /></p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">{c.advocacyHeading}</h3>
        <div className="space-y-2">
          {c.advocacy.map((r) => (
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
            {t.educationalDisclaimer}{c.disclaimerEmergency}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MaternalHealthPage;
