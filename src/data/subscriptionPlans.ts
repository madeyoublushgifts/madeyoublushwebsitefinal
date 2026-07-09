export type SubscriptionCadence = "biweekly" | "monthly" | "annual";

export type SubscriptionPlan = {
  id: SubscriptionCadence;
  label: string;
  priceLabel: string;
  amountCents: number;
  description: string;
  badge?: string;
};

const biweeklyCents = Number(import.meta.env.VITE_STRIPE_BIWEEKLY_AMOUNT_CENTS ?? 3499);
const monthlyCents = Number(import.meta.env.VITE_STRIPE_MONTHLY_AMOUNT_CENTS ?? 3499);

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "biweekly",
    label: "Bi-weekly",
    priceLabel: `$${(biweeklyCents / 100).toFixed(2)} / delivery`,
    amountCents: biweeklyCents,
    description: "Fresh stems every two weeks — great for always having blooms at home.",
  },
  {
    id: "monthly",
    label: "Monthly",
    priceLabel: `$${(monthlyCents / 100).toFixed(2)} / month`,
    amountCents: monthlyCents,
    description: "A thoughtful bouquet once a month on your schedule.",
  },
  {
    id: "annual",
    label: "Annual",
    priceLabel: "$185.00 / year",
    amountCents: 18500,
    description: "Best value — a full year of blooms for $185 (about $15.42/month).",
    badge: "Best value",
  },
];

export function getPlan(cadence: SubscriptionCadence): SubscriptionPlan {
  const plan = subscriptionPlans.find((p) => p.id === cadence);
  if (!plan) throw new Error(`Unknown cadence: ${cadence}`);
  return plan;
}
