import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCad,
  getCartTotal,
  loadCartItems,
  removeCartItem,
  type CartItem,
} from "@/lib/checkoutCart";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import PageLoading from "@/components/PageLoading";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadCartItems();
    if (loaded.length === 0) {
      navigate("/shop", { replace: true });
      return;
    }
    setItems(loaded);
    setIsLoading(false);
  }, [navigate]);

  const handleRemove = (id: string) => {
    const next = removeCartItem(id);
    if (next.length === 0) {
      navigate("/shop", { replace: true });
      return;
    }
    setItems(next);
  };

  const subtotal = getCartTotal(items);

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
      <main className="container mx-auto px-4 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-2xl overflow-x-hidden">
        <div className="text-center space-y-3 mb-10">
          <ShoppingCart className="h-10 w-10 text-primary mx-auto" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Your cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} · Review before checkout.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <Card key={item.id} className="border-0 shadow-elegant bg-card-gradient">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="space-y-1 min-w-0 w-full">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">
                      {item.source === "build" ? "Custom bouquet" : "Shop bouquet"}
                    </p>
                    <p className="font-heading text-lg sm:text-xl font-semibold">{item.itemName}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {item.itemSummary}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary shrink-0 self-end sm:self-auto">
                    {formatCad(item.amountCents)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild variant="outline" className="flex-1 min-h-11">
                    <Link to={item.source === "build" ? "/create-bouquet" : "/shop"}>
                      {item.source === "build" ? "Build another" : "Back to shop"}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-11 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-soft mb-8">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="font-medium">Subtotal ({items.length} items)</span>
            <span className="text-2xl font-bold text-primary">{formatCad(subtotal)}</span>
          </CardContent>
        </Card>

        <Button asChild size="lg" className="w-full min-h-12">
          <Link to="/checkout" className="inline-flex items-center justify-center">
            Proceed to checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          A handling fee is added at checkout.
          <br />
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
