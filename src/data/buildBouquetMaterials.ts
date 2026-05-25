import {
  wrapKraft,
  wrapTissue,
  wrapCellophane,
  wrapCotton,
  wrapSilk,
  ribbonCellophane,
  ribbonCotton,
  ribbonLace,
  ribbonSatin,
  ribbonGrosgrain,
  ribbonSilk,
  materialBasket,
  materialVase,
  materialCard,
  addonTeddy,
  addonFerrero,
  addonLindor,
} from "@/assets/images";

export type MaterialGroup = "wrapping" | "ribbon" | "addon";

export type BouquetMaterialOption = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  group: MaterialGroup;
};

export const materialGroupLabels: Record<
  MaterialGroup,
  { title: string; subtitle: string; pickOne?: boolean }
> = {
  wrapping: {
    title: "Wrapping",
    subtitle: "Choose one wrap style for your bouquet",
    pickOne: true,
  },
  ribbon: {
    title: "Ribbons",
    subtitle: "Choose one ribbon finish",
    pickOne: true,
  },
  addon: {
    title: "Add-ons",
    subtitle: "Optional extras—select any that fit your gift",
    pickOne: false,
  },
};

export const buildBouquetMaterials: BouquetMaterialOption[] = [
  // Wrapping
  {
    id: "wrap-kraft",
    name: "Kraft",
    price: 1,
    image: wrapKraft,
    description: "Natural brown paper—classic and earthy",
    group: "wrapping",
  },
  {
    id: "wrap-tissue",
    name: "Tissue",
    price: 2,
    image: wrapTissue,
    description: "Soft tissue layers in a blush palette",
    group: "wrapping",
  },
  {
    id: "wrap-cellophane",
    name: "Cellophane",
    price: 2,
    image: wrapCellophane,
    description: "Clear cellophane wrap—shows off every bloom",
    group: "wrapping",
  },
  {
    id: "wrap-cotton",
    name: "Cotton",
    price: 2,
    image: wrapCotton,
    description: "Woven cotton paper with a refined fold",
    group: "wrapping",
  },
  {
    id: "wrap-silk",
    name: "Silk",
    price: 5,
    image: wrapSilk,
    description: "Silk-style wrap with soft sheen and volume",
    group: "wrapping",
  },
  // Ribbons
  {
    id: "ribbon-cellophane",
    name: "Cellophane",
    price: 2,
    image: ribbonCellophane,
    description: "Sheer, airy ribbon with a light shimmer",
    group: "ribbon",
  },
  {
    id: "ribbon-cotton",
    name: "Cotton",
    price: 2,
    image: ribbonCotton,
    description: "Matte woven cotton ribbon",
    group: "ribbon",
  },
  {
    id: "ribbon-lace",
    name: "Lace",
    price: 3,
    image: ribbonLace,
    description: "Delicate lace with scalloped edges",
    group: "ribbon",
  },
  {
    id: "ribbon-satin",
    name: "Satin",
    price: 3,
    image: ribbonSatin,
    description: "Smooth satin with a soft gloss",
    group: "ribbon",
  },
  {
    id: "ribbon-grosgrain",
    name: "Grosgrain",
    price: 2,
    image: ribbonGrosgrain,
    description: "Ribbed grosgrain—structured and classic",
    group: "ribbon",
  },
  {
    id: "ribbon-silk",
    name: "Silk",
    price: 4,
    image: ribbonSilk,
    description: "Silk-finish ribbon in blush tones",
    group: "ribbon",
  },
  // Add-ons
  {
    id: "addon-basket",
    name: "Wicker Basket",
    price: 8,
    image: materialBasket,
    description: "Charming wicker presentation",
    group: "addon",
  },
  {
    id: "addon-vase",
    name: "Glass Vase",
    price: 15,
    image: materialVase,
    description: "Clear glass vase—ready for the counter",
    group: "addon",
  },
  {
    id: "addon-card",
    name: "Greeting Card",
    price: 2,
    image: materialCard,
    description: "Personalized message card",
    group: "addon",
  },
  {
    id: "addon-teddy",
    name: "Teddy Bear",
    price: 5,
    image: addonTeddy,
    description: "Plush teddy with blush ribbon & heart",
    group: "addon",
  },
  {
    id: "addon-ferrero",
    name: "Ferrero Rocher (12 count)",
    price: 8,
    image: addonFerrero,
    description: "12-count Ferrero Rocher box",
    group: "addon",
  },
  {
    id: "addon-lindor",
    name: "Lindor (150g)",
    price: 10,
    image: addonLindor,
    description: "150g Lindt Lindor milk chocolate truffles",
    group: "addon",
  },
];

export const materialsByGroup = (group: MaterialGroup) =>
  buildBouquetMaterials.filter((m) => m.group === group);

export const findMaterial = (id: string) =>
  buildBouquetMaterials.find((m) => m.id === id);

export const formatMaterialPrice = (price: number) =>
  price % 1 === 0 ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
