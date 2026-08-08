import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import EarlyAccessGiveawayForm from "@/components/EarlyAccessGiveawayForm";
import { Badge } from "@/components/ui/badge";
import {
  getEarlyAccessGiveaway,
  type EarlyAccessGiveawayId,
} from "@/data/earlyAccessGiveaways";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" as const },
  viewport: { once: true, amount: 0.2 },
};

type EarlyAccessGiveawayProps = {
  giveawayId: EarlyAccessGiveawayId;
};

/** Unlisted early-access giveaway — share the URL privately; not in site nav. */
const EarlyAccessGiveaway = ({ giveawayId }: EarlyAccessGiveawayProps) => {
  const giveaway = getEarlyAccessGiveaway(giveawayId);

  return (
    <motion.div
      className="min-h-screen bg-background overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="overflow-x-hidden">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/10 via-background to-background">
          <motion.div
            className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6"
            {...fadeUp}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1">
              <Gift className="mr-1.5 h-3.5 w-3.5 inline" />
              {giveaway.heroEyebrow}
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {giveaway.heroTitle}
              <span className="text-primary block">{giveaway.heroAccent}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {giveaway.heroBody}
            </p>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section id="claim" className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-floral scroll-mt-24">
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-3xl" {...fadeUp}>
            <EarlyAccessGiveawayForm giveawayId={giveawayId} />
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default EarlyAccessGiveaway;
