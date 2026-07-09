import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { instagram, tiktok } from "@/lib/social";
import { motion } from "framer-motion";
import { CalendarHeart, CreditCard, Sparkles, BookOpen, Palette, PenLine, Users } from "lucide-react";
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

const ComingSoon = () => {
  return (
    <motion.div
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main>
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/10 via-background to-background">
          <motion.div
            className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6"
            {...fadeUp}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Coming soon
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              What&apos;s next at
              <span className="text-primary block">Made You Blush</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              You can already{" "}
              <Link
                to="/create-bouquet"
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                build a bouquet
              </Link>{" "}
              on the site—we&apos;re working on a full visual bouquet visualizer next, plus{" "}
              <strong className="text-foreground font-medium">Blush Notes</strong>, our blog and
              newsletter for Toronto stories, seasonal gifting, and local creativity. Subscribe
              today for floral delivery while you wait.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild size="lg" className="w-full sm:w-auto min-h-11 rounded-full">
                <a href="#bouquet-builder">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Bouquet visualizer preview
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-h-11 rounded-full">
                <a href="#blush-notes">
                  <PenLine className="mr-2 h-5 w-5" />
                  Blush Notes
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-h-11 rounded-full">
                <Link to="/subscription">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Floral subscription
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section
          id="bouquet-builder"
          className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-floral scroll-mt-20"
        >
          <motion.div className="container mx-auto px-4 lg:px-8" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary">Coming soon</Badge>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                  Bouquet visualizer—a full visual experience
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  <Link
                    to="/create-bouquet"
                    className="text-primary font-medium underline-offset-4 hover:underline"
                  >
                    Build a Bouquet
                  </Link>{" "}
                  already lives on the site—pick stems, colours, wrapping, and add-ons step by step.
                  What we&apos;re building next is a true visualizer: a rich UX interface where you
                  see your bouquet take shape as you design it, not just a form at the end.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Live visual preview as stems, greenery, and fillers come together",
                    "See wrapping, ribbon, and palette choices update on the bouquet in real time",
                    "Explore mood, theme, and card message with the arrangement in view",
                    "A polished, playful interface—from stem picker to finished bouquet",
                  ].map((line) => (
                    <li key={line} className="flex gap-2">
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  The mockups below are early glimpses of that experience. Until the visualizer
                  ships, use{" "}
                  <Link
                    to="/create-bouquet"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Build a Bouquet
                  </Link>{" "}
                  to craft your order today—or add it straight to cart.
                </p>
                <Button asChild className="w-full sm:w-auto min-h-11">
                  <Link to="/create-bouquet">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Build a bouquet now
                  </Link>
                </Button>
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
                  alt="Early mockup of the upcoming bouquet visualizer—stem picker and add-ons"
                  className="rounded-2xl shadow-soft w-full h-auto bg-card"
                  loading="lazy"
                />
                <img
                  src={comingSoonBuilderDone}
                  alt="Early mockup of theme, card message, and finished bouquet in the visualizer"
                  className="rounded-2xl shadow-soft w-full h-auto bg-card"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section id="blush-notes" className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background scroll-mt-20">
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
                  text: "Essays, shop updates, and blush-toned inspiration—plus floral fun facts and flower care tips—delivered when there’s something worth sharing.",
                },
                {
                  icon: Palette,
                  title: "Local art",
                  text: "Spotlights on Toronto artists and small studios—visual work, crafts, and pieces that pair beautifully with blooms.",
                },
                {
                  icon: PenLine,
                  title: "Writing & community voices",
                  text: "Poetry, personal essays, and neighbourhood stories—we want your words in the mix.",
                },
                {
                  icon: Users,
                  title: "Collaborations",
                  text: "We want to publish, collaborate, and partner with people and studios working in zines, magazines, collages, mosaics, paintings, and more.",
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
              className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 px-6 py-7 sm:px-8 text-center space-y-3"
              {...fadeUp}
            >
              <div className="inline-flex items-center justify-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
                  Themed editions
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We can imagine special <strong className="text-foreground font-medium">Blush Notes</strong>{" "}
                editions on specific themes—months, horoscopes, colours, social justice causes, and
                more—little issues that feel like a bouquet tied to a moment.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Badge variant="outline">Months</Badge>
                <Badge variant="outline">Horoscopes</Badge>
                <Badge variant="outline">Colours</Badge>
                <Badge variant="outline">Social justice</Badge>
              </div>
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
                if you&apos;re a local artist, writer, zine maker, studio, or community org interested in
                publishing or collaborating on Blush Notes.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Badge variant="outline">Floral fun facts</Badge>
                <Badge variant="outline">Flower care</Badge>
                <Badge variant="outline">Zines & magazines</Badge>
                <Badge variant="outline">Themed editions</Badge>
                <Badge variant="outline">Toronto collabs</Badge>
                <Badge variant="outline">Newsletter</Badge>
              </div>
              <div className="pt-4">
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/subscription">
                    <CalendarHeart className="mr-2 h-4 w-4" />
                    Subscribe for floral delivery
                  </Link>
                </Button>
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
