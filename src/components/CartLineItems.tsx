import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCad, type CartItem } from "@/lib/checkoutCart";
import { Trash2 } from "lucide-react";

type CartLineItemsProps = {
  items: CartItem[];
  onRemove: (id: string) => void;
  compact?: boolean;
};

const CartLineItems = ({ items, onRemove, compact = false }: CartLineItemsProps) => {
  if (items.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium leading-snug">{item.itemName}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {item.source === "build" ? "Custom bouquet" : "Shop bouquet"}
                </p>
              </div>
              <p className="font-semibold text-primary shrink-0">{formatCad(item.amountCents)}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {item.itemSummary}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-destructive -ml-2"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
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
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CartLineItems;
