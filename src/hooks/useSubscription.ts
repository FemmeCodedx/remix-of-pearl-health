import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getPaddleEnvironment } from "@/lib/paddle";

export type SubscriptionTier = "pearl" | "swan" | "ruby";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: string;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  product_id: string | null;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  environment: string;
}

// Map our app tier -> Paddle price_id (human-readable, set via create_product)
export const TIER_TO_PRICE_ID: Record<Exclude<SubscriptionTier, "pearl">, string> = {
  swan: "swan_monthly",
  ruby: "ruby_monthly",
};

export const useSubscription = () => {
  const { user } = useAuth();
  const env = getPaddleEnvironment();

  return useQuery({
    queryKey: ["subscription", user?.id, env],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      // Most recent paid subscription in this env
      const { data: paid } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("environment", env)
        .not("paddle_subscription_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (paid) return paid as Subscription;

      // Fallback to default Pearl row created by handle_new_user
      const { data: pearl } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .is("paddle_subscription_id", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (pearl as Subscription) ?? null;
    },
    enabled: !!user,
  });
};

export const useOpenCustomerPortal = () => {
  return useMutation({
    mutationFn: async () => {
      const env = getPaddleEnvironment();
      const { data, error } = await supabase.functions.invoke("paddle-customer-portal", {
        body: { environment: env },
      });
      if (error || !data?.url) throw new Error(error?.message || "Failed to open portal");
      window.open(data.url, "_blank", "noopener,noreferrer");
    },
  });
};

// Kept for compatibility — Paddle handles cancellation via the customer portal.
export const useCancelSubscription = () => useOpenCustomerPortal();
export const useResumeSubscription = () => useOpenCustomerPortal();

// Refresh helper after returning from Paddle checkout.
export const useRefreshSubscription = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["subscription"] });
};
