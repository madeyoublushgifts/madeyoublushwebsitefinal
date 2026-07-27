import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bloomBarBeachSunset,
  bloomBarIndoorCart,
  bloomBarIndoorStand,
  bloomBarOutdoorCart,
  bloomBarSidewalk,
} from "@/assets/images";
import { motion } from "framer-motion";
import {
  Cake,
  Flower2,
  Gem,
  Heart,
  PartyPopper,
  Sparkles,
  Users,
  Wine,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const occasions = [
  {
    icon: Gem,
    title: "Weddings & bridal showers",
    text: "Bloom Bars for guest favours, shower activities, or soft florals for the room—personal, not cookie-cutter.",
  },
  {
    icon: Cake,
    title: "Birthdays",
    text: "Let guests build mini bouquets, or style the space with arrangements that feel festive and photogenic.",
  },
  {
    icon: Heart,
    title: "Anniversaries",
    text: "Intimate at-home or venue setups—DIY blooms, table florals, or a little décor moment just for you.",
  },
  {
    icon: PartyPopper,
    title: "Parties & gatherings",
    text: "House parties, garden hangs, studio events—scale a Bloom Bar or décor package to your guest list and vibe.",
  },
];

const offerings = [
  {
    title: "Bloom Bar & make-your-own bouquet",
    text: "A styled stem station where guests pick flowers, wrap their own bouquet, and leave with something they made. Daytime, evening, indoor, or outdoor—we adapt to your schedule.",
  },
  {
    title: "Floral arrangements & décor",
    text: "Centrepieces, statement pieces, entrance florals, and room styling so the whole space feels soft, fresh, and Made You Blush—without needing a full DIY station.",
  },
];

const setupPhotos = [
  {
    src: bloomBarIndoorCart,
    alt: "Wooden gift cart beside a yellow flower stand with roses, hydrangeas, and greenery",
    rotate: -2.5,
  },
  {
    src: bloomBarOutdoorCart,
    alt: "White flower rack and wooden cart with blooms and cards on a sunny sidewalk",
    rotate: 2,
  },
  {
    src: bloomBarBeachSunset,
    alt: "Yellow flower cart with priced stem buckets on a beach at sunset",
    rotate: -1.5,
  },
  {
    src: bloomBarIndoorStand,
    alt: "Indoor Bloom Bar with wooden cart and yellow tiered flower stand",
    rotate: 2.5,
  },
  {
    src: bloomBarSidewalk,
    alt: "Yellow flower stand and wooden cart with hydrangeas and roses outdoors",
    rotate: -2,
  },
];

const steps = [
  {
    step: "01",
    title: "Share your event details",
    text: "Send us the date, location, guest count, colour palette, and whether you’d like a Bloom Bar, floral arrangements and décor, or both.",
  },
  {
    step: "02",
    title: "We plan the florals with you",
    text: "We’ll confirm the flowers, wrapping, and décor layout so everything fits your vibe and budget before the day.",
  },
  {
    step: "03",
    title: "We set up; you enjoy the party",
    text: "On the day, we arrive, set everything up, and handle the Bloom Bar or décor so you can focus on hosting.",
  },
];

const Events = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxPhoto = lightboxIndex !== null ? setupPhotos[lightboxIndex] : null;

  return (
    <motion.div
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="overflow-x-hidden">
        <section className="relative overflow-hidden py-16 lg:py-24 min-h-[70vh] flex items-center bg-gradient-to-br from-primary/15 via-background to-secondary/40">
          <motion.div
            className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -left-10 bottom-8 h-48 w-48 rounded-full bg-secondary/80 blur-3xl"
            animate={{ scale: [1.05, 1, 1.05], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          <motion.div
            className="container relative mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6"
            {...fadeUp}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Private experiences
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Bloom Bar & floral décor
              <span className="text-primary block">arrangements for your celebration</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Bring Made You Blush to your celebration—make-your-own bouquet stations, floral
              arrangements, and décor for weddings, bridal showers, birthdays, anniversaries, and
              parties across Toronto and the GTA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <Link to="/contact">
                  <Flower2 className="mr-2 h-5 w-5" />
                  Book an experience
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <a href="#setup-gallery">
                  <Sparkles className="mr-2 h-5 w-5" />
                  See the setup
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-10" {...fadeUp}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">What we bring</h2>
              <p className="text-muted-foreground text-lg">
                Interactive Bloom Bars, full floral décor—or a mix of both.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {offerings.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="space-y-3 text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section
          id="setup-gallery"
          className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-gradient-to-b from-secondary/30 via-background to-background scroll-mt-24"
        >
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-6xl space-y-10" {...fadeUp}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">Setup inspiration</h2>
              <p className="text-muted-foreground text-lg">
                Real Made You Blush setups—Bloom Bars, stem stands, carts, and floral décor touches.
                Tap a photo to view it larger.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 sm:gap-7 lg:gap-8">
              {setupPhotos.map((photo, index) => (
                <motion.button
                  key={photo.src}
                  type="button"
                  aria-label={`View larger: ${photo.alt}`}
                  onClick={() => setLightboxIndex(index)}
                  className="w-[11.5rem] sm:w-56 md:w-64 lg:w-72 shrink-0 text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  initial={{ opacity: 0, y: 28, rotate: photo.rotate }}
                  whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
                  whileHover={{ rotate: 0, y: -6, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="relative bg-[#f7dde6] p-3 shadow-[0_10px_28px_hsl(var(--primary)/0.16)] ring-1 ring-primary/15">
                    <div
                      className="pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
                      aria-hidden
                    />
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <Dialog
            open={lightboxIndex !== null}
            onOpenChange={(open) => {
              if (!open) setLightboxIndex(null);
            }}
          >
            <DialogContent className="max-w-[min(96vw,52rem)] sm:max-w-[min(96vw,52rem)] sm:max-h-[min(94dvh,56rem)] border-0 bg-transparent p-0 shadow-none sm:rounded-none overflow-visible">
              <DialogTitle className="sr-only">Setup photo</DialogTitle>
              <DialogDescription className="sr-only">
                {lightboxPhoto?.alt ?? "Enlarged setup photo"}
              </DialogDescription>
              {lightboxPhoto && (
                <img
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.alt}
                  className="mx-auto max-h-[min(88dvh,52rem)] w-auto max-w-full object-contain rounded-md shadow-2xl"
                />
              )}
            </DialogContent>
          </Dialog>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-10" {...fadeUp}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">Made for your occasion</h2>
              <p className="text-muted-foreground text-lg">
                One experience, styled to fit the room—whether it&apos;s twelve close friends or a
                full wedding guest list.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {occasions.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="space-y-3 text-center sm:text-left"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="h-8 w-8 text-primary mx-auto sm:mx-0" />
                  <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section
          id="how-it-works"
          className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-gradient-to-b from-primary/5 to-background scroll-mt-24"
        >
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-10" {...fadeUp}>
            <div className="text-center space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">How it works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps from inquiry to event day.
              </p>
            </div>

            <ol className="space-y-8">
              {steps.map((item, index) => (
                <motion.li
                  key={item.step}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="font-heading text-3xl font-bold text-primary/80 shrink-0 w-14 text-center">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-background">
          <motion.div
            className="container mx-auto px-4 lg:px-8 max-w-3xl text-center space-y-6"
            {...fadeUp}
          >
            <Users className="h-10 w-10 text-primary mx-auto" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Ready to plan your event?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Share your date, guest count, budget range, and vibe—we&apos;ll reply with options for
              a Bloom Bar, floral arrangements and décor, or a lighter activity kit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <Link to="/contact">
                  <Wine className="mr-2 h-5 w-5" />
                  Inquire for your event
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <Link to="/pop-ups">See our pop-ups</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Events;
