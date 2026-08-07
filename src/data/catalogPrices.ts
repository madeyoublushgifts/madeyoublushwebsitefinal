/** Image-free catalog prices for client totals and server-side Stripe validation. */

export const STEM_PRICES_CAD: Record<string, number> = {
  hydrangea: 6,
  daisy: 2.5,
  alstroemeria: 3.5,
  ranunculus: 5,
  "spray-roses": 2.5,
  rose: 3,
  "calla-lily": 6,
  carnation: 2.5,
  lily: 5,
  sunflower: 3.5,
  buttons: 3,
  cremons: 3.5,
  cushions: 3.5,
  magnums: 4,
  limonium: 3.5,
  "babys-breath": 2.5,
  "lavender-stock": 4,
  solidago: 2.5,
  statice: 3,
  pittosporum: 2,
  ruscus: 1.5,
  "eucalyptus": 1.5,
};

export const MATERIAL_PRICES_CAD: Record<string, number> = {
  "wrap-kraft": 1,
  "wrap-tissue": 2,
  "wrap-cellophane": 2,
  "wrap-cotton": 2,
  "wrap-silk": 5,
  "ribbon-cellophane": 2,
  "ribbon-cotton": 2,
  "ribbon-lace": 3,
  "ribbon-satin": 3,
  "ribbon-grosgrain": 2,
  "ribbon-silk": 4,
  "addon-basket": 8,
  "addon-vase": 15,
  "addon-card": 2,
  "addon-teddy": 5,
  "addon-ferrero": 8,
  "addon-lindor": 10,
};

export type BuildPricingInput = {
  stems: Record<string, number>;
  materialIds: string[];
};

/** Returns cents, or null if any catalog id is unknown / quantities invalid. */
export function priceBuildBouquetCents(input: BuildPricingInput): number | null {
  let totalCad = 0;

  for (const [stemId, quantity] of Object.entries(input.stems)) {
    const unit = STEM_PRICES_CAD[stemId];
    if (unit == null || !Number.isFinite(quantity) || quantity < 1) return null;
    totalCad += unit * Math.floor(quantity);
  }

  if (Object.keys(input.stems).length === 0) return null;

  for (const materialId of input.materialIds) {
    const unit = MATERIAL_PRICES_CAD[materialId];
    if (unit == null) return null;
    totalCad += unit;
  }

  return Math.round(totalCad * 100);
}
