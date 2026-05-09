import { useSubscription, SubscriptionTier } from "@/hooks/useSubscription";

/**
 * Single source of truth for tier-based feature gating.
 * Ruby implicitly grants Swan.
 */
export const useTierAccess = () => {
  const { data, isLoading } = useSubscription();
  const tier: SubscriptionTier = (data?.tier as SubscriptionTier) ?? "pearl";

  // Treat past_due as still-active (dunning); treat anything else non-active as no access.
  const status = data?.status ?? "active";
  const isPaying =
    tier !== "pearl" &&
    ["active", "trialing", "past_due", "canceled"].includes(status);

  // Canceled keeps access until period end, but for simplicity we trust
  // the `tier` column unless explicitly set to pearl.
  return {
    tier,
    hasSwan: isPaying && (tier === "swan" || tier === "ruby"),
    hasRuby: isPaying && tier === "ruby",
    isLoading,
  };
};
