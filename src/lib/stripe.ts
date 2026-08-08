import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import type { BuildPricingPayload, CheckoutSource } from "@/lib/checkoutCart";

export type OrderCheckoutLineItem = {
  itemName: string;
  itemSummary: string;
  amountCents: number;
  source: CheckoutSource;
  tierId?: string;
  buildPricing?: BuildPricingPayload;
};

export type OrderCheckoutPayload = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  deliveryDate: string;
  items: OrderCheckoutLineItem[];
  notes?: string;
};

export async function redirectToOrderCheckout(payload: OrderCheckoutPayload): Promise<void> {
  const response = await fetch("/api/create-order-checkout", {
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

/** Serialized for subscription waitlist */
export type SubscriptionWaitlistPayload = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  cadence: string;
  deliveryDate: string;
  bouquetTier: string;
  bouquetSource: "preset" | "custom";
  presetTierName?: string;
  occasions: SubscriptionOccasion[];
  notes?: string;
};
