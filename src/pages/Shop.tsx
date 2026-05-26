import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InquiryForm from "@/components/ui/inquiry-form";
import BouquetPalettePicker from "@/components/BouquetPalettePicker";
import {
  defaultTierPaletteSelection,
  formatTierPaletteChoice,
  isTierPaletteComplete,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Flower, Sparkles } from "lucide-react";

// ===== Import Assets (import.meta.url via central registry) =====
import {
  romanticGarden as romantic_garden,
  sunshineDelight as sunshine_delight,
  purpleElegance as purple_elegance,
  deluxeBouquet as deluxe_bouquet,
  pureSerenity as purple_serenity,
  chocolatesAndBlooms as blooms_chocolates,
  floralCandleSet as floral_candle,
  card as card_addon,
  signatureRomanticGarden,
  signatureSunshineDelight,
  signaturePurpleElegance,
  signaturePureSerenity,
  signatureVelvetRed,
  signatureBohoBlush,
  giftGridSrc,
  curatedGiftChocolates,
  curatedGiftCandle,
  curatedGiftTeddy,
  crownSimpleBlush,
  crownSimpleRosebud,
} from "../assets/images";

type QuadCorner = "tl" | "tr" | "bl" | "br";
/** URL string, or one quadrant of a 2×2 composite */
type ShopCardImage = string | { src: string; corner: QuadCorner };

