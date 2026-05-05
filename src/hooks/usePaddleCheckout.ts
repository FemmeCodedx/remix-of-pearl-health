import { useState } from "react";
import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";
import { useAuth } from "@/contexts/AuthContext";

export function usePaddleCheckout() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const openCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      await initializePaddle();
      const paddlePriceId = await getPaddlePriceId(priceId);
      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId, quantity: 1 }],
        customer: user?.email ? { email: user.email } : undefined,
        customData: { userId: user?.id || "" },
        settings: {
          displayMode: "overlay",
          successUrl: `${window.location.origin}/profile/subscription?checkout=success`,
          allowLogout: false,
          variant: "one-page",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
