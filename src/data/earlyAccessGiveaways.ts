/** Early-access giveaway campaign configs (invite-only, unlisted). */

export type EarlyAccessGiveawayId = "monthly-mini" | "three-month-mini";

export type EarlyAccessBouquetStyle = "tier" | "signature" | "custom";

/** Stock-locked builder vs full CreateBouquet catalog. */
export type EarlyAccessBuilderVariant = "stock" | "full";

/** Tier colour picker: early-access stock pink/white/yellow vs normal mini templates. */
export type EarlyAccessTierPalette = "early-access" | "normal";

export type EarlyAccessMonthConfig = {
  month: number;
  label: string;
  styles: EarlyAccessBouquetStyle[];
  builderVariant: EarlyAccessBuilderVariant;
  tierPalette: EarlyAccessTierPalette;
};

export type EarlyAccessGiveawayConfig = {
  id: EarlyAccessGiveawayId;
  /** Route segment under /early-access/ */
  slug: string;
  claimPath: string;
  buildPath: string;
  monthsCount: number;
  months: EarlyAccessMonthConfig[];
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroBody: string;
  formBadge: string;
  deliveryDateOptions: readonly string[];
  defaultDeliveryDate: string;
  deliveryHint: string;
  /** Formbricks `bouquetSource` value */
  bouquetSourceLabel: string;
  successTitle: string;
  successBody: string;
  claimCta: string;
  seo: {
    claimTitle: string;
    claimDescription: string;
    buildTitle: string;
    buildDescription: string;
  };
};

const AUG_DELIVERY_DATES = ["2026-08-14", "2026-08-15", "2026-08-16"] as const;

const monthlyMini: EarlyAccessGiveawayConfig = {
  id: "monthly-mini",
  slug: "monthly-mini",
  claimPath: "/early-access/monthly-mini",
  buildPath: "/early-access/monthly-mini/build",
  monthsCount: 1,
  months: [
    {
      month: 1,
      label: "Your bouquet",
      styles: ["tier", "custom"],
      builderVariant: "stock",
      tierPalette: "early-access",
    },
  ],
  heroEyebrow: "Early access · invite only",
  heroTitle: "Free Mini Bouquet",
  heroAccent: "~ 1 month subscription!",
  heroBody:
    "Thanks for filling out our interest form. Claim one complimentary mini bouquet — pick a colour tier or custom build, then share your delivery details! No payment needed!",
  formBadge: "Early access giveaway",
  deliveryDateOptions: AUG_DELIVERY_DATES,
  defaultDeliveryDate: AUG_DELIVERY_DATES[0],
  deliveryHint: "Choose August 14, 15, or 16 for your complimentary delivery.",
  bouquetSourceLabel: "", // filled per selection (tier vs custom) for 1-month
  successTitle: "Order confirmed!",
  successBody: "We'll be in touch soon with your free mini bouquet details.",
  claimCta: "Claim free bouquet",
  seo: {
    claimTitle: "Early Access Free Mini Bouquet",
    claimDescription:
      "Invite-only early access: claim one complimentary mini bouquet month from Made You Blush. No payment required.",
    buildTitle: "Build Your Free Mini Bouquet",
    buildDescription:
      "Design a custom mini bouquet for your Made You Blush early-access giveaway claim.",
  },
};

const threeMonthMini: EarlyAccessGiveawayConfig = {
  id: "three-month-mini",
  slug: "three-month-mini",
  claimPath: "/early-access/three-month-mini",
  buildPath: "/early-access/three-month-mini/build",
  monthsCount: 3,
  months: [
    {
      month: 1,
      label: "Month 1",
      styles: ["tier", "custom"],
      builderVariant: "stock",
      tierPalette: "early-access",
    },
    {
      month: 2,
      label: "Month 2",
      styles: ["tier", "signature", "custom"],
      builderVariant: "full",
      tierPalette: "normal",
    },
    {
      month: 3,
      label: "Month 3",
      styles: ["tier", "signature", "custom"],
      builderVariant: "full",
      tierPalette: "normal",
    },
  ],
  heroEyebrow: "Early access · invite only",
  heroTitle: "Free Mini Bouquet Subscription",
  heroAccent: "~ 3 months!",
  heroBody:
    "Thanks for being part of Made You Blush early access. Claim three complimentary mini bouquets — configure each month, pick your first delivery date, and we'll schedule the rest. No payment needed!",
  formBadge: "3-month mini giveaway",
  deliveryDateOptions: AUG_DELIVERY_DATES,
  defaultDeliveryDate: AUG_DELIVERY_DATES[0],
  deliveryHint:
    "Choose August 14, 15, or 16 for Month 1. Months 2 and 3 are scheduled one and two months later.",
  bouquetSourceLabel: "3-month mini giveaway",
  successTitle: "You're all set!",
  successBody: "We'll be in touch soon with your free 3-month mini bouquet plan.",
  claimCta: "Claim 3-month mini subscription",
  seo: {
    claimTitle: "Early Access 3-Month Mini Subscription",
    claimDescription:
      "Invite-only early access: claim a complimentary 3-month mini bouquet subscription from Made You Blush. No payment required.",
    buildTitle: "Build Your Free Mini Bouquet",
    buildDescription:
      "Design a custom mini bouquet for your Made You Blush 3-month early-access giveaway claim.",
  },
};

export const earlyAccessGiveaways: Record<
  EarlyAccessGiveawayId,
  EarlyAccessGiveawayConfig
> = {
  "monthly-mini": monthlyMini,
  "three-month-mini": threeMonthMini,
};

export function getEarlyAccessGiveaway(
  id: EarlyAccessGiveawayId
): EarlyAccessGiveawayConfig {
  return earlyAccessGiveaways[id];
}

export function getEarlyAccessMonthConfig(
  giveaway: EarlyAccessGiveawayConfig,
  month: number
): EarlyAccessMonthConfig {
  return (
    giveaway.months.find((m) => m.month === month) ?? giveaway.months[0]
  );
}

export function earlyAccessBuildHref(
  giveaway: EarlyAccessGiveawayConfig,
  month: number
): string {
  if (giveaway.monthsCount === 1) return giveaway.buildPath;
  return `${giveaway.buildPath}?month=${month}`;
}
