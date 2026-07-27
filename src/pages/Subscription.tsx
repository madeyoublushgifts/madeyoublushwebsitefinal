import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import SubscriptionWaitlistForm from "@/components/SubscriptionWaitlistForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BellRing, Gift, Heart, ShoppingCart, Truck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const Subscription = () => {
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
              Floral subscription
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Toronto Floral Subscription
              <span className="text-primary block">Gifting as a habit, not a luxury</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join the waitlist for affordable floral delivery across Toronto. Choose your cadence,
              bouquet tier or custom build, and the dates that matter most. Pricing follows the tier
              or build you select.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <a href="#waitlist">
                  <BellRing className="mr-2 h-5 w-5" />
                  Join the waitlist
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full min-h-12 w-full sm:w-auto">
                <Link to="/shop">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop bouquets now
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8" {...fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Heart,
                  title: "Personal",
                  text: "Shop tiers or a custom build—styled in-house with seasonal stems.",
                },
                {
                  icon: Truck,
                  title: "Convenient",
                  text: "Recurring delivery to home, work, or a surprise doorstep.",
                },
                {
                  icon: Gift,
                  title: "Flexible pricing",
                  text: "Your subscription price follows the bouquet tier or custom build you choose.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-0 shadow-soft bg-card-gradient">
                  <CardContent className="p-6 space-y-3 text-center">
                    <item.icon className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        <FloralDivider className="py-8 lg:pt-10" />

        <section
          id="waitlist"
          className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-gradient-to-b from-primary/5 to-background scroll-mt-20"
        >
          <motion.div className="container mx-auto px-4 lg:px-8 max-w-6xl" {...fadeUp}>
            <div className="text-center space-y-4 mb-10">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Recurring delivery subscription waitlist
              </h2>
              <p className="text-muted-foreground">
                Choose recurring delivery or special dates & occasions only. Tell us your cadence,
                bouquet preference, and the dates that matter. No payment today—we&apos;ll email you
                when memberships open.
              </p>
            </div>
            <SubscriptionWaitlistForm />
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Subscription;
