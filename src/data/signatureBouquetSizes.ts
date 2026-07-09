import { bouquetTiers, getBouquetTier, type BouquetTier } from "@/data/bouquetTiers";

/** Size options for signature / preset lookbook bouquets (excludes single stem). */
export const signatureSizeTierIds = ["mini", "standard", "deluxe", "luxury"] as const;

export type SignatureSizeTierId = (typeof signatureSizeTierIds)[number];

export const signatureSizeTiers: BouquetTier[] = bouquetTiers.filter((tier) =>
  signatureSizeTierIds.includes(tier.id as SignatureSizeTierId)
);

export const defaultSignatureSizeId: SignatureSizeTierId = "standard";

export function getSignatureSizeTier(id: string): BouquetTier | undefined {
  if (!signatureSizeTierIds.includes(id as SignatureSizeTierId)) return undefined;
  return getBouquetTier(id);
}

export function formatSignatureSizeLabel(tierId: string): string {
  const tier = getSignatureSizeTier(tierId);
  if (!tier) return "";
  return `${tier.name} (${tier.priceLabel})`;
}
