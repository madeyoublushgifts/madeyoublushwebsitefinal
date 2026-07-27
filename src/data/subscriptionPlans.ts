export type SubscriptionCadence = "biweekly" | "monthly" | "annual" | "per_occasion";

export type SubscriptionPlan = {
  id: SubscriptionCadence;
  label: string;
  description: string;
  badge?: string;
  priceLabel?: string;
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
    description: "A full year of recurring delivery on your schedule.",
    badge: "Best value",
    priceLabel: "$185",
  },
];

/** Special Dates & Occasions Only — annual package. */
export const specialDatesAnnualPlan: SubscriptionPlan = {
  id: "annual",
  label: "Annual",
  description:
    "One annual package for the dates that matter most—Valentine’s, Mother’s Day, birthdays, and more.",
  badge: "Special dates",
  priceLabel: "$150",
};

/** Special Dates & Occasions Only — pay / schedule per occasion. */
export const specialDatesPerOccasionPlan: SubscriptionPlan = {
  id: "per_occasion",
  label: "Per occasion",
  description:
    "Schedule and pay for each special date separately—ideal when you only need blooms for selected occasions.",
  priceLabel: "Per date",
};

export const specialDatesPlans: SubscriptionPlan[] = [
  specialDatesAnnualPlan,
  specialDatesPerOccasionPlan,
];

/** Monthly / annual commitment lengths (months). */
export const commitmentMonthOptions = [1, 3, 6, 9, 12] as const;

/**
 * Bi-weekly commitment options as delivery counts.
 * 2 ≈ 1 month, 6 ≈ 3 months, 12 ≈ 6 months, 18 ≈ 9 months, 26 ≈ 1 year.
 */
export const biweeklyDeliveryOptions = [1, 2, 6, 12, 18, 26] as const;

export type PaymentPlan = "autorenew" | "prepay";

export function formatBiweeklyDeliveryLabel(deliveries: number): string {
  if (deliveries === 1) return "1 delivery";
  if (deliveries === 2) return "2 deliveries / 1 mo";
  if (deliveries === 6) return "6 deliveries / 3 mo";
  if (deliveries === 12) return "12 deliveries / 6 mo";
  if (deliveries === 18) return "18 deliveries / 9 mo";
  if (deliveries === 26) return "26 deliveries / 1 year";
  return `${deliveries} deliveries`;
}

export function formatMonthlyCommitmentLabel(months: number): string {
  if (months === 12) return "12 / 1 year";
  if (months === 1) return "1 month";
  return `${months} mo`;
}

export function getPlan(cadence: SubscriptionCadence): SubscriptionPlan {
  if (cadence === "per_occasion") return specialDatesPerOccasionPlan;
  const plan = subscriptionPlans.find((p) => p.id === cadence);
  if (!plan) throw new Error(`Unknown cadence: ${cadence}`);
  return plan;
}
