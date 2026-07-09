import type { SubscriptionCadence } from "@/data/subscriptionPlans";
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";

export type CheckoutPayload = {
  cadence: SubscriptionCadence;
  name: string;
  email: string;
  phone?: string;
  address: string;
  deliveryDate: string;
  occasions: SubscriptionOccasion[];
  notes?: string;
};

export async function redirectToStripeCheckout(payload: CheckoutPayload): Promise<void> {
  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Could not start checkout. Please try again.");
  }

  if (!data.url) {
    throw new Error("Checkout URL missing. Please try again.");
  }

  window.location.href = data.url;
}
