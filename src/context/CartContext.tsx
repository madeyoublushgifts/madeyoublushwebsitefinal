import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  clearCheckoutCart,
  getCartTotal,
  loadCartItems,
  removeCartItem,
  subscribeToCartUpdates,
  type CartItem,
} from "@/lib/checkoutCart";
import { getOrderTotals } from "@/lib/orderFees";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  handlingFeeCents: number;
  totalCents: number;
  isEmpty: boolean;
  addItem: (item: Omit<CartItem, "id">) => CartItem[];
  removeItem: (id: string) => CartItem[];
  clearCart: () => void;
  refresh: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartItems());

  const refresh = useCallback(() => {
    setItems(loadCartItems());
  }, []);

  useEffect(() => subscribeToCartUpdates(refresh), [refresh]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const next = addCartItem(item);
    setItems(next);
    return next;
  }, []);

  const removeItem = useCallback((id: string) => {
    const next = removeCartItem(id);
    setItems(next);
    return next;
  }, []);

  const clearCart = useCallback(() => {
    clearCheckoutCart();
    setItems([]);
  }, []);

  const subtotalCents = getCartTotal(items);
  const { handlingFeeCents, totalCents } = getOrderTotals(subtotalCents);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      subtotalCents,
      handlingFeeCents,
      totalCents,
      isEmpty: items.length === 0,
      addItem,
      removeItem,
      clearCart,
      refresh,
    }),
    [
      items,
      subtotalCents,
      handlingFeeCents,
      totalCents,
      addItem,
      removeItem,
      clearCart,
      refresh,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
