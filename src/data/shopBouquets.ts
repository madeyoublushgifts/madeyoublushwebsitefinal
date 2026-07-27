import {
  romanticGarden,
  sunshineDelight,
  purpleElegance,
  deluxeBouquet,
  pureSerenity,
} from "@/assets/images";

export type ShopBouquet = {
  id: number;
  tierId: string;
  name: string;
  description: string;
  price: string;
  priceCents: number;
  image: string;
};

export const shopBouquets: ShopBouquet[] = [
  {
    id: 1,
    tierId: "single-stem",
    name: "Single Stem",
    description: "One standout stem—perfect for desks, apologies, or tiny celebrations",
    price: "$4.99",
    priceCents: 499,
    image: romanticGarden,
  },
  {
    id: 2,
    tierId: "mini",
    name: "Mini Bouquet",
    description: "Petite bundle with big personality for birthdays, brunch hosts, or “thinking of you”",
    price: "$16.99",
    priceCents: 1699,
    image: sunshineDelight,
  },
  {
    id: 3,
    tierId: "standard",
    name: "Standard Bouquet",
    description: "Our most-loved size for doorsteps, thank-yous, and everyday wow moments",
    price: "$34.99",
    priceCents: 3499,
    image: purpleElegance,
  },
  {
    id: 4,
    tierId: "deluxe",
    name: "Deluxe Bouquet",
    description: "Fuller stems with layered blooms and richer volume—our sweet spot for birthdays and “wow” moments",
    price: "$56.99",
    priceCents: 5699,
    image: deluxeBouquet,
  },
  {
    id: 5,
    tierId: "luxury",
    name: "Luxury Bouquet",
    description: "Extra stems and drama for anniversaries, milestones, or extra-proud moments",
    price: "$75",
    priceCents: 7500,
    image: pureSerenity,
  },
];

export const shopBouquetById = (id: number) => shopBouquets.find((b) => b.id === id);

export const shopBouquetByTierId = (tierId: string) =>
  shopBouquets.find((b) => b.tierId === tierId);

export const SHOP_BOUQUET_TIER_IDS: Record<number, string> = Object.fromEntries(
  shopBouquets.map((b) => [b.id, b.tierId])
) as Record<number, string>;
