import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import CartLineItems from "@/components/CartLineItems";
import CartOrderSummary from "@/components/CartOrderSummary";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatCad } from "@/lib/checkoutCart";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import { redirectToOrderCheckout } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Flower, Loader2, ShoppingBag, ShoppingCart } from "lucide-react";

const minDeliveryDate = getMinDeliveryDate();

const Cart = () => {
  const location = useLocation();
  const { items, count, subtotalCents, handlingFeeCents, totalCents, isEmpty, removeItem } =
    useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCheckoutRoute = location.pathname === "/checkout";

  useEffect(() => {
    if (!isCheckoutRoute || isEmpty) return;
    const el = document.getElementById("delivery");
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [isCheckoutRoute, isEmpty, count]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;

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
          tierId: item.tierId,
          buildPricing: item.buildPricing,
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Keep noindex — AppSeo also sets this; page Seo must not re-enable indexing */}
      <Seo path={isCheckoutRoute ? "/checkout" : "/cart"} noindex />
      <Header />

      <main className="container mx-auto px-4 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-5xl overflow-x-hidden pb-28 lg:pb-16">
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          {isEmpty ? (
            <ShoppingCart className="h-10 w-10 text-primary mx-auto" />
          ) : (
            <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
          )}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            {isEmpty ? "Your cart is empty" : "Cart & checkout"}
          </h1>
          <p className="text-muted-foreground">
            {isEmpty
              ? "Add bouquets from the shop or build your own to get started."
              : `${count} ${count === 1 ? "item" : "items"} · Review your order and complete checkout below.`}
          </p>
        </div>

        {isEmpty ? (
          <Card className="border-0 shadow-soft max-w-lg mx-auto">
            <CardContent className="p-8 text-center space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your cart saves while you browse. Add shop bouquets or a custom build, then return
                here anytime to check out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="min-h-11">
                  <Link to="/shop">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Browse shop
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-11">
                  <Link to="/create-bouquet">
                    <Flower className="mr-2 h-5 w-5" />
                    Build a bouquet
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-3 space-y-6 order-1">
              <section aria-labelledby="cart-items-heading">
                <h2 id="cart-items-heading" className="font-heading text-xl font-semibold mb-4">
                  Your items
                </h2>
                <CartLineItems items={items} onRemove={removeItem} />
              </section>

              <section id="delivery" className="scroll-mt-24">
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
              </section>
            </div>

            <div className="lg:col-span-2 order-2 lg:order-2">
              <Card className="border-0 shadow-elegant bg-card-gradient lg:sticky lg:top-28">
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <CardTitle className="font-heading text-xl">Order summary</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Updates as you edit your cart
                  </p>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6 space-y-4">
                  <div className="hidden lg:block">
                    <CartLineItems items={items} onRemove={removeItem} compact />
                  </div>

                  <div className="border-t border-border pt-4">
                    <CartOrderSummary
                      itemCount={count}
                      subtotalCents={subtotalCents}
                      handlingFeeCents={handlingFeeCents}
                      totalCents={totalCents}
                      size="large"
                    />
                  </div>

                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting || isEmpty}
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
                        <span className="truncate">Pay with Stripe</span>
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground hidden lg:block">
                    Secure payment by Stripe · CAD
                  </p>

                  <p className="text-center text-sm text-muted-foreground pt-2">
                    <Link to="/shop" className="text-primary underline-offset-4 hover:underline">
                      ← Continue shopping
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!isEmpty && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-3 mb-2 text-sm">
              <span className="text-muted-foreground">{count} items</span>
              <span className="font-bold text-primary">{formatCad(totalCents)}</span>
            </div>
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
