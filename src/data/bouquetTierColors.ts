import {
  bouquetStemColors,
  formatStemColorSummary,
  type BouquetStemColor,
} from "@/data/buildBouquetStems";

export type BouquetTierColorMode = "template" | "custom";

export type BouquetColorTemplate = {
  id: string;
  name: string;
  description: string;
  colors: BouquetStemColor[];
};

/** Curated palettes for shop bouquet tiers and subscription waitlist. */
export const bouquetColorTemplates: BouquetColorTemplate[] = [
  {
    id: "blush-romance",
    name: "Blush Romance",
    description: "Soft pinks and creamy whites",
    colors: ["pink", "white"],
  },
  {
    id: "sunshine-joy",
    name: "Sunshine Joy",
    description: "Cheerful yellows and warm orange",
    colors: ["yellow", "orange"],
  },
  {
    id: "garden-fresh",
    name: "Garden Fresh",
    description: "Pink blooms with purple and white accents",
    colors: ["pink", "purple", "white"],
  },
  {
    id: "velvet-evening",
    name: "Velvet Evening",
    description: "Deep reds with wine-toned purple",
    colors: ["red", "purple"],
  },
  {
    id: "ocean-calm",
    name: "Ocean Calm",
    description: "Cool blues with crisp white",
    colors: ["blue", "white"],
  },
  {
    id: "bold-celebration",
    name: "Bold Celebration",
    description: "High-contrast red, yellow, and orange",
    colors: ["red", "yellow", "orange"],
  },
  {
    id: "meadow-green",
    name: "Meadow Green",
    description: "Fresh greens with soft white",
    colors: ["green", "white"],
  },
  {
    id: "peach-garden",
    name: "Peach Garden",
    description: "Peachy orange, pink, and cream",
    colors: ["orange", "pink", "white"],
  },
  {
    id: "lilac-dream",
    name: "Lilac Dream",
    description: "Lavender purple with blush pink",
    colors: ["purple", "pink"],
  },
  {
    id: "citrus-crush",
    name: "Citrus Crush",
    description: "Zesty yellow, orange, and green",
    colors: ["yellow", "orange", "green"],
  },
  {
    id: "midnight-rose",
    name: "Midnight Rose",
    description: "Romantic red with soft pink",
    colors: ["red", "pink"],
  },
  {
    id: "skyline-blue",
    name: "Skyline Blue",
    description: "Blue skies with purple dusk",
    colors: ["blue", "purple", "white"],
  },
  {
    id: "forest-blush",
    name: "Forest Blush",
    description: "Leafy green with pink blooms",
    colors: ["green", "pink", "white"],
  },
  {
    id: "candy-stripe",
    name: "Candy Stripe",
    description: "Playful pink, red, and white",
    colors: ["pink", "red", "white"],
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm yellow, orange, and soft pink",
    colors: ["yellow", "orange", "pink"],
  },
];

export const MAX_TIER_CUSTOM_COLORS = 3;
export const SINGLE_STEM_TIER_ID = 1;
export const MAX_TIER_CUSTOM_COLORS_SINGLE_STEM = 1;

export const getMaxCustomColorsForTier = (bouquetId: number) =>
  bouquetId === SINGLE_STEM_TIER_ID
    ? MAX_TIER_CUSTOM_COLORS_SINGLE_STEM
    : MAX_TIER_CUSTOM_COLORS;

export const isSingleStemTier = (bouquetId: number) => bouquetId === SINGLE_STEM_TIER_ID;

export type TierPaletteSelection = {
  mode: BouquetTierColorMode;
  /** One or more colour templates (shop uses a single selection). */
  templateIds: string[];
  customColors: BouquetStemColor[];
};

export const defaultTierPaletteSelection = (bouquetId?: number): TierPaletteSelection =>
  isSingleStemTier(bouquetId ?? -1)
    ? { mode: "custom", templateIds: [], customColors: [] }
    : { mode: "template", templateIds: [], customColors: [] };

export const findColorTemplate = (id: string) =>
  bouquetColorTemplates.find((t) => t.id === id);

export type TierPaletteCompleteOptions = {
  /** Minimum templates required in template mode (subscription commitment). */
  minTemplates?: number;
};

export const isTierPaletteComplete = (
  selection: TierPaletteSelection | undefined,
  bouquetId?: number,
  options?: TierPaletteCompleteOptions
) => {
  if (!selection) return false;
  if (bouquetId !== undefined && isSingleStemTier(bouquetId)) {
    return selection.customColors.length === 1;
  }
  if (selection.mode === "template") {
    const valid = selection.templateIds.filter((id) => !!findColorTemplate(id));
    const min = Math.max(1, options?.minTemplates ?? 1);
    return valid.length >= min;
  }
  return selection.customColors.length > 0;
};

export const formatTierPaletteChoice = (
  selection: TierPaletteSelection,
  bouquetId?: number
) => {
  if (bouquetId !== undefined && isSingleStemTier(bouquetId)) {
    if (selection.customColors.length === 0) return "";
    return `Colour: ${formatStemColorSummary(selection.customColors)}`;
  }
  if (selection.mode === "template") {
    const templates = selection.templateIds
      .map((id) => findColorTemplate(id))
      .filter((t): t is BouquetColorTemplate => !!t);
    if (templates.length === 0) return "";
    return `Templates: ${templates
      .map((t) => `${t.name} (${formatStemColorSummary(t.colors)})`)
      .join("; ")}`;
  }
  if (selection.customColors.length === 0) return "";
  return `Custom palette: ${formatStemColorSummary(selection.customColors)}`;
};

export { bouquetStemColors, type BouquetStemColor };
