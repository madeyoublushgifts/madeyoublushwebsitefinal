import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import LiveEventsCalendar from "@/components/LiveEventsCalendar";
import PastEventsList from "@/components/PastEventsList";
import ContactInquiryForm from "@/components/ContactInquiryForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pastEvents, upcomingEvents } from "@/data/upcomingEvents";
import { instagram, tiktok } from "@/lib/social";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const PopUps = () => {
  return (
    <motion.div
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="overflow-x-hidden">
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-primary/10 via-background to-background">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0.6px, transparent 0.7px), radial-gradient(circle at 80% 60%, hsl(var(--primary)) 0.6px, transparent 0.7px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />
          <motion.div
            className="container relative mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6"
            {...fadeUp}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Markets & pop-ups
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find Made You Blush
              <span className="text-primary block">around Toronto</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We pop up at markets, theatres, and neighbourhood spots across the GTA—hand-tied
              bouquets, gift sets, and in-person blush moments. Check upcoming dates, then scroll for
              polaroids from past markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <a href="#upcoming">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Upcoming dates
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <a href="#past-popups">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Past pop-ups
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section id="upcoming" className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-floral scroll-mt-24">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-8" {...fadeUp}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center gap-2 text-primary">
                <MapPin className="h-7 w-7" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                  Where to find us next
                </h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dates and neighbourhoods land first on{" "}
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Instagram {instagram.handle}
                </a>{" "}
                and{" "}
                <a
                  href={tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  TikTok {tiktok.handle}
                </a>
                . Want to collab?{" "}
                <a
                  href="#inquire"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Collab with us!
                </a>
                .
              </p>
            </div>

            <LiveEventsCalendar
              events={upcomingEvents}
              emptyMessage={
                <p className="font-heading text-xl sm:text-2xl font-semibold text-foreground leading-relaxed max-w-xl mx-auto">
                  Stay tuned—new markets, vendor spots, and pop-up shops are announced seasonally.{" "}
                  <span className="text-primary">&lt;3</span>
                </p>
              }
            />
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section id="past-popups" className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background scroll-mt-24">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-10" {...fadeUp}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">Past pop-ups</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A little scrapbook of where we&apos;ve been—booths, blooms, and the people who made
                each market feel like a celebration.
              </p>
            </div>

            <PastEventsList
              events={pastEvents}
              title="Market scrapbook"
              subtitle="Polaroids from recent Made You Blush pop-ups"
              variant="gallery"
            />

            <div className="text-center pt-4">
              <Button asChild size="lg" className="rounded-full min-h-12">
                <a href="#inquire">Collab with us!</a>
              </Button>
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:py-10" />

        <section
          id="inquire"
          className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-gradient-to-b from-primary/5 via-background to-background scroll-mt-24"
        >
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-xl space-y-8" {...fadeUp}>
            <div className="text-center space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Collab with us!
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Markets, theatres, studios, brand collabs—tell us the date, neighbourhood, and vibe.
                We&apos;ll reply with availability.
              </p>
            </div>

            <ContactInquiryForm
              source="Pop-ups page"
              defaultSubject="Pop-up inquiry"
              interestLabel="Market or venue"
              interestPlaceholder="Market name, venue, or neighbourhood"
              messagePlaceholder="Dates, foot traffic vibe, booth size, and anything else we should know…"
              submitLabel="Send pop-up inquiry"
              idPrefix="popup-inquire"
            />
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default PopUps;
