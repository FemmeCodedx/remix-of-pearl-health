import { motion } from "framer-motion";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSubscription,
  useOpenCustomerPortal,
  SubscriptionTier,
  TIER_TO_PRICE_ID,
} from "@/hooks/useSubscription";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Shell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

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
      "Save monthly phase plans",
      "Personal recipe lists by phase",
      "Research-backed food swap library",
      "Full symptom & cycle history",
      "PDF cycle report exports",
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
      "AI features (coming soon)",
      "Priority support",
    ],
  },
];

const copy = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Switch plans anytime — secure checkout powered by Paddle.",
    current: "Current Plan",
    upgradeTo: (n: string) => `Subscribe to ${n}`,
    manage: "Manage subscription",
    free: "Free Forever",
    footer: "Payments are processed securely. Cancel anytime from Manage subscription.",
    success: "Welcome aboard!",
    successDesc: "Your subscription is being activated.",
  },
  es: {
    title: "Elige tu Plan",
    subtitle: "Cambia de plan en cualquier momento — pagos seguros con Paddle.",
    current: "Plan Actual",
    upgradeTo: (n: string) => `Suscribirse a ${n}`,
    manage: "Gestionar suscripción",
    free: "Gratis para siempre",
    footer: "Los pagos se procesan de forma segura. Cancela cuando quieras desde Gestionar suscripción.",
    success: "¡Bienvenida!",
    successDesc: "Tu suscripción se está activando.",
  },
};

const PricingPage = () => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { data: subscription } = useSubscription();
  const { openCheckout, loading } = usePaddleCheckout();
  const portal = useOpenCustomerPortal();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const c = copy[lang];

  const currentTier = subscription?.tier ?? "pearl";

  useEffect(() => {
    if (params.get("checkout") === "success") {
      toast({ title: c.success, description: c.successDesc });
      // Webhook may take a moment; refetch after a short delay.
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["subscription"] }), 1500);
      params.delete("checkout");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (tier: SubscriptionTier) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (currentTier === tier) return;

    if (tier === "pearl") {
      // Cancellation handled in Paddle customer portal.
      try {
        await portal.mutateAsync();
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
      return;
    }

    try {
      await openCheckout(TIER_TO_PRICE_ID[tier]);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <>
      <PaymentTestModeBanner />
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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.color}`}>
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
                    disabled={isCurrent || loading || portal.isPending}
                    className={`w-full rounded-xl font-body font-semibold h-11 ${
                      isCurrent
                        ? "bg-muted text-muted-foreground"
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
                      : tier.id === "pearl"
                      ? c.manage
                      : c.upgradeTo(tier.name)}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <MedicalDisclaimer variant="banner" className="mt-6" />
        <p className="text-center text-xs text-muted-foreground font-body mt-4">{c.footer}</p>
      </div>
    </>
  );
};

export default PricingPage;
