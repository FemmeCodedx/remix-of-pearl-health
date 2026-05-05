import { useNavigate } from "react-router-dom";
import { ChevronLeft, Crown, Shell, Sparkles, Check, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSubscription,
  useOpenCustomerPortal,
  SubscriptionTier,
} from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

const tierMeta: Record<
  SubscriptionTier,
  { name: string; price: string; icon: typeof Crown; color: string; features: { en: string[]; es: string[] } }
> = {
  pearl: {
    name: "Pearl",
    price: "Free",
    icon: Shell,
    color: "bg-pearl text-foreground",
    features: {
      en: ["Basic cycle tracking", "Mood logging", "Cycle phase info", "Community access", "Educational articles"],
      es: ["Rastreo básico del ciclo", "Registro de ánimo", "Información de fases", "Acceso a la comunidad", "Artículos educativos"],
    },
  },
  swan: {
    name: "Swan",
    price: "$8",
    icon: Crown,
    color: "gradient-femme text-primary-foreground",
    features: {
      en: ["Everything in Pearl", "Save monthly plans", "Recipe lists", "Symptom tracking & reports", "Health report exports", "Food swap suggestions"],
      es: ["Todo lo de Pearl", "Guardar planes mensuales", "Listas de recetas", "Rastreo de síntomas e informes", "Exportar informes de salud", "Sugerencias de intercambio de alimentos"],
    },
  },
  ruby: {
    name: "Ruby",
    price: "$12",
    icon: Sparkles,
    color: "bg-destructive text-destructive-foreground",
    features: {
      en: ["Everything in Swan", "AI grocery list builder", "AI meal planning", "AI symptom analysis", "Personalized AI insights", "Priority support"],
      es: ["Todo lo de Swan", "Lista de compras con IA", "Planificación de comidas con IA", "Análisis de síntomas con IA", "Insights personalizados con IA", "Soporte prioritario"],
    },
  },
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { data: sub, isLoading } = useSubscription();
  const portal = useOpenCustomerPortal();
  const { toast } = useToast();
  const s = (t as any).subscription;

  if (!user) {
    navigate("/auth");
    return null;
  }

  const tier: SubscriptionTier = sub?.tier ?? "pearl";
  const meta = tierMeta[tier];
  const Icon = meta.icon;
  const isPaid = tier !== "pearl";
  const isCanceled = sub?.status === "canceled";
  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const openPortal = async () => {
    try {
      await portal.mutateAsync();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <>
      <PaymentTestModeBanner />
      <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
            aria-label={s.back}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold">{s.title}</h1>
            <p className="text-xs text-muted-foreground font-body">{s.subtitle}</p>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : (
          <>
            <div className="rounded-2xl bg-card shadow-card p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meta.color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-body">{s.currentPlan}</p>
                  <h2 className="font-display text-xl font-bold">{meta.name}</h2>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold">{meta.price}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {isPaid ? s.perMonth : s.free}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-body py-2 border-t border-border">
                <span className="text-muted-foreground">{s.status}</span>
                <span
                  className={`font-semibold ${
                    isCanceled ? "text-destructive" : "text-primary"
                  }`}
                >
                  {isCanceled ? s.canceled : s.active}
                </span>
              </div>

              {isPaid && periodEnd && (
                <div className="flex items-center justify-between text-sm font-body py-2 border-t border-border">
                  <span className="text-muted-foreground">
                    {isCanceled ? s.endsOn : s.renewsOn}
                  </span>
                  <span className="font-semibold">{periodEnd}</span>
                </div>
              )}

              {isCanceled && (
                <div className="mt-3 flex gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-body">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{s.canceledNotice}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-card shadow-card p-5 mb-4">
              <h3 className="font-display text-base font-bold mb-3">{s.includes}</h3>
              <ul className="space-y-2">
                {meta.features[lang].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-body">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full rounded-xl h-11 gradient-femme text-primary-foreground font-body font-semibold"
              >
                {isPaid ? (s.changePlan ?? s.upgrade) : s.upgrade}
              </Button>

              {isPaid && (
                <Button
                  onClick={openPortal}
                  disabled={portal.isPending}
                  variant="outline"
                  className="w-full rounded-xl h-11 font-body"
                >
                  {portal.isPending ? "..." : s.manage}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SubscriptionPage;
