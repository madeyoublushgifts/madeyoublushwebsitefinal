/** Handling fee: 3% of subtotal + $0.30 CAD */
export const HANDLING_FEE_PERCENT = 0.03;
export const HANDLING_FEE_FIXED_CENTS = 30;

/** Customer-facing label (formula kept internal via HANDLING_FEE_PERCENT / HANDLING_FEE_FIXED_CENTS). */
export const HANDLING_FEE_LABEL = "Handling fee";

export function calculateHandlingFeeCents(subtotalCents: number): number {
  return Math.round(subtotalCents * HANDLING_FEE_PERCENT) + HANDLING_FEE_FIXED_CENTS;
}

export function getOrderTotals(subtotalCents: number): {
  subtotalCents: number;
  handlingFeeCents: number;
  totalCents: number;
} {
  const handlingFeeCents = calculateHandlingFeeCents(subtotalCents);
  return {
    subtotalCents,
    handlingFeeCents,
    totalCents: subtotalCents + handlingFeeCents,
  };
}
