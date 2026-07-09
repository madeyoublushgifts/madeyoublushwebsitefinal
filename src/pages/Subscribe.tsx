import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import SubscriptionCheckoutForm from "@/components/SubscriptionCheckoutForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { CreditCard, Gift, Heart, ShoppingCart, Truck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const annualPlan = subscriptionPlans.find((p) => p.id === "annual");

const Subscribe = () => {
  return (
    <motion.div
      className="min-h-screen bg-background"
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
              Floral subscription
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

        <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-background">
          <motion.div className="container mx-auto px-4 lg:px-8" {...fadeUp}>
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              {...fadeUp}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                How it works
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

        <section
          id="subscribe"
          className="pt-8 lg:pt-10 pb-16 lg:pb-24 bg-gradient-to-b from-primary/5 to-background scroll-mt-20"
        >
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
      </main>

      <Footer />
    </motion.div>
  );
};

export default Subscribe;
