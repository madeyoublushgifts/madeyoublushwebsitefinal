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

/** Single-stem uses one colour per template; larger tiers use curated multi-colour looks. */
export const getTemplatesForTier = (bouquetId: number): BouquetColorTemplate[] => {
  if (bouquetId !== SINGLE_STEM_TIER_ID) return bouquetColorTemplates;
  return bouquetStemColors.map((c) => ({
    id: `solid-${c.id}`,
    name: c.name,
    description: "One stem in this colour",
    colors: [c.id],
  }));
};

export type TierPaletteSelection = {
  mode: BouquetTierColorMode;
  templateId: string | null;
  customColors: BouquetStemColor[];
};

export const defaultTierPaletteSelection = (): TierPaletteSelection => ({
  mode: "template",
  templateId: null,
  customColors: [],
});

export const findColorTemplate = (id: string) => {
  const curated = bouquetColorTemplates.find((t) => t.id === id);
  if (curated) return curated;
  if (!id.startsWith("solid-")) return undefined;
  const colorId = id.slice("solid-".length) as BouquetStemColor;
  const color = bouquetStemColors.find((c) => c.id === colorId);
  if (!color) return undefined;
  return {
    id,
    name: color.name,
    description: "One stem in this colour",
    colors: [colorId],
  };
};

export const isTierPaletteComplete = (
  selection: TierPaletteSelection | undefined,
  bouquetId?: number
) => {
  if (!selection) return false;
  if (selection.mode === "template") {
    return selection.templateId !== null && !!findColorTemplate(selection.templateId);
  }
  const count = selection.customColors.length;
  if (bouquetId === SINGLE_STEM_TIER_ID) return count === 1;
  return count > 0;
};

export const formatTierPaletteChoice = (selection: TierPaletteSelection) => {
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
