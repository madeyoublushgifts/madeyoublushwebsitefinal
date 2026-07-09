import { useCart } from "@/context/CartContext";

export function useCartCount(): number {
  return useCart().count;
}