const Shop = () => {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [tierPalettes, setTierPalettes] = useState<Record<number, TierPaletteSelection>>({});

  // ===== Bouquets =====
  const bouquets = [
    {
      id: 1,
      name: "Single Stem",
      description: "One standout stem—perfect for desks, apologies, or tiny celebrations",
      price: "$5.99",
      image: romantic_garden,
      category: "bouquet",
    },
    {
      id: 2,
      name: "Mini Bouquet",
      description: "Petite bundle with big personality for birthdays, brunch hosts, or “thinking of you”",
      price: "$16.99",
      image: sunshine_delight,
      category: "bouquet",
    },
    {
      id: 3,
      name: "Standard Bouquet",
      description: "Our most-loved size for doorsteps, thank-yous, and everyday wow moments",
      price: "$34.99",
      image: purple_elegance,
      category: "bouquet",
    },
    {
      id: 4,
      name: "Deluxe Bouquet",
      description: "Fuller stems with lilies and layered blooms—our sweet spot for birthdays and “wow” moments",
      price: "$56.99",
      image: deluxe_bouquet,
      category: "bouquet",
    },
    {
      id: 5,
      name: "Luxury Bouquet",
      description: "Extra stems and drama for anniversaries, milestones, or extra-proud moments",
      price: "$75",
      image: purple_serenity,
      category: "bouquet",
    },
  ];

  // ===== Gifts =====
  const gifts = [
    {
      id: 5,
      name: "Handmade Card Add-On",
      description: "Illustrated, punny, or heartfelt—paired to match your bouquet vibe",
      price: "Inquire",
      image: card_addon,
      category: "gift",
    },
    {
      id: 6,
      name: "Snail-Mail Note Add-On",
      description: "Folded note, tiny envelope details, and the slow-mail feeling—without the junk mail",
      price: "Inquire",
      image: floral_candle,
      category: "gift",
    },
    {
      id: 7,
      name: "Gift Bundle",
      description: "Florals plus a coordinated treat—tell us their favourite snacks, scents, or silly inside jokes",
      price: "Inquire",
      image: blooms_chocolates,
      category: "gift",
    },
  ];

  const signatureBouquets: {
    id: number;
    name: string;
    description: string;
    price: string;
    image: ShopCardImage;
  }[] = [
    {
      id: 101,
      name: "Romantic Garden",
      description: "A dreamy mix of pink roses, white peonies, and eucalyptus",
      price: "$55",
      image: signatureRomanticGarden,
    },
    {
      id: 102,
      name: "Sunshine Delight",
      description: "Cheerful yellow roses and sunflowers with greenery",
      price: "$52",
      image: signatureSunshineDelight,
    },
    {
      id: 103,
      name: "Purple Elegance",
      description: "Sophisticated lavender roses with purple orchids",
      price: "$56",
      image: signaturePurpleElegance,
    },
    {
      id: 104,
      name: "Pure Serenity",
      description: "All-white arrangement with lilies, roses, and baby's breath",
      price: "$54",
      image: signaturePureSerenity,
    },
    {
      id: 105,
      name: "Velvet Rouge",
      description:
        "Velvety crimson and wine-toned blooms with eucalyptus, wrapped in deep burgundy paper—made for anniversaries, apologies, and big-hearted gestures.",
      price: "$55",
      image: signatureVelvetRed,
    },
    {
      id: 106,
      name: "Toffee Skies",
      description:
        "Toffee and cream roses with silvery eucalyptus and airy pampas on kraft wrap—a soft, editorial look for entryways, photos, and modern gifting.",
      price: "$53",
      image: signatureBohoBlush,
    },
  ];

  const curatedGiftSets: {
    id: number;
    name: string;
    description: string;
    price: string;
    image: ShopCardImage;
  }[] = [
    {
      id: 201,
      name: "Blooms & Chocolates",
      description: "Beautiful bouquet paired with artisanal chocolates",
      price: "$40",
      image: curatedGiftChocolates,
    },
    {
      id: 202,
      name: "Floral Candle Set",
      description: "Hand-picked flowers with lavender-scented candles",
      price: "$22",
      image: curatedGiftCandle,
    },
    {
      id: 203,
      name: "Teddy & Blooms",
      description: "Soft plush teddy bear with a mini bouquet",
      price: "$25",
      image: curatedGiftTeddy,
    },
    {
      id: 204,
      name: "Flower Crown",
      description: "Full floral crown with richer blooms—bridal showers, birthdays, and photo moments",
      price: "$30",
      image: { src: giftGridSrc, corner: "br" },
    },
    {
      id: 205,
      name: "Simple Crown — Blush Petals",
      description: "Light pink and white clusters on a slim vine base with satin ribbon tie",
      price: "$15",
      image: crownSimpleBlush,
    },
    {
      id: 206,
      name: "Simple Crown — Rosebud Vine",
      description: "Petite blush rosebuds and airy filler on a delicate twig crown—soft and minimal",
      price: "$15",
      image: crownSimpleRosebud,
    },
  ];

  const CARD_INQUIRY_ITEMS = new Set([
    "Handmade Card Add-On",
    "Snail-Mail Note Add-On",
  ]);

  const getTierPalette = (bouquetId: number) =>
    tierPalettes[bouquetId] ?? defaultTierPaletteSelection(bouquetId);

  const setTierPalette = (bouquetId: number, selection: TierPaletteSelection) => {
    setTierPalettes((prev) => ({ ...prev, [bouquetId]: selection }));
  };

  // ===== Handlers =====
  const handleInquire = (
    itemName: string,
    palette?: TierPaletteSelection,
    bouquetId?: number
  ) => {
    if (palette !== undefined && !isTierPaletteComplete(palette, bouquetId)) {
      toast({
        title: "Choose a palette first",
        description:
          palette.mode === "template"
            ? "Select a colour template, or switch to the colour picker to choose your colours."
            : "Pick at least one colour from the colour picker.",
      });
      return;
    }
    const paletteLabel =
      palette && isTierPaletteComplete(palette, bouquetId)
        ? formatTierPaletteChoice(palette, bouquetId)
        : "";
    setSelectedItem(paletteLabel ? `${itemName} — ${paletteLabel}` : itemName);
    setIsInquiryOpen(true);
  };

  const handleTierInquire = (bouquetId: number, bouquetName: string) => {
    handleInquire(bouquetName, getTierPalette(bouquetId), bouquetId);
  };

  const quadPosition: Record<QuadCorner, string> = {
    tl: "0% 0%",
    tr: "100% 0%",
    bl: "0% 100%",
    br: "100% 100%",
  };

  // ===== Renderer for Images/Emojis =====
  const renderImage = (image: ShopCardImage, alt: string) => {
    if (typeof image === "object") {
      return (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full min-h-[200px] bg-no-repeat group-hover:scale-110 transition-transform duration-500"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "200% 200%",
            backgroundPosition: quadPosition[image.corner],
          }}
        />
      );
    }
    if (typeof image === "string" && image.length <= 4) {
      return (
        <div className="text-8xl group-hover:scale-110 transition-transform duration-500">
          {image}
        </div>
      );
    }
    return (
      <img
        src={image}
        alt={alt}
        width={600}
        height={600}
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ===== Hero Section ===== */}
        <section className="pt-12 pb-6 lg:pt-16 lg:pb-8 bg-gradient-to-b from-primary/10 to-background animate-fade-in">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="max-w-4xl mx-auto text-center space-y-4">
      <h1 className="font-heading text-4xl lg:text-5xl font-bold animate-fade-in-up">
        Shop Gifts & Flowers
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        Toronto’s affordable & thoughtful floral subscription + gift shop. Browse
        our tiers and add-ons, then inquire—we’ll confirm timing, pickup or
        delivery options, and any personalization.
      </p>
    </div>
  </div>
