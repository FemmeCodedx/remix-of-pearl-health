import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es";

const translations = {
  en: {
    home: "Home",
    track: "Track",
    sync: "Sync",
    learn: "Learn",
    community: "Community",
    welcome: "Welcome to",
    appName: "FEMME",
    tagline: "Your body. Your rhythm. Your power.",
    todayCycle: "Today's Cycle",
    day: "Day",
    phase: "Phase",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",
    menstrual: "Menstrual",
    logPeriod: "Log Period",
    logSymptom: "Log Symptom",
    cycleSync: "Cycle Syncing",
    nutrition: "Nutrition",
    exercise: "Exercise",
    selfCare: "Self-Care",
    hormoneEd: "Hormone Education",
    estrogen: "Estrogen",
    progesterone: "Progesterone",
    testosterone: "Testosterone",
    mentalHealth: "Mental Health",
    breathe: "Breathe",
    journal: "Journal",
    moodTracker: "Mood Tracker",
    articles: "Articles",
    resources: "Resources",
    womanOfWeek: "Woman of the Week",
    settings: "Settings",
    language: "Language",
    startTracking: "Start Tracking",
    nextPeriod: "Next Period",
    daysAway: "days away",
    currentPhase: "Current Phase",
    howFeeling: "How are you feeling?",
    great: "Great",
    good: "Good",
    okay: "Okay",
    notGreat: "Not great",
    foodSwaps: "Food Swaps",
    birthControl: "Birth Control",
    bcGuide: "Your Guide to Birth Control",
    comingOff: "Coming Off",
    weaningOff: "Weaning Off",
    facts: "Facts to Know",
    explore: "Explore",
    readMore: "Read More",
    cycleSyncDesc: "Align your lifestyle with your cycle for optimal wellness",
    hormoneDesc: "Understanding the hormones that power your body",
    mentalHealthDesc: "Tools and resources for your emotional wellbeing",
    communityDesc: "Curated content and resources from experts",
    featuredArticle: "Featured Article",
    quickTips: "Quick Tips",
  },
  es: {
    home: "Inicio",
    track: "Rastrear",
    sync: "Sincro",
    learn: "Aprender",
    community: "Comunidad",
    welcome: "Bienvenida a",
    appName: "FEMME",
    tagline: "Tu cuerpo. Tu ritmo. Tu poder.",
    todayCycle: "Ciclo de Hoy",
    day: "Día",
    phase: "Fase",
    follicular: "Folicular",
    ovulation: "Ovulación",
    luteal: "Lútea",
    menstrual: "Menstrual",
    logPeriod: "Registrar Período",
    logSymptom: "Registrar Síntoma",
    cycleSync: "Sincronización del Ciclo",
    nutrition: "Nutrición",
    exercise: "Ejercicio",
    selfCare: "Autocuidado",
    hormoneEd: "Educación Hormonal",
    estrogen: "Estrógeno",
    progesterone: "Progesterona",
    testosterone: "Testosterona",
    mentalHealth: "Salud Mental",
    breathe: "Respirar",
    journal: "Diario",
    moodTracker: "Rastreador de Ánimo",
    articles: "Artículos",
    resources: "Recursos",
    womanOfWeek: "Mujer de la Semana",
    settings: "Configuración",
    language: "Idioma",
    startTracking: "Comenzar a Rastrear",
    nextPeriod: "Próximo Período",
    daysAway: "días restantes",
    currentPhase: "Fase Actual",
    howFeeling: "¿Cómo te sientes?",
    great: "Genial",
    good: "Bien",
    okay: "Regular",
    notGreat: "No tan bien",
    foodSwaps: "Intercambios de Alimentos",
    birthControl: "Anticoncepción",
    bcGuide: "Tu Guía de Anticoncepción",
    comingOff: "Dejarlo",
    weaningOff: "Reducir",
    facts: "Datos Importantes",
    explore: "Explorar",
    readMore: "Leer Más",
    cycleSyncDesc: "Alinea tu estilo de vida con tu ciclo para un bienestar óptimo",
    hormoneDesc: "Entendiendo las hormonas que impulsan tu cuerpo",
    mentalHealthDesc: "Herramientas y recursos para tu bienestar emocional",
    communityDesc: "Contenido curado y recursos de expertos",
    featuredArticle: "Artículo Destacado",
    quickTips: "Consejos Rápidos",
  },
};

type Translations = typeof translations.en;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
