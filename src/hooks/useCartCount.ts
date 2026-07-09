import { useEffect, useState } from "react";
import { getCartItemCount, loadCartItems, subscribeToCartUpdates } from "@/lib/checkoutCart";

export function useCartCount(): number {
  const [count, setCount] = useState(() => getCartItemCount());

  useEffect(() => {
    const refresh = () => setCount(getCartItemCount(loadCartItems()));
    refresh();
    return subscribeToCartUpdates(refresh);
  }, []);

  return count;
}
