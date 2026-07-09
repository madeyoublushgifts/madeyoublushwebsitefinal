import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import SubscriptionCheckoutForm from "@/components/SubscriptionCheckoutForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { instagram, tiktok } from "@/lib/social";
import { motion } from "framer-motion";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { CreditCard, ShoppingCart } from "lucide-react";
import {
  BookOpen,
  CalendarHeart,
  Gift,
  Heart,
  MapPin,
  Palette,
  PenLine,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import {
  comingSoonBuilder,
  comingSoonBuilderDone,
} from "@/assets/images";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const annualPlan = subscriptionPlans.find((p) => p.id === "annual");

const ComingSoon = () => {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main>
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/10 via-background to-background">
          <motion.div
            className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6"
            {...fadeUp}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Now open
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Toronto Floral Subscription
              <span className="text-primary block">Gifting as a habit, not a luxury</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Subscribe for affordable floral delivery across Toronto — bi-weekly, monthly, or
              annual ({annualPlan?.priceLabel}). Pick your first delivery date, add birthdays and
              special occasions, and checkout securely with Stripe.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild size="lg" className="rounded-full">
                <a href="#subscribe">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscribe now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/shop">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop bouquets
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        {/* Subscription */}
        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8" {...fadeUp}>
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              {...fadeUp}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Floral subscription
              </h2>
              <p className="text-lg text-muted-foreground">
                Fresh stems on your schedule—bi-weekly, monthly, or save with our{" "}
                <strong className="text-foreground font-medium">$185/year</strong> annual plan.
                Choose your bouquet style, first delivery date, and the dates that matter most.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Heart,
                  title: "Personal",
                  text: "Your palette, your people—styled in-house with seasonal stems whenever possible.",
                },
                {
                  icon: Truck,
                  title: "Convenient",
                  text: "Recurring delivery to home, work, or a surprise doorstep—set it and let joy show up.",
                },
                {
                  icon: Gift,
                  title: "Affordable",
                  text: "Thoughtful tiers from single stems to luxury—gifting that fits real life, not just splurge days.",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-0 shadow-soft bg-card-gradient"
                >
                  <CardContent className="p-6 space-y-3 text-center">
                    <item.icon className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-heading text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Badge variant="outline" className="text-sm py-2 px-4">
                Bi-weekly delivery
              </Badge>
              <Badge variant="outline" className="text-sm py-2 px-4">
                Monthly delivery
              </Badge>
              <Badge variant="outline" className="text-sm py-2 px-4 border-primary/40 text-primary">
                Annual · $185/year · Best value
              </Badge>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* Subscribe */}
        <section id="subscribe" className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-gradient-to-b from-primary/5 to-background scroll-mt-20">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-2xl" {...fadeUp}>
            <div className="text-center space-y-4 mb-10">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Start your subscription
              </h2>
              <p className="text-muted-foreground">
                Secure checkout with Stripe · first delivery at least one week from today ·
                add special dates we can style blooms around.
              </p>
            </div>

            <SubscriptionCheckoutForm />
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* Build your own */}
        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-floral">
          <motion.div className="container mx-auto px-4 lg:px-8" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary">Interface preview</Badge>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                  Build-your-own bouquet—online
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Soon you&apos;ll handcraft bouquets right on our site: pick the
                  vibe, size, stem counts, colours, and how everything sits in the
                  wrap—then layer on presentation with wrapping, add-ons, and
                  messages before you inquire.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Choose stems & greenery with live stem counts",
                    "Set the mood—romantic, bright, moody, minimalist, and more",
                    "Preview arrangement & wrapping before you send",
                    "Add cards, treats, ribbon, vase, or basket finishes",
                  ].map((line) => (
                    <li key={line} className="flex gap-2">
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  Try our current{" "}
                  <Link
                    to="/create-bouquet"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Build a Bouquet
                  </Link>{" "}
                  flow today—we&apos;re evolving it into the full visual experience
                  alongside these previews.
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src={comingSoonBuilder}
                  alt="Preview of the upcoming build-your-own bouquet interface with stems and add-ons"
                  className="rounded-2xl shadow-soft w-full h-auto bg-card"
                  loading="lazy"
                />
                <img
                  src={comingSoonBuilderDone}
                  alt="Preview of theme, card message, and finished bouquet in the upcoming builder"
                  className="rounded-2xl shadow-soft w-full h-auto bg-card"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* Events */}
        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-4xl" {...fadeUp}>
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Pop-ups, markets & experiences
              </h2>
              <p className="text-lg text-muted-foreground">
                Meet us in person across Toronto—seasonal pop-ups, vendor markets,
                bouquet-building nights, and small events you can book for your
                crew.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: MapPin,
                  title: "Pop-ups & vendor markets",
                  text: "Find us at neighbourhood markets and collabs—dates on Instagram & TikTok.",
                },
                {
                  icon: Palette,
                  title: "Bouquet-building experiences",
                  text: "Hands-on nights to learn wrapping, stem choice, and your signature style.",
                },
                {
                  icon: CalendarHeart,
                  title: "Private & group bookings",
                  text: "Bridal showers, team socials, and milestones—florals tailored to your vibe.",
                },
                {
                  icon: Sparkles,
                  title: "Seasonal events",
                  text: "Limited-run workshops and partner activations throughout the year.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="h-full border-0 shadow-soft">
                    <CardContent className="p-6 flex gap-4">
                      <item.icon className="h-7 w-7 text-primary shrink-0" />
                      <motion.div className="space-y-1 min-w-0">
                        <h3 className="font-heading text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <p className="text-center text-sm text-muted-foreground mt-10">
              For event inquiries today, visit{" "}
              <Link
                to="/contact"
                className="text-primary underline-offset-4 hover:underline"
              >
                Contact
              </Link>{" "}
              or DM us on{" "}
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Instagram
              </a>{" "}
              or{" "}
              <a
                href={tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                TikTok
              </a>
              .
            </p>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        {/* Blush Notes */}
        <section id="blush-notes" className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-floral scroll-mt-20">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-4xl" {...fadeUp}>
            <div className="text-center space-y-4 mb-12">
              <Badge variant="secondary" className="text-sm px-4 py-1">
                On the horizon
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Blush Notes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A blog and newsletter from Made You Blush—Toronto stories behind the
                stems, seasonal gifting ideas, and a home for local creativity we
                love. Think cozy reads in your inbox, with room for artists,
                writers, and neighbours to share work alongside our floral world.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: BookOpen,
                  title: "Blog & newsletter",
                  text: "Essays, shop updates, and blush-toned inspiration—delivered when there’s something worth sharing.",
                },
                {
                  icon: Palette,
                  title: "Local art & makers",
                  text: "Spotlights on Toronto artists and small studios—visual work, crafts, and collabs that pair with blooms.",
                },
                {
                  icon: PenLine,
                  title: "Writing & community voices",
                  text: "Poetry, personal essays, and neighbourhood stories—we want your words in the mix.",
                },
                {
                  icon: Users,
                  title: "Collaborations",
                  text: "Partner features with markets, creatives, and community groups—florals meeting local culture.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="h-full border-0 shadow-soft bg-card/90">
                    <CardContent className="p-6 flex gap-4">
                      <item.icon className="h-7 w-7 text-primary shrink-0" />
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-heading text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 rounded-2xl border border-primary/20 bg-card/80 px-6 py-8 sm:px-10 text-center space-y-4 shadow-soft"
              {...fadeUp}
            >
              <p className="font-heading text-xl font-semibold text-foreground">
                We&apos;re still planting the first issue.
              </p>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Follow{" "}
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {instagram.handle}
                </a>{" "}
                and{" "}
                <a
                  href={tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {tiktok.handle}
                </a>{" "}
                for launch news—or{" "}
                <Link
                  to="/contact"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  reach out
                </Link>{" "}
                if you&apos;re a local artist, writer, or community org interested in
                collaborating.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Badge variant="outline">Art features</Badge>
                <Badge variant="outline">Original writing</Badge>
                <Badge variant="outline">Toronto collabs</Badge>
                <Badge variant="outline">Newsletter</Badge>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default ComingSoon;
