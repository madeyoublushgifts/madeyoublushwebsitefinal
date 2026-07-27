import {
  stemHydrangea,
  stemDaisy,
  stemAlstroemeria,
  stemRanunculus,
  stemSprayRoses,
  stemRose,
  stemCallaLily,
  stemCarnation,
  stemLily,
  stemSunflower,
  stemButtons,
  stemCremons,
  stemCushions,
  stemMagnums,
  stemLimonium,
  stemBabysBreath,
  stemLavenderStock,
  stemSolidago,
  stemStatice,
  stemPittosporum,
  stemRuscus,
  stemBabyEucalyptus,
  stemSilverDollarEucalyptus,
} from "@/assets/images";

export type StemCategory = "main" | "filler" | "greenery";

export const bouquetStemColors = [
  { id: "red", name: "Red", hex: "#DC2626" },
  { id: "blue", name: "Blue", hex: "#2563EB" },
  { id: "yellow", name: "Yellow", hex: "#EAB308" },
  { id: "orange", name: "Orange", hex: "#EA580C" },
  { id: "purple", name: "Purple", hex: "#9333EA" },
  { id: "green", name: "Green", hex: "#16A34A" },
  { id: "white", name: "White", hex: "#F5F5F4" },
  { id: "pink", name: "Pink", hex: "#EC4899" },
] as const;

export type BouquetStemColor = (typeof bouquetStemColors)[number]["id"];

/** Greenery and stems with a fixed/natural palette—no per-stem color picker. */
const stemsWithoutColorPicker = new Set([
  "sunflower",
  "babys-breath",
  "lavender-stock",
]);

export const stemSupportsColor = (stemId: string, category: StemCategory) =>
  category !== "greenery" && !stemsWithoutColorPicker.has(stemId);

export type StemOption = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: StemCategory;
};

/** Per-stem estimates aligned with Toronto wholesale + boutique markup (2025–26). */
export const buildBouquetStems: StemOption[] = [
  // Main flowers ($2–$6)
  {
    id: "hydrangea",
    name: "Hydrangea",
    price: 6,
    image: stemHydrangea,
    description: "Full mop-head bloom—statement volume",
    category: "main",
  },
  {
    id: "daisy",
    name: "Daisy",
    price: 2.5,
    image: stemDaisy,
    description: "Bright, classic, and easy to layer",
    category: "main",
  },
  {
    id: "alstroemeria",
    name: "Alstroemeria",
    price: 3.5,
    image: stemAlstroemeria,
    description: "Multi-bloom stem with great vase life",
    category: "main",
  },
  {
    id: "ranunculus",
    name: "Ranunculus",
    price: 5,
    image: stemRanunculus,
    description: "Layered petals—seasonal favourite",
    category: "main",
  },
  {
    id: "spray-roses",
    name: "Spray Roses",
    price: 2.5,
    image: stemSprayRoses,
    description: "Several petite blooms on one stem",
    category: "main",
  },
  {
    id: "rose",
    name: "Rose",
    price: 3,
    image: stemRose,
    description: "Garden-rose feel for everyday romance",
    category: "main",
  },
  {
    id: "calla-lily",
    name: "Calla Lily",
    price: 6,
    image: stemCallaLily,
    description: "Sculptural trumpet bloom",
    category: "main",
  },
  {
    id: "carnation",
    name: "Carnation",
    price: 2.5,
    image: stemCarnation,
    description: "Ruffled, long-lasting, budget-friendly",
    category: "main",
  },
  {
    id: "lily",
    name: "Lily",
    price: 5,
    image: stemLily,
    description: "Fragrant focal bloom with presence",
    category: "main",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    price: 3.5,
    image: stemSunflower,
    description: "Bold sunny stem for cheerful palettes",
    category: "main",
  },
  {
    id: "buttons",
    name: "Buttons",
    price: 3,
    image: stemButtons,
    description: "Tight button chrysanthemum texture",
    category: "main",
  },
  {
    id: "cremons",
    name: "Cremons",
    price: 3.5,
    image: stemCremons,
    description: "Spiky mum shape with modern edge",
    category: "main",
  },
  {
    id: "cushions",
    name: "Cushions",
    price: 3.5,
    image: stemCushions,
    description: "Soft cushion mum for fullness",
    category: "main",
  },
  {
    id: "magnums",
    name: "Magnums",
    price: 4,
    image: stemMagnums,
    description: "Oversized mum bloom for drama",
    category: "main",
  },
  // Filler flowers ($2–$6)
  {
    id: "limonium",
    name: "Limonium",
    price: 3.5,
    image: stemLimonium,
    description: "Airy clusters—great for depth",
    category: "filler",
  },
  {
    id: "babys-breath",
    name: "Baby's Breath",
    price: 2.5,
    image: stemBabysBreath,
    description: "Cloud-like classic filler",
    category: "filler",
  },
  {
    id: "lavender-stock",
    name: "Lavender Stock",
    price: 4,
    image: stemLavenderStock,
    description: "Fragrant spike with soft colour",
    category: "filler",
  },
  {
    id: "solidago",
    name: "Solidago",
    price: 2.5,
    image: stemSolidago,
    description: "Golden wispy accent stems",
    category: "filler",
  },
  {
    id: "statice",
    name: "Statice",
    price: 3,
    image: stemStatice,
    description: "Papery blooms that dry beautifully",
    category: "filler",
  },
  // Greenery ($1–$2)
  {
    id: "pittosporum",
    name: "Variegated Pittosporum",
    price: 2,
    image: stemPittosporum,
    description: "Cream-edged leaves for contrast",
    category: "greenery",
  },
  {
    id: "ruscus",
    name: "Ruscus",
    price: 1.5,
    image: stemRuscus,
    description: "Clean line greenery, florist staple",
    category: "greenery",
  },
  {
    id: "baby-eucalyptus",
    name: "Baby Eucalyptus",
    price: 1.5,
    image: stemBabyEucalyptus,
    description: "Small round leaves, soft movement",
    category: "greenery",
  },
  {
    id: "silver-dollar-eucalyptus",
    name: "Silver Dollar Eucalyptus",
    price: 2,
    image: stemSilverDollarEucalyptus,
    description: "Silvery rounds—Toronto favourite",
    category: "greenery",
  },
];

export const stemCategoryLabels: Record<StemCategory, { title: string; subtitle: string }> = {
  main: {
    title: "Main Flowers",
    subtitle: "$2–$6 per stem · priced for Toronto wholesale + hand-tied labour",
  },
  filler: {
    title: "Filler Flowers",
    subtitle: "$2–$6 per stem · texture and air between focal blooms",
  },
  greenery: {
    title: "Greenery",
    subtitle: "$1–$2 per stem · frame your palette and add movement",
  },
};

export const formatStemPrice = (price: number) =>
  price % 1 === 0 ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;

const colorNameById = Object.fromEntries(
  bouquetStemColors.map((c) => [c.id, c.name])
) as Record<BouquetStemColor, string>;

/** e.g. "2 red, 1 pink" from per-stem color picks */
export const formatStemColorSummary = (colors: BouquetStemColor[]) => {
  if (colors.length === 0) return "";
  const counts = new Map<BouquetStemColor, number>();
  for (const c of colors) {
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, n]) => (n > 1 ? `${n} ${colorNameById[id]}` : colorNameById[id]))
    .join(", ");
};
