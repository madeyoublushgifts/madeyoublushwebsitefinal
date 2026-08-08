import type { BouquetColorTemplate, TierPaletteSelection } from "@/data/bouquetTierColors";
import {
  bouquetStemColors,
  formatStemColorSummary,
  type BouquetStemColor,
  type StemCategory,
} from "@/data/buildBouquetStems";
import { stemCarnationRed, stemLimoniumPink } from "@/assets/images";

/** Max stem units per category for the early-access mini giveaway builder. */
export const EARLY_ACCESS_STEM_LIMITS: Record<StemCategory, number> = {
  main: 4,
  filler: 3,
  greenery: 3,
};

/** Stock locked from the Aug 14 custom order — early-access giveaway only. */
export const EARLY_ACCESS_PALETTE_COLORS: BouquetStemColor[] = ["pink", "white", "yellow"];

export const earlyAccessPaletteColors = bouquetStemColors.filter((c) =>
  EARLY_ACCESS_PALETTE_COLORS.includes(c.id)
);

/** Colour templates that only use in-stock pink / white / yellow. */
export const earlyAccessColorTemplates: BouquetColorTemplate[] = [
  {
    id: "ea-blush-romance",
    name: "Blush Romance",
    description: "Soft pinks and creamy whites",
    colors: ["pink", "white"],
  },
  {
    id: "ea-sunshine-soft",
    name: "Sunshine Soft",
    description: "Cheerful yellow with crisp white",
    colors: ["yellow", "white"],
  },
  {
    id: "ea-pink-sunshine",
    name: "Pink & Sunshine",
    description: "Pink, yellow, and white — our current stock mix",
    colors: ["pink", "yellow", "white"],
  },
];

export const EARLY_ACCESS_STEM_IDS = [
  "daisy",
  "hydrangea",
  "ranunculus",
  "rose",
  "carnation",
  "babys-breath",
  "ruscus",
  "eucalyptus",
  "limonium",
  "solidago",
] as const;

/** Allowed stem colours based on current stock. Empty = no colour picker (natural stem). */
export const EARLY_ACCESS_STEM_COLORS: Record<string, BouquetStemColor[]> = {
  daisy: ["white"],
  hydrangea: ["yellow"],
  ranunculus: ["yellow"],
  rose: ["pink", "white", "yellow"],
  carnation: ["white", "red"],
  limonium: ["pink"],
  solidago: ["yellow"],
  // babys-breath, ruscus & eucalyptus: natural — no colour options
};

/** Preview images for early-access stock (recolored to match inventory). */
export const EARLY_ACCESS_STEM_IMAGES: Partial<Record<string, string>> = {
  carnation: stemCarnationRed,
  limonium: stemLimoniumPink,
};

export const EARLY_ACCESS_WRAPPING_ID = "wrap-cotton";
export const EARLY_ACCESS_WRAPPING_COLOR: BouquetStemColor = "pink";

export function earlyAccessColorsForStem(stemId: string) {
  const allowed = EARLY_ACCESS_STEM_COLORS[stemId];
  if (!allowed || allowed.length === 0) return [];
  return bouquetStemColors.filter((c) => allowed.includes(c.id));
}

export function earlyAccessStemSupportsColor(stemId: string) {
  return (EARLY_ACCESS_STEM_COLORS[stemId]?.length ?? 0) > 0;
}

export function findEarlyAccessColorTemplate(id: string) {
  return earlyAccessColorTemplates.find((t) => t.id === id);
}

export function isEarlyAccessPaletteComplete(selection: TierPaletteSelection) {
  if (selection.mode === "template") {
    return selection.templateIds.some((id) => !!findEarlyAccessColorTemplate(id));
  }
  return (
    selection.customColors.length > 0 &&
    selection.customColors.every((c) => EARLY_ACCESS_PALETTE_COLORS.includes(c))
  );
}

export function formatEarlyAccessPaletteChoice(selection: TierPaletteSelection) {
  if (selection.mode === "template") {
    const templates = selection.templateIds
      .map((id) => findEarlyAccessColorTemplate(id))
      .filter((t): t is BouquetColorTemplate => !!t);
    if (templates.length === 0) return "";
    return `Templates: ${templates
      .map((t) => `${t.name} (${formatStemColorSummary(t.colors)})`)
      .join("; ")}`;
  }
  if (selection.customColors.length === 0) return "";
  return `Custom palette: ${formatStemColorSummary(selection.customColors)}`;
}
