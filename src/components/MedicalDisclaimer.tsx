import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    title: "Not medical advice",
    body: "This app provides wellness and educational information only. It is not medical advice, diagnosis, or treatment. Always consult a qualified medical professional for any health concerns.",
    short: "Wellness & educational info only — not medical advice. Always consult a qualified medical professional.",
  },
  es: {
    title: "No es consejo médico",
    body: "Esta aplicación ofrece únicamente información educativa y de bienestar. No constituye consejo médico, diagnóstico ni tratamiento. Consulta siempre a un profesional médico calificado ante cualquier inquietud de salud.",
    short: "Información educativa y de bienestar — no es consejo médico. Consulta siempre a un profesional médico calificado.",
  },
};

interface Props {
  variant?: "banner" | "inline";
  className?: string;
}

export const MedicalDisclaimer = ({ variant = "inline", className }: Props) => {
  const { lang } = useI18n();
  const copy = COPY[lang];

  if (variant === "banner") {
    return (
      <Alert className={cn("border-tangerine/40 bg-tangerine/5", className)}>
        <AlertTriangle className="h-4 w-4 text-tangerine" />
        <AlertTitle className="text-sm font-semibold">{copy.title}</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed">{copy.body}</AlertDescription>
      </Alert>
    );
  }

  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{copy.short}</span>
    </p>
  );
};

export default MedicalDisclaimer;
