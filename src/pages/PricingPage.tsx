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

const PricingPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: subscription } = useSubscription();
  const upgrade = useUpgradeSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelect = async (tier: SubscriptionTier) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (tier === "pearl") return;
    if (subscription?.tier === tier) return;

    try {
      await upgrade.mutateAsync(tier);
      toast({
        title: "Subscription updated!",
        description: `You're now on the ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-5 pt-6 pb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground font-body mt-2">
          Unlock your full wellness journey
        </p>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, i) => {
          const isCurrent = subscription?.tier === tier.id;
          return (
            <motion.div
              key={tier.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border-2 ${
                tier.popular ? tier.borderColor : "border-border"
              } bg-card shadow-card overflow-hidden`}
            >
              {tier.popular && (
                <div className="gradient-femme text-primary-foreground text-xs font-body font-bold text-center py-1">
                  MOST POPULAR
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
                    tier.popular
                      ? "gradient-femme text-primary-foreground"
                      : tier.id === "ruby"
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  variant={tier.id === "pearl" ? "outline" : "default"}
                >
                  {isCurrent
                    ? "Current Plan"
                    : tier.id === "pearl"
                    ? "Free Forever"
                    : `Upgrade to ${tier.name}`}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground font-body mt-6">
        Payments are processed securely via Stripe. Cancel anytime.
      </p>
    </div>
  );
};

export default PricingPage;
