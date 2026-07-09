import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  clearCheckoutCart,
  formatCad,
  loadCheckoutCart,
  type CheckoutCart,
} from "@/lib/checkoutCart";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CheckoutCart | null>(null);

  useEffect(() => {
    const loaded = loadCheckoutCart();
    if (!loaded) {
      navigate("/shop", { replace: true });
      return;
    }
    setCart(loaded);
  }, [navigate]);

  const handleRemove = () => {
    clearCheckoutCart();
    navigate("/shop", { replace: true });
  };

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 max-w-2xl">
        <div className="text-center space-y-3 mb-10">
          <ShoppingCart className="h-10 w-10 text-primary mx-auto" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Your cart</h1>
          <p className="text-muted-foreground">Review your order before checkout.</p>
        </div>

        <Card className="border-0 shadow-elegant bg-card-gradient mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {cart.source === "build" ? "Custom bouquet" : "Shop bouquet"}
                </p>
                <p className="font-heading text-xl font-semibold">{cart.itemName}</p>
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {cart.itemSummary}
                </p>
              </div>
              <p className="text-xl font-bold text-primary shrink-0">
                {formatCad(cart.amountCents)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link
                  to={cart.source === "build" ? "/create-bouquet" : "/shop"}
                >
                  Edit order
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleRemove}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft mb-8">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <span className="font-medium">Subtotal</span>
            <span className="text-2xl font-bold text-primary">{formatCad(cart.amountCents)}</span>
          </CardContent>
        </Card>

        <Button asChild size="lg" className="w-full">
          <Link to="/checkout">
            Proceed to checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/shop" className="text-primary underline-offset-4 hover:underline">
            ← Continue shopping
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
