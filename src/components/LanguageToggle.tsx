import { useI18n } from "@/lib/i18n";

const LanguageToggle = () => {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-soft-pink text-foreground text-xs font-semibold tracking-wide transition-all hover:shadow-glow"
    >
      <span className={lang === "en" ? "opacity-100" : "opacity-50"}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "es" ? "opacity-100" : "opacity-50"}>ES</span>
    </button>
  );
};

export default LanguageToggle;
