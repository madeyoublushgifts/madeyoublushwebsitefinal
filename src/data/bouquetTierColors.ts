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

export const findColorTemplate = (id: string) =>
  bouquetColorTemplates.find((t) => t.id === id);

export const isTierPaletteComplete = (selection: TierPaletteSelection | undefined) => {
  if (!selection) return false;
  if (selection.mode === "template") {
    return selection.templateId !== null && !!findColorTemplate(selection.templateId);
  }
  return selection.customColors.length > 0;
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
