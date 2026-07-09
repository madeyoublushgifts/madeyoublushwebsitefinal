import {
  signatureRomanticGarden,
  signatureSunshineDelight,
  signaturePurpleElegance,
  signaturePureSerenity,
  signatureVelvetRed,
  signatureBohoBlush,
} from "@/assets/images";

export type SignatureBouquet = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
};

export const signatureBouquets: SignatureBouquet[] = [
  {
    id: "romantic-garden",
    name: "Romantic Garden",
    description: "A dreamy mix of pink roses, white peonies, and eucalyptus",
    price: "$55",
    image: signatureRomanticGarden,
  },
  {
    id: "sunshine-delight",
    name: "Sunshine Delight",
    description: "Cheerful yellow roses and sunflowers with greenery",
    price: "$52",
    image: signatureSunshineDelight,
  },
  {
    id: "purple-elegance",
    name: "Purple Elegance",
    description: "Sophisticated lavender roses with purple orchids",
    price: "$56",
    image: signaturePurpleElegance,
  },
  {
    id: "pure-serenity",
    name: "Pure Serenity",
    description: "All-white arrangement with lilies, roses, and baby's breath",
    price: "$54",
    image: signaturePureSerenity,
  },
  {
    id: "velvet-rouge",
    name: "Velvet Rouge",
    description:
      "Velvety crimson and wine-toned blooms with eucalyptus, wrapped in deep burgundy paper—made for anniversaries, apologies, and big-hearted gestures.",
    price: "$55",
    image: signatureVelvetRed,
  },
  {
    id: "toffee-skies",
    name: "Toffee Skies",
    description:
      "Toffee and cream roses with silvery eucalyptus and airy pampas on kraft wrap—a soft, editorial look for entryways, photos, and modern gifting.",
    price: "$53",
    image: signatureBohoBlush,
  },
];

export function getSignatureBouquet(id: string): SignatureBouquet | undefined {
  return signatureBouquets.find((b) => b.id === id);
}
