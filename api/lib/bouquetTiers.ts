/** Bouquet tiers for server-side Stripe checkout validation. Keep in sync with src/data/bouquetTiers.ts */
export type BouquetTier = {
  id: string;
  shopBouquetId: number;
  name: string;
  description: string;
  priceLabel: string;
  priceCents: number;
};

export const bouquetTiers: BouquetTier[] = [
  {
    id: "single-stem",
    shopBouquetId: 1,
    name: "Single Stem",
    description: "One standout stem—perfect for desks, apologies, or tiny celebrations",
    priceLabel: "$4.99",
    priceCents: 499,
  },
  {
    id: "mini",
    shopBouquetId: 2,
    name: "Mini Bouquet",
    description: "Petite bundle with big personality",
    priceLabel: "$16.99",
    priceCents: 1699,
  },
  {
    id: "standard",
    shopBouquetId: 3,
    name: "Standard Bouquet",
    description: "Our most-loved size for doorsteps and thank-yous",
    priceLabel: "$34.99",
    priceCents: 3499,
  },
  {
    id: "deluxe",
    shopBouquetId: 4,
    name: "Deluxe Bouquet",
    description: "Fuller stems with layered blooms and richer volume",
    priceLabel: "$56.99",
    priceCents: 5699,
  },
  {
    id: "luxury",
    shopBouquetId: 5,
    name: "Luxury Bouquet",
    description: "Extra stems and drama for milestones",
    priceLabel: "$75.00",
    priceCents: 7500,
  },
];

export function getBouquetTier(id: string): BouquetTier | undefined {
  return bouquetTiers.find((t) => t.id === id);
}
