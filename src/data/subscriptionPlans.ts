export type SubscriptionCadence = "biweekly" | "monthly" | "annual";

export type SubscriptionPlan = {
  id: SubscriptionCadence;
  label: string;
  description: string;
  badge?: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "biweekly",
    label: "Bi-weekly",
    description: "Fresh stems every two weeks — great for always having blooms at home.",
  },
  {
    id: "monthly",
    label: "Monthly",
    description: "A thoughtful bouquet once a month on your schedule.",
  },
  {
    id: "annual",
    label: "Annual",
    description: "Best value — a full year of blooms on your schedule.",
    badge: "Best value",
  },
];

export function getPlan(cadence: SubscriptionCadence): SubscriptionPlan {
  const plan = subscriptionPlans.find((p) => p.id === cadence);
  if (!plan) throw new Error(`Unknown cadence: ${cadence}`);
  return plan;
}
