import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCad,
  loadCheckoutCart,
  type CheckoutCart,
} from "@/lib/checkoutCart";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import { redirectToOrderCheckout } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Loader2, ShoppingBag } from "lucide-react";

const minDeliveryDate = getMinDeliveryDate();

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CheckoutCart | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = loadCheckoutCart();
    if (!loaded) {
      navigate("/cart", { replace: true });
      return;
    }
    setCart(loaded);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;

    if (!isDeliveryDateValid(deliveryDate)) {
      toast({
        title: "Check delivery date",
        description: "Delivery must be at least one week from today.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await redirectToOrderCheckout({
        name,
        email,
        phone,
        address,
        deliveryDate,
        itemName: cart.itemName,
        itemSummary: cart.itemSummary,
        amountCents: cart.amountCents,
        source: cart.source,
        notes,
      });
    } catch (err) {
      toast({
        title: "Checkout could not start",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email madeyoublushgifts@gmail.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 max-w-2xl">
        <div className="text-center space-y-3 mb-10">
          <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Review your order and continue to secure Stripe payment.
          </p>
        </div>

        <Card className="border-0 shadow-elegant bg-card-gradient mb-8">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {cart.source === "build" ? "Custom bouquet" : "Shop order"}
            </p>
            <p className="font-heading text-xl font-semibold">{cart.itemName}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{cart.itemSummary}</p>
            <p className="text-2xl font-bold text-primary pt-2">{formatCad(cart.amountCents)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="co-name">Full name *</Label>
                  <Input
                    id="co-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-email">Email *</Label>
                  <Input
                    id="co-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="co-phone">Phone (optional)</Label>
                  <Input
                    id="co-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-date">Delivery date *</Label>
                  <Input
                    id="co-date"
                    type="date"
                    min={minDeliveryDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Earliest: {formatDisplayDate(minDeliveryDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="co-address">Delivery address *</Label>
                <Input
                  id="co-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Full GTA address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="co-notes">Order notes (optional)</Label>
                <Textarea
                  id="co-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Gate code, card message, delivery instructions…"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay {formatCad(cart.amountCents)} with Stripe
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment by Stripe · CAD
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/cart" className="text-primary underline-offset-4 hover:underline">
            ← Back to cart
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