</section>


        {/* ===== Bouquets Section ===== */}
        <section id="bouquet-tiers" className="pt-8 pb-16 lg:pt-8 lg:pb-20 bg-background">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-center space-y-4 mb-16 max-w-2xl mx-auto"
    >
      <h2 className="font-heading text-5xl lg:text-4xl font-bold">
        Bouquet tiers
      </h2>
      <p className="text-lg lg:text-xl text-muted-foreground">
        From a single stem to luxury—every tier is styled in-house with seasonal
        stems whenever possible. Pick a colour template or use the colour picker
        on each tier before you inquire.
      </p>
      <div className="flex justify-center">
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>
    </motion.div>

    {/* Bouquets Grid */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.2 },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
    >
      {bouquets.map((bouquet) => (
        <motion.div
          key={bouquet.id}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Card className="group cursor-pointer border-0 shadow-soft bg-card-gradient rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                {renderImage(bouquet.image, bouquet.name)}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-background/80 backdrop-blur"
                  >
                    {bouquet.price}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {bouquet.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {bouquet.description}
                  </p>
                </div>
                <BouquetPalettePicker
                  bouquetId={bouquet.id}
                  selection={getTierPalette(bouquet.id)}
                  onChange={(next) => setTierPalette(bouquet.id, next)}
                />
                <Button
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                  onClick={() => handleTierInquire(bouquet.id, bouquet.name)}
                >
                  Inquire / Pre-order
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
        {/* ===== Gifts Section ===== */}
       

<section className="py-20 bg-floral">
  <div className="container mx-auto px-4 lg:px-8">
    {/* Heading Animation */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-center space-y-4 mb-16"
    >
      <h2 className="font-heading text-4xl lg:text-3xl font-bold">
        Cards, notes & bundles
      </h2>
      <p className="text-xl text-muted-foreground max-w-xl mx-auto">
        Handmade cards, snail-mail style notes, and gift bundles layered onto any
        bouquet inquiry.
      </p>
      <div className="flex justify-center">
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>
    </motion.div>

    {/* Grid Animation */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.2 },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {gifts.map((gift) => (
        <motion.div
          key={gift.id}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Card className="flower-card group cursor-pointer border-0 shadow-soft bg-card rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Gift Image */}
              <motion.div
                className="relative overflow-hidden rounded-t-lg aspect-square bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                {renderImage(gift.image, gift.name)}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-background/80 backdrop-blur"
                  >
                    {gift.price}
                  </Badge>
                </div>
              </motion.div>

              {/* Gift Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {gift.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {gift.description}
                  </p>
                </div>
                <Button
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                  onClick={() => handleInquire(gift.name)}
                >
                  Inquire / Pre-order
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

        {/* ===== Signature Bouquets (template favourites) ===== */}
        <section id="signature-bouquets" className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16 max-w-2xl mx-auto"
            >
              <h2 className="font-heading text-5xl lg:text-4xl font-bold">Signature Bouquets</h2>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Six lookbook favourites—from sun-washed brights to velvet reds and pampas-soft
                texture—each styled in-house and priced alongside our everyday bouquet tiers when you
                want a named mood, not a mystery wrap.
              </p>
              <div className="flex justify-center">
                <div className="w-20 h-1 bg-primary rounded-full mt-2" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {signatureBouquets.map((bouquet) => (
                <motion.div
                  key={bouquet.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Card className="group cursor-pointer border-0 shadow-soft bg-card-gradient rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                        {renderImage(bouquet.image, bouquet.name)}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            {bouquet.price}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {bouquet.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{bouquet.description}</p>
                        </div>
                        <Button
                          className="w-full transition-transform duration-300 group-hover:scale-105"
                          onClick={() => handleInquire(bouquet.name)}
                        >
                          Inquire / Pre-order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== Curated Gift Sets (template favourites) ===== */}
        <section id="curated-gift-sets" className="py-20 bg-floral">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="font-heading text-4xl lg:text-3xl font-bold">Curated Gift Sets</h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Thoughtfully paired gifts that combine the beauty of flowers with delightful surprises.
              </p>
              <div className="flex justify-center">
                <div className="w-20 h-1 bg-primary rounded-full mt-2" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {curatedGiftSets.map((gift) => (
                <motion.div
                  key={gift.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Card className="flower-card group cursor-pointer border-0 shadow-soft bg-card rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <motion.div
                        className="relative overflow-hidden rounded-t-lg aspect-square bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                      >
                        {renderImage(gift.image, gift.name)}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            {gift.price}
                          </Badge>
                        </div>
                      </motion.div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {gift.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{gift.description}</p>
                        </div>
                        <Button
                          className="w-full transition-transform duration-300 group-hover:scale-105"
                          onClick={() => handleInquire(gift.name)}
                        >
                          Inquire / Pre-order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-16 sm:mt-20 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="rounded-3xl border-2 border-primary/20 bg-card/90 shadow-soft px-6 py-10 sm:px-10 sm:py-12 text-center space-y-5">
                <Sparkles className="h-8 w-8 text-primary mx-auto" />
                <p className="font-heading text-xl sm:text-2xl font-semibold text-foreground leading-snug">
                  Rather pick every stem yourself?
                </p>
                <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Build a custom bouquet—choose flowers, fillers, greenery, colours, and wrapping.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-lg px-10 py-7 h-auto shadow-lg hover:scale-[1.03] transition-transform"
                >
                  <Link to="/create-bouquet">
                    <Flower className="mr-2 h-6 w-6" />
                    Build a Bouquet
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== Custom Note ===== */}
        <section className="py-20 bg-background">
  <div className="container mx-auto px-4 lg:px-8">
    <motion.div
      className="max-w-4xl mx-auto text-center space-y-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Icon Animation */}
      <motion.div
        className="text-6xl mb-4"
        initial={{ rotate: -10, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        ✨
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="font-heading text-3xl lg:text-4xl font-bold"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true }}
      >
        Don't See What You're Looking For?
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true }}
      >
        Tell us the occasion, palette, allergies, and budget—we’ll sketch ideas
        before we ever touch the shears.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleInquire("Custom Arrangement Request")}
          className="hover:scale-105 transition-transform duration-300"
        >
          Inquire / Pre-order
        </Button>
      </motion.div>
    </motion.div>
  </div>
</section>
      </main>

      <Footer />

      {/* ===== Inquiry Modal ===== */}
      <InquiryForm
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        title="Inquire / Pre-order"
        description="We’ll reply with availability, pickup or delivery windows, and any personalization details—no cart yet, just humans."
        itemName={selectedItem}
        source="Shop"
        showPersonalMessage={CARD_INQUIRY_ITEMS.has(selectedItem)}
      />
    </div>
  );
};

export default Shop;