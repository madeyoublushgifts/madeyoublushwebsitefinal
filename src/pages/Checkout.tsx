import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCad,
  getCartTotal,
  loadCartItems,
  type CartItem,
} from "@/lib/checkoutCart";
import { getOrderTotals, HANDLING_FEE_LABEL } from "@/lib/orderFees";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import { redirectToOrderCheckout } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Loader2, ShoppingBag } from "lucide-react";
import PageLoading from "@/components/PageLoading";

const minDeliveryDate = getMinDeliveryDate();

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadCartItems();
    if (loaded.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }
    setItems(loaded);
    setIsLoading(false);
  }, [navigate]);

  const subtotal = getCartTotal(items);
  const { handlingFeeCents, totalCents } = getOrderTotals(subtotal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

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
        items: items.map((item) => ({
          itemName: item.itemName,
          itemSummary: item.itemSummary,
          amountCents: item.amountCents,
          source: item.source,
        })),
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

  if (isLoading || items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PageLoading />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl overflow-x-hidden pb-24 lg:pb-16">
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Enter delivery details and pay securely with Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="font-heading text-xl">Delivery details</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
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
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="border-0 shadow-elegant bg-card-gradient lg:sticky lg:top-28">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="font-heading text-xl">Order summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6 space-y-4">
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium leading-snug">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {item.source === "build" ? "Custom bouquet" : "Shop bouquet"}
                          </p>
                        </div>
                        <p className="font-semibold text-primary shrink-0">
                          {formatCad(item.amountCents)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {item.itemSummary}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCad(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">{HANDLING_FEE_LABEL}</span>
                    <span className="font-medium">{formatCad(handlingFeeCents)}</span>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">{formatCad(totalCents)}</span>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full min-h-12 hidden lg:inline-flex"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" />
                      <span className="truncate">Redirecting to Stripe…</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5 shrink-0" />
                      <span className="truncate">
                        Pay with Stripe · {formatCad(totalCents)}
                      </span>
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground hidden lg:block">
                  Secure payment by Stripe · CAD
                </p>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  <Link to="/cart" className="text-primary underline-offset-4 hover:underline">
                    ← Edit cart
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:hidden sticky bottom-0 z-20 -mx-4 px-4 py-3 mt-6 border-t border-border bg-background/95 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full min-h-12"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" />
                <span className="truncate">Redirecting…</span>
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5 shrink-0" />
                <span className="truncate">Pay {formatCad(totalCents)}</span>
              </>
            )}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
