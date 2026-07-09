import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SignatureBouquet } from "@/data/signatureBouquets";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type SignatureBouquetCardProps = {
  bouquet: SignatureBouquet;
  selected?: boolean;
  onSelect: () => void;
};

const SignatureBouquetCard = ({ bouquet, selected = false, onSelect }: SignatureBouquetCardProps) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group cursor-pointer border-0 shadow-soft bg-card-gradient rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-elegant",
        selected && "ring-2 ring-primary shadow-elegant"
      )}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary/5 to-accent/5">
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
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {bouquet.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{bouquet.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureBouquetCard;
