import { Download, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const copy = {
  en: {
    title: "Install app",
    subtitle: "Add Pearl Femme to your home screen",
    installed: "Already installed",
    installedDesc: "You're using the installed app",
    iosTitle: "Add to Home Screen",
    iosDesc: "Tap the Share button, then \u201cAdd to Home Screen\u201d.",
  },
  es: {
    title: "Instalar app",
    subtitle: "Añade Pearl Femme a tu pantalla de inicio",
    installed: "Ya instalada",
    installedDesc: "Estás usando la app instalada",
    iosTitle: "Añadir a la pantalla de inicio",
    iosDesc: "Toca el botón Compartir y luego \u201cAñadir a la pantalla de inicio\u201d.",
  },
};

const InstallAppCard = () => {
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();
  const { toast } = useToast();
  const { lang } = useI18n();
  const c = copy[lang];

  if (installed) {
    return (
      <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card mb-3 opacity-70">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-bold text-foreground">{c.installed}</p>
          <p className="text-xs text-muted-foreground">{c.installedDesc}</p>
        </div>
      </div>
    );
  }

  if (!canInstall && !isIOS) return null;

  const handleClick = async () => {
    if (isIOS && !canInstall) {
      toast({ title: c.iosTitle, description: c.iosDesc });
      return;
    }
    await promptInstall();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft transition-all mb-3"
    >
      <div className="w-10 h-10 rounded-xl gradient-femme text-primary-foreground flex items-center justify-center">
        <Download className="w-5 h-5" />
      </div>
      <div className="text-left flex-1">
        <p className="text-sm font-bold text-foreground">{c.title}</p>
        <p className="text-xs text-muted-foreground">{c.subtitle}</p>
      </div>
    </button>
  );
};

export default InstallAppCard;
