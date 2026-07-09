export type CheckoutSource = "shop" | "build";

export type CheckoutCart = {
  source: CheckoutSource;
  itemName: string;
  itemSummary: string;
  amountCents: number;
  /** Tier id when ordering a preset shop bouquet */
  tierId?: string;
  paletteNotes?: string;
};

const STORAGE_KEY = "myb-checkout-cart";

export function saveCheckoutCart(cart: CheckoutCart): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function loadCheckoutCart(): CheckoutCart | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutCart;
  } catch {
    return null;
  }
}

export function clearCheckoutCart(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function formatCad(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
