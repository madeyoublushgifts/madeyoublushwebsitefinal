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

/** Curated palettes for shop bouquet tiers—same stem colors as Build a Bouquet. */
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
  templateId: string | null;
  customColors: BouquetStemColor[];
};

export const defaultTierPaletteSelection = (bouquetId?: number): TierPaletteSelection =>
  isSingleStemTier(bouquetId ?? -1)
    ? { mode: "custom", templateId: null, customColors: [] }
    : { mode: "template", templateId: null, customColors: [] };

export const findColorTemplate = (id: string) =>
  bouquetColorTemplates.find((t) => t.id === id);

export const isTierPaletteComplete = (
  selection: TierPaletteSelection | undefined,
  bouquetId?: number
) => {
  if (!selection) return false;
  if (bouquetId !== undefined && isSingleStemTier(bouquetId)) {
    return selection.customColors.length === 1;
  }
  if (selection.mode === "template") {
    return selection.templateId !== null && !!findColorTemplate(selection.templateId);
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
    const template = selection.templateId
      ? findColorTemplate(selection.templateId)
      : undefined;
    if (!template) return "";
    return `Template: ${template.name} (${formatStemColorSummary(template.colors)})`;
  }
  if (selection.customColors.length === 0) return "";
  return `Custom palette: ${formatStemColorSummary(selection.customColors)}`;
};

export { bouquetStemColors, type BouquetStemColor };
