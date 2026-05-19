import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSubscription,
  useOpenCustomerPortal,
  SubscriptionTier,
  TIER_TO_PRICE_ID,
  BillingPeriod,
} from "@/hooks/useSubscription";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Shell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import Seo from "@/components/Seo";

type PaidTier = Exclude<SubscriptionTier, "pearl">;

// Per-period pricing (must match the Paddle prices for swan_*/ruby_* IDs).
const PRICING: Record<PaidTier, Record<BillingPeriod, { price: string; detail: { en: string; es: string } }>> = {
  swan: {
    monthly: { price: "$8", detail: { en: "/month", es: "/mes" } },
    quarterly: { price: "$20.40", detail: { en: "/3 months", es: "/3 meses" } },
    yearly: { price: "$80", detail: { en: "/year", es: "/año" } },
  },
  ruby: {
    monthly: { price: "$12", detail: { en: "/month", es: "/mes" } },
    quarterly: { price: "$30.60", detail: { en: "/3 months", es: "/3 meses" } },
    yearly: { price: "$120", detail: { en: "/year", es: "/año" } },
  },
};

const tiers = [
  {
    id: "pearl" as SubscriptionTier,
    name: "Pearl",
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
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
    save15: "Save 15%",
    bestValue: "Best value",
    freeForever: "Free",
    forever: "forever",
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
    monthly: "Mensual",
    quarterly: "Trimestral",
    yearly: "Anual",
    save15: "Ahorra 15%",
    bestValue: "Mejor valor",
    freeForever: "Gratis",
    forever: "para siempre",
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
  const [billing, setBilling] = useState<BillingPeriod>("quarterly");

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
      await openCheckout(TIER_TO_PRICE_ID[tier as PaidTier][billing]);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const periods: { id: BillingPeriod; label: string; badge?: string }[] = [
    { id: "monthly", label: c.monthly },
    { id: "quarterly", label: c.quarterly, badge: c.save15 },
    { id: "yearly", label: c.yearly, badge: c.bestValue },
  ];


  return (
    <>
      <Seo
        title="Pricing — Pearl, Swan & Ruby Plans | Pearl Femme"
        description="Choose the Pearl Femme plan that fits you: free Pearl, Swan for advanced cycle insights, or Ruby for AI meal plans, grocery lists, and daily insight."
        path="/pricing"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Pearl Femme Subscription",
          description: "Women's wellness subscription with cycle tracking, hormone education, and AI-powered phase guidance.",
          brand: { "@type": "Brand", name: "Pearl Femme" },
          offers: [
            { "@type": "Offer", name: "Pearl", price: "0", priceCurrency: "USD" },
            { "@type": "Offer", name: "Swan", priceCurrency: "USD", category: "subscription" },
            { "@type": "Offer", name: "Ruby", priceCurrency: "USD", category: "subscription" },
          ],
        }}
      />
      <PaymentTestModeBanner />
      <div className="px-5 pt-6 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {c.title}
          </h1>
          <p className="text-muted-foreground font-body mt-2">{c.subtitle}</p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex rounded-full bg-muted p-1 gap-1">
            {periods.map((p) => {
              const active = billing === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setBilling(p.id)}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-body font-semibold transition-colors ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                  {p.badge && (
                    <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      {p.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {tiers.map((tier, i) => {
            const isCurrent = currentTier === tier.id;
            const pricing =
              tier.id === "pearl"
                ? { price: c.freeForever, detail: c.forever }
                : {
                    price: PRICING[tier.id as PaidTier][billing].price,
                    detail: PRICING[tier.id as PaidTier][billing].detail[lang],
                  };
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
                            {pricing.price}
                          </span>
                          <span className="text-sm text-muted-foreground font-body">
                            {pricing.detail}
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
