import { formatCad } from "@/lib/checkoutCart";
import { HANDLING_FEE_LABEL } from "@/lib/orderFees";

type CartOrderSummaryProps = {
  itemCount: number;
  subtotalCents: number;
  handlingFeeCents: number;
  totalCents: number;
  size?: "default" | "large";
};

const CartOrderSummary = ({
  itemCount,
  subtotalCents,
  handlingFeeCents,
  totalCents,
  size = "default",
}: CartOrderSummaryProps) => {
  const totalClass =
    size === "large" ? "text-xl sm:text-2xl font-bold text-primary" : "text-lg font-bold text-primary";

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
        <span className="font-medium">{formatCad(subtotalCents)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground shrink-0">{HANDLING_FEE_LABEL}</span>
        <span className="font-medium">{formatCad(handlingFeeCents)}</span>
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between gap-4">
        <span className="font-medium">Total</span>
        <span className={totalClass}>{formatCad(totalCents)}</span>
      </div>
    </div>
  );
};

export default CartOrderSummary;
