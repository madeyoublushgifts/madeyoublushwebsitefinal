import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";

const CheckoutCancel = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 lg:px-8 py-20 max-w-xl text-center space-y-6">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold">Checkout cancelled</h1>
      <p className="text-muted-foreground leading-relaxed">
        No worries — your card was not charged. You can return to the shop or build a custom bouquet
        anytime.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link to="/shop">Back to shop</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/create-bouquet">Build a bouquet</Link>
        </Button>
      </div>
    </main>
    <Footer />
  </div>
);

export default CheckoutCancel;
