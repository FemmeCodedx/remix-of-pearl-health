import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, useUpgradeSubscription, SubscriptionTier } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Shell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const tiers = [
  {
    id: "pearl" as SubscriptionTier,
    name: "Pearl",
    price: "Free",
    priceDetail: "forever",
    icon: Shell,
    color: "bg-pearl text-foreground",
    iconColor: "text-muted-foreground",
    borderColor: "border-border",
    features: [
      "Basic cycle tracking",
      "Mood logging",
      "Cycle phase info",
      "Community access",
      "Educational articles",
    ],
  },
  {
    id: "swan" as SubscriptionTier,
    name: "Swan",
    price: "$8",
    priceDetail: "/month",
    icon: Crown,
    color: "gradient-femme text-primary-foreground",
    iconColor: "text-primary-foreground",
    borderColor: "border-primary",
    popular: true,
    features: [
      "Everything in Pearl",
      "Save monthly plans",
      "Recipe lists",
      "Symptom tracking & reports",
      "Health report exports",
      "Food swap suggestions",
    ],
  },
  {
    id: "ruby" as SubscriptionTier,
    name: "Ruby",
    price: "$12",
    priceDetail: "/month",
    icon: Sparkles,
    color: "bg-destructive text-destructive-foreground",
    iconColor: "text-destructive-foreground",
    borderColor: "border-destructive",
    features: [
      "Everything in Swan",
      "AI grocery list builder",
      "AI meal planning",
      "AI symptom analysis",
      "Personalized AI insights",
      "Priority support",
    ],
  },
];

const rank: Record<SubscriptionTier, number> = { pearl: 0, swan: 1, ruby: 2 };

const copy = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Switch plans anytime — changes take effect immediately.",
    current: "Current Plan",
    free: "Free Forever",
    upgradeTo: (n: string) => `Upgrade to ${n}`,
    downgradeTo: (n: string) => `Switch to ${n}`,
    confirmTitle: (n: string) => `Switch to ${n}?`,
    confirmUpgrade: (n: string, p: string) =>
      `You'll be charged ${p}/month and unlock ${n} features immediately.`,
    confirmDowngrade: (n: string) =>
      `You'll move to ${n} immediately and lose access to higher-tier features. (No prorated refunds in this preview.)`,
    confirmFree: "You'll move to the free Pearl plan immediately and lose access to paid features.",
    confirm: "Confirm",
    cancel: "Cancel",
    updated: "Plan updated!",
    nowOn: (n: string) => `You're now on the ${n} plan.`,
    footer: "Payments are processed securely via Stripe. Cancel anytime.",
  },
  es: {
    title: "Elige tu Plan",
    subtitle: "Cambia de plan en cualquier momento — los cambios son inmediatos.",
    current: "Plan Actual",
    free: "Gratis para siempre",
    upgradeTo: (n: string) => `Mejorar a ${n}`,
    downgradeTo: (n: string) => `Cambiar a ${n}`,
    confirmTitle: (n: string) => `¿Cambiar a ${n}?`,
    confirmUpgrade: (n: string, p: string) =>
      `Se te cobrará ${p}/mes y obtendrás funciones de ${n} de inmediato.`,
    confirmDowngrade: (n: string) =>
      `Pasarás a ${n} de inmediato y perderás funciones de niveles superiores. (Sin reembolsos prorrateados en esta vista previa.)`,
    confirmFree: "Pasarás al plan gratuito Pearl de inmediato y perderás las funciones de pago.",
    confirm: "Confirmar",
    cancel: "Cancelar",
    updated: "¡Plan actualizado!",
    nowOn: (n: string) => `Ahora tienes el plan ${n}.`,
    footer: "Los pagos se procesan de forma segura con Stripe. Cancela cuando quieras.",
  },
};

const PricingPage = () => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { data: subscription } = useSubscription();
  const upgrade = useUpgradeSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const c = copy[lang];
  const [pending, setPending] = useState<SubscriptionTier | null>(null);

  const currentTier = subscription?.tier ?? "pearl";

  const handleConfirm = async () => {
    if (!pending) return;
    try {
      await upgrade.mutateAsync(pending);
      const name = pending.charAt(0).toUpperCase() + pending.slice(1);
      toast({ title: c.updated, description: c.nowOn(name) });
      setPending(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setPending(null);
    }
  };

  const handleSelect = (tier: SubscriptionTier) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (currentTier === tier) return;
    setPending(tier);
  };

  const pendingMeta = pending ? tiers.find((x) => x.id === pending)! : null;
  const isUpgrade = pending ? rank[pending] > rank[currentTier] : false;

  return (
    <div className="px-5 pt-6 pb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
          {c.title}
        </h1>
        <p className="text-muted-foreground font-body mt-2">{c.subtitle}</p>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, i) => {
          const isCurrent = currentTier === tier.id;
          const isDowngrade = rank[tier.id] < rank[currentTier];
          return (
            <motion.div
              key={tier.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border-2 ${
                isCurrent ? "border-primary" : tier.popular ? tier.borderColor : "border-border"
              } bg-card shadow-card overflow-hidden`}
            >
              {tier.popular && !isCurrent && (
                <div className="gradient-femme text-primary-foreground text-xs font-body font-bold text-center py-1">
                  MOST POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="bg-primary text-primary-foreground text-xs font-body font-bold text-center py-1">
                  {c.current.toUpperCase()}
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.color}`}
                    >
                      <tier.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">
                        {tier.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-display font-bold text-foreground">
                          {tier.price}
                        </span>
                        <span className="text-sm text-muted-foreground font-body">
                          {tier.priceDetail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm font-body text-foreground">
                      <Check size={16} className="text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelect(tier.id)}
                  disabled={isCurrent || upgrade.isPending}
                  className={`w-full rounded-xl font-body font-semibold h-11 ${
                    isCurrent
                      ? "bg-muted text-muted-foreground"
                      : isDowngrade
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : tier.popular
                      ? "gradient-femme text-primary-foreground"
                      : tier.id === "ruby"
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  variant={isCurrent ? "outline" : "default"}
                >
                  {isCurrent
                    ? c.current
                    : isDowngrade
                    ? c.downgradeTo(tier.name)
                    : c.upgradeTo(tier.name)}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground font-body mt-6">{c.footer}</p>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingMeta ? c.confirmTitle(pendingMeta.name) : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingMeta && pending === "pearl"
                ? c.confirmFree
                : pendingMeta && isUpgrade
                ? c.confirmUpgrade(pendingMeta.name, pendingMeta.price)
                : pendingMeta
                ? c.confirmDowngrade(pendingMeta.name)
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={upgrade.isPending}>{c.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={upgrade.isPending}
              className="gradient-femme text-primary-foreground"
            >
              {c.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingPage;
