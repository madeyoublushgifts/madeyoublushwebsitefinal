import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BouquetPalettePicker from "@/components/BouquetPalettePicker";
import type { ShopBouquet } from "@/data/shopBouquets";
import type { TierPaletteSelection } from "@/data/bouquetTierColors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

type ShopBouquetCardProps = {
  bouquet: ShopBouquet;
  palette: TierPaletteSelection;
  onPaletteChange: (next: TierPaletteSelection) => void;
  selected?: boolean;
  onSelect?: () => void;
  footer?: ReactNode;
  className?: string;
};

const ShopBouquetCard = ({
  bouquet,
  palette,
  onPaletteChange,
  selected = false,
  onSelect,
  footer,
  className,
}: ShopBouquetCardProps) => {
  return (
    <Card
      className={cn(
        "group border-0 shadow-soft bg-card-gradient rounded-2xl overflow-hidden transition-all duration-200",
        selected && "ring-2 ring-primary shadow-elegant",
        onSelect && "cursor-pointer hover:shadow-elegant",
        className
      )}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
          <img
            src={bouquet.image}
            alt={bouquet.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              {bouquet.price}
            </Badge>
            {selected ? (
              <Badge className="bg-primary text-primary-foreground gap-1">
                <Check className="h-3 w-3" />
                Selected
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {bouquet.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{bouquet.description}</p>
          </div>

          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <BouquetPalettePicker
              bouquetId={bouquet.id}
              selection={palette}
              onChange={onPaletteChange}
            />
          </div>

          {footer ? <div onClick={(e) => e.stopPropagation()}>{footer}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopBouquetCard;
