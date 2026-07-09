import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BouquetSizePicker from "@/components/BouquetSizePicker";
import {
  getSignatureSizeTier,
  signatureSizeTiers,
} from "@/data/signatureBouquetSizes";
import type { SignatureBouquet } from "@/data/signatureBouquets";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type SignatureBouquetCardProps = {
  bouquet: SignatureBouquet;
  selected?: boolean;
  onSelect: () => void;
  selectedSizeId: string;
  onSizeChange: (sizeId: string) => void;
  /** When true, size picker only appears on the selected card (subscription flow). */
  singleSelectMode?: boolean;
};

const SignatureBouquetCard = ({
  bouquet,
  selected = false,
  onSelect,
  selectedSizeId,
  onSizeChange,
  singleSelectMode = false,
}: SignatureBouquetCardProps) => {
  const sizeTier = getSignatureSizeTier(selectedSizeId);
  const fromPrice = signatureSizeTiers[0]?.priceLabel ?? bouquet.price;
  const priceLabel = selected && sizeTier ? sizeTier.priceLabel : `From ${fromPrice}`;

  const handleSizeChange = (sizeId: string) => {
    onSizeChange(sizeId);
    if (singleSelectMode && !selected) {
      onSelect();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group cursor-pointer border-2 rounded-2xl overflow-hidden transition-all duration-200",
        selected
          ? "border-primary bg-primary/5 shadow-elegant ring-2 ring-primary/30"
          : "border-transparent shadow-soft bg-card-gradient opacity-95 hover:opacity-100 hover:shadow-elegant"
      )}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary/5 to-accent/5">
          <img
            src={bouquet.image}
            alt={bouquet.name}
            width={400}
            height={400}
            className="w-full h-full object-cover sm:group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              {priceLabel}
            </Badge>
            {selected ? (
              <Badge className="bg-primary text-primary-foreground gap-1">
                <Check className="h-3 w-3" />
                Selected
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <h3
              className={cn(
                "font-heading text-lg sm:text-xl font-semibold mb-2 transition-colors",
                selected ? "text-primary" : "group-hover:text-primary"
              )}
            >
              {bouquet.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{bouquet.description}</p>
          </div>

          {singleSelectMode && !selected ? (
            <p className="text-xs text-muted-foreground">Tap to select, then choose a size.</p>
          ) : (
            <BouquetSizePicker value={selectedSizeId} onChange={handleSizeChange} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureBouquetCard;
