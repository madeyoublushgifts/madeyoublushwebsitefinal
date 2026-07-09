import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const CheckoutSuccess = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 lg:px-8 py-20 max-w-xl text-center space-y-6">
      <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
      <h1 className="font-heading text-3xl sm:text-4xl font-bold">You&apos;re subscribed!</h1>
      <p className="text-muted-foreground leading-relaxed">
        Thank you for joining Made You Blush. We&apos;ll email your receipt and confirm your first
        delivery date, bouquet style, and any special occasions you shared.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button asChild>
          <Link to="/shop">Shop add-ons</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </main>
    <Footer />
  </div>
);

export default CheckoutSuccess;
