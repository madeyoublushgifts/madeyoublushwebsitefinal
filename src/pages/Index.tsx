// ================= IMPORTS =================
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import BrandLogo from "@/components/BrandLogo";
import {
  ArrowRight,
  Flower,
  Heart,
  Loader2,
  Mail,
  Phone,
  ShoppingCart,
  Sparkles,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { submitToFormspree } from "@/lib/formspree";

// ================= ASSETS =================
import {
  showcaseMiniBouquet,
  showcaseStandardBouquet,
  showcaseDeluxeBouquet,
  showcaseLuxuryBouquet,
  showcaseSignatureBouquets,
  showcaseCuratedGiftSets,
  showcaseSubscription,
} from "../assets/images";
import { instagram, tiktok } from "@/lib/social";

const HERO_INTRO =
  "Toronto florist for affordable hand-tied bouquets, custom flower gifts, and curated gift sets. Build a bouquet, send a heartfelt note, or inquire for GTA pickup and delivery.";

const HERO_PROMO = {
  title: "Pop-ups & markets",
  discount: "Instagram & TikTok",
  subtitle: "Toronto dates announced seasonally",
} as const;

// ================= HERO SLIDES DATA =================
type SlideItem = {
  name: string;
  desc: string;
  price: string;
  emoji: string;
  oldPrice?: string; // ✅ optional everywhere
};

type Slide = {
  id: number;
  titleLine1: string;
  titleLine2: string;
  description: string;
  price: string;
  featured: string;
  image: string;
  imageSize?: { width: number; height: number };
  promo: {
    title: string;
    discount: string;
    subtitle: string;
  };
  items: SlideItem[];
};

const slides: Slide[] = [
  {
    id: 1,
    titleLine1: "Made You",
    titleLine2: "Blush",
    description: HERO_INTRO,
    price: "$16.99",
    featured: "01 / Mini bouquet",
    image: showcaseMiniBouquet,
    imageSize: { width: 1200, height: 800 },
    promo: { ...HERO_PROMO },
    items: [
      {
        name: "Mini Bouquet",
        desc: "Petite hand-tied stems",
        price: "$16.99",
        emoji: "🌸",
      },
    ],
  },
  {
    id: 2,
    titleLine1: "Made You",
    titleLine2: "Blush",
    description: HERO_INTRO,
    price: "$34.99",
    featured: "02 / Standard bouquet",
    image: showcaseStandardBouquet,
    promo: { ...HERO_PROMO },
    items: [
      {
        name: "Standard Bouquet",
        desc: "Our most-loved size",
        price: "$34.99",
        emoji: "💐",
      },
    ],
  },
  {
    id: 3,
    titleLine1: "Made You",
    titleLine2: "Blush",
    description: HERO_INTRO,
    price: "$56.99",
    featured: "03 / Deluxe bouquet",
    image: showcaseDeluxeBouquet,
    promo: { ...HERO_PROMO },
    items: [
      {
        name: "Deluxe Bouquet",
        desc: "Layered blooms for wow moments",
        price: "$56.99",
        emoji: "✨",
      },
    ],
  },
];

// ================= MAIN COMPONENT =================
const Index = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Auto-slide rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[activeSlide];

  const handleContactChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);

    try {
      await submitToFormspree("contact", {
        _subject: contactForm.subject.trim()
          ? `Made You Blush — ${contactForm.subject.trim()}`
          : "Made You Blush — homepage contact form",
        _replyto: contactForm.email,
        source: "Homepage Get in Touch",
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message,
      });

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast({
        title: "Could not send message",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email madeyoublushgifts@gmail.com.",
        variant: "destructive",
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Featured collections
  const featuredCollections = [
    {
      title: "Luxury bouquet",
      description:
        "$75 · Premium stems with orchids, lilies, and lush garden roses—wrapped for maximum wow on milestones and celebrations.",
      image: showcaseLuxuryBouquet,
      link: "/shop#bouquet-tiers",
    },
    {
      title: "Signature bouquets",
      description:
        "Named look-book styles from sunshine brights to velvet reds—pick a mood and we’ll build it in your palette.",
      image: showcaseSignatureBouquets,
      link: "/shop#signature-bouquets",
    },
    {
      title: "Curated gift sets",
      description:
        "Blooms paired with chocolates, candles, teddy keepsakes, and more—gift-ready layers for birthdays, thank-yous, and “you deserve this” days.",
      image: showcaseCuratedGiftSets,
      link: "/shop#curated-gift-sets",
    },
    {
      title: "Floral subscription",
      description:
        "Join the waitlist for recurring delivery—pick a shop tier or custom build, choose your cadence, and set the dates that matter most.",
      image: showcaseSubscription,
      link: "/subscription",
    },
  ];

  // Why Choose Us features
  const whyChooseUs = [
    {
      icon: Sparkles,
      title: "Thoughtful by design",
      description:
        "Curated bouquets, handmade cards, and gift add-ons for real-life moments",
    },
    {
      icon: Heart,
      title: "Toronto-rooted",
      description:
        "Local florist pop-ups, vendor markets, and bouquet-building experiences across Toronto and the GTA",
    },
    {
      icon: Leaf,
      title: "Affordable & fresh",
      description:
        "Transparent tiers from single stems to luxury—always inquiry-based for now",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <Header />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-background min-h-screen flex items-center animate-fadeIn">
          <h1 className="sr-only">
            Made You Blush — Affordable Toronto Florist for Custom Bouquets, Flower Gifts & Subscriptions
          </h1>
          {/* Floating petals */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="petal animate-petal-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${12 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-start lg:pt-4">
              {/* Hero Left Content */}
              <div className="lg:col-span-4 text-center lg:text-left order-2 lg:order-1 animate-slideInLeft">
                <div className="w-full space-y-1">
                  <div className="w-full flex justify-center lg:justify-start">
                    <BrandLogo
                      variant="hero"
                      className="w-full max-w-[16rem] sm:max-w-sm md:max-w-md lg:max-w-full mx-auto lg:mx-0"
                    />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0 lg:max-w-none animate-fadeIn delay-300">
                    {current.description}
                  </p>
                </div>
                <div className="space-y-6 mt-6">
                  {/* Price and Featured Tag */}
                  <div className="space-y-2 animate-fadeIn delay-500">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {current.price}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-lg text-muted-foreground">
                      <span className="font-bold text-foreground">
                        {String(current.id).padStart(2, "0")}
                      </span>
                      <span>/</span>
                      <span>{current.featured}</span>
                    </div>
                  </div>

                  {/* Hero Buttons */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-2.5 pt-3 justify-center lg:justify-start animate-fadeIn delay-700 max-w-md mx-auto lg:mx-0">
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-0 shrink-0">
                      <Link to="/shop">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Shop Gifts & Flowers
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-0 shrink-0">
                      <Link to="/create-bouquet">
                        <Flower className="mr-2 h-5 w-5" />
                        Build a Bouquet
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hero Center Image */}
              <div className="lg:col-span-4 flex justify-center order-1 lg:order-2 animate-float">
                <img
                  src={current.image}
                  alt={`${current.titleLine1} ${current.titleLine2}`}
                  width={800}
                  height={800}
                  decoding="async"
                  fetchPriority={activeSlide === 0 ? "high" : "auto"}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain drop-shadow-lg"
                />
              </div>

              {/* Hero Right Sidebar */}
              <div className="lg:col-span-4 space-y-4 order-3 animate-slideInRight">
                {/* Promo Card */}
                <Card className="bg-primary/10 border-primary/20 shadow-soft hover:shadow-bloom transition-all duration-500">
                  <CardContent className="p-4 sm:p-6 text-center lg:text-left space-y-2">
                    <h3 className="font-heading text-xl font-semibold text-primary">
                      {current.promo.title}
                    </h3>
                    <p className="text-lg text-primary/80 font-medium">
                      {current.promo.discount === "Instagram & TikTok" ? (
                        <span className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-1.5 gap-y-0.5">
                          <a
                            href={instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                          >
                            {instagram.handle}
                          </a>
                          <span className="text-primary/60">·</span>
                          <a
                            href={tiktok.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                          >
                            {tiktok.handle}
                          </a>
                        </span>
                      ) : (
                        current.promo.discount
                      )}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {current.promo.subtitle}
                    </p>
                  </CardContent>
                </Card>

                {/* Slide Thumbnails */}
                <div className="space-y-3 animate-fadeIn delay-700">
                  {slides.map((slide, idx) => (
                    <Card
                      key={slide.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        activeSlide === idx
                          ? "ring-2 ring-primary shadow-bloom"
                          : "bg-card"
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl animate-bloom">
                          {slide.items[0].emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-base truncate">
                            {slide.items[0].name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {slide.items[0].desc}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {slide.items[0].oldPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {slide.items[0].oldPrice}
                            </p>
                          )}
                          <p className="font-semibold text-primary text-base">
                            {slide.items[0].price}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Mobile Navigation Dots */}
                <div className="flex justify-center space-x-2 pt-2 sm:pt-4 lg:hidden">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? "bg-primary scale-125"
                          : "bg-muted hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* ================= FEATURED COLLECTIONS ================= */}

        <section className="pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-background relative overflow-hidden">
          {/* Floating background shapes */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div
              className="absolute top-10 left-1/4 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply blur-3xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="absolute bottom-10 right-1/3 w-56 h-56 bg-purple-300 rounded-full mix-blend-multiply blur-3xl"
              animate={{ y: [0, 25, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center space-y-3 sm:space-y-4 mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
                Shop highlights
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Luxury bouquet tiers, signature Toronto florist styles, curated gift sets, and our
                floral subscription waitlist—browse affordable flower gifts or join for recurring
                delivery.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {featuredCollections.map((collection, idx) => (
                <Link key={collection.title} to={collection.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: idx * 0.2,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03, y: -4 }}
                  >
                    <Card className="flower-card group cursor-pointer border-0 shadow-soft bg-card-gradient h-full overflow-hidden relative transition-all duration-700 ease-out">
                      <CardContent className="p-0 h-full flex flex-col items-center relative z-10">
                        {/* Image Container */}
                        <div className="relative flex justify-center items-center pt-8 sm:pt-12 w-full">
                          <motion.div
                            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-pink-200 rounded-full opacity-40 z-0"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          ></motion.div>
                          <motion.img
                            src={collection.image}
                            alt={`${collection.title} — Toronto florist gift collection by Made You Blush`}
                            loading="lazy"
                            decoding="async"
                            className="w-32 sm:w-40 lg:w-48 h-auto object-contain z-10"
                            whileHover={{ scale: 1.1, y: -5 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          />
                        </div>

                        {/* Collection Content */}
                        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 text-center">
                          <h3 className="font-heading text-xl sm:text-2xl font-semibold">
                            {collection.title}
                          </h3>
                          <p className="text-lg text-muted-foreground">
                            {collection.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* ================= WHY CHOOSE US ================= */}
        <section className="pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-floral overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center space-y-3 sm:space-y-4 mb-12 lg:mb-16"
            >
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
                Why Choose Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Affordable tiers, thoughtful packaging, and humans who actually
                read your note requests
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {whyChooseUs.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="text-center border-0 shadow-soft bg-card h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4 h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mx-auto">
                        <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl sm:text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed flex-1">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* ================= CALL TO ACTION ================= */}
        <section className="pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-primary/5 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              className="max-w-3xl mx-auto space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.h2
                className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                Ready to make someone blush?
              </motion.h2>

              <motion.p
                className="text-lg text-muted-foreground px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Tell us your date, budget, and story—we’ll reply with options for
                bouquets, gifts, or an in-person experience.
              </motion.p>

              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/create-bouquet">
                  Build a Bouquet
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* ================= CONTACT FORM ================= */}
        <section className="pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl mx-auto border-2 border-pink-200 rounded-2xl p-5 sm:p-8 bg-white shadow-soft"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Get in Touch
              </motion.h2>

              <motion.p
                className="text-center text-muted-foreground text-base mb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Ask about subscriptions, same-week bouquets, or pop-up dates—we
                reply within 1–2 business days.
              </motion.p>

              <motion.form
                onSubmit={handleContactSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="home-name"
                    className="mb-2 font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="home-name"
                    name="name"
                    required
                    disabled={isContactSubmitting}
                    value={contactForm.name}
                    onChange={(e) => handleContactChange("name", e.target.value)}
                    placeholder="Who should we say hi to?"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="home-email"
                    className="mb-2 font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="home-email"
                    name="email"
                    required
                    disabled={isContactSubmitting}
                    value={contactForm.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    placeholder="you@email.com"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col">
                  <label
                    htmlFor="home-subject"
                    className="mb-2 font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="home-subject"
                    name="subject"
                    disabled={isContactSubmitting}
                    value={contactForm.subject}
                    onChange={(e) => handleContactChange("subject", e.target.value)}
                    placeholder="Bouquet inquiry, pop-up idea, subscription…"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col">
                  <label
                    htmlFor="home-message"
                    className="mb-2 font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="home-message"
                    name="message"
                    rows={3}
                    required
                    disabled={isContactSubmitting}
                    value={contactForm.message}
                    onChange={(e) => handleContactChange("message", e.target.value)}
                    placeholder="Tell us dates, neighbourhood, vibe, and any add-ons (cards, snail-mail notes, gifts)."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition resize-none disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2 text-center pt-1">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isContactSubmitting}
                    className="w-full sm:w-auto min-w-[10rem]"
                  >
                    {isContactSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-5 w-5" />
                        <Mail className="mr-2 h-5 w-5" />
                        Contact Us
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Index;
