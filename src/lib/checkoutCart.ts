export type CheckoutSource = "shop" | "build";

/** Server re-prices custom builds from this payload (never trust client cents alone). */
export type BuildPricingPayload = {
  stems: Record<string, number>;
  materialIds: string[];
};

export type CartItem = {
  id: string;
  source: CheckoutSource;
  itemName: string;
  itemSummary: string;
  amountCents: number;
  /** Tier id when ordering a preset shop bouquet */
  tierId?: string;
  paletteNotes?: string;
  /** Stem/material breakdown for custom builds */
  buildPricing?: BuildPricingPayload;
};

const STORAGE_KEY = "myb-checkout-cart";
const CART_UPDATED_EVENT = "myb-cart-updated";

function notifyCartUpdated(): void {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function isLegacyCart(value: unknown): value is Omit<CartItem, "id"> {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.itemName === "string" &&
    typeof obj.amountCents === "number" &&
    !Array.isArray(value)
  );
}

function migrateStoredCart(raw: unknown): CartItem[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is CartItem =>
        !!item &&
        typeof item === "object" &&
        typeof (item as CartItem).id === "string" &&
        typeof (item as CartItem).itemName === "string" &&
        typeof (item as CartItem).amountCents === "number"
    );
  }
  if (isLegacyCart(raw)) {
    return [{ ...raw, id: generateCartItemId() }];
  }
  return [];
}

export function generateCartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadCartItems(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const items = migrateStoredCart(parsed);
    if (!Array.isArray(parsed) && items.length > 0) {
      saveCartItems(items);
    }
    return items;
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (items.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  notifyCartUpdated();
}

export function addCartItem(item: Omit<CartItem, "id">): CartItem[] {
  const next: CartItem = { ...item, id: generateCartItemId() };
  const items = [...loadCartItems(), next];
  saveCartItems(items);
  return items;
}

export function removeCartItem(id: string): CartItem[] {
  const items = loadCartItems().filter((item) => item.id !== id);
  saveCartItems(items);
  return items;
}

export function clearCheckoutCart(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  notifyCartUpdated();
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.amountCents, 0);
}

export function getCartItemCount(items?: CartItem[]): number {
  const list = items ?? loadCartItems();
  return list.length;
}

export function formatCad(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function subscribeToCartUpdates(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(CART_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/** @deprecated Use loadCartItems */
export function loadCheckoutCart(): CartItem | null {
  const items = loadCartItems();
  return items[0] ?? null;
}

/** @deprecated Use addCartItem */
export function saveCheckoutCart(cart: Omit<CartItem, "id">): void {
  saveCartItems([{ ...cart, id: generateCartItemId() }]);
}
