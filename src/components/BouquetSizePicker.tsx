import { signatureSizeTiers } from "@/data/signatureBouquetSizes";
import { cn } from "@/lib/utils";

type BouquetSizePickerProps = {
  value: string;
  onChange: (tierId: string) => void;
  className?: string;
};

const BouquetSizePicker = ({ value, onChange, className }: BouquetSizePickerProps) => {
  return (
    <div className={cn("space-y-2", className)} onClick={(e) => e.stopPropagation()}>
      <p className="text-xs font-medium text-muted-foreground">Size</p>
      <div className="grid grid-cols-2 gap-1.5">
        {signatureSizeTiers.map((tier) => {
          const selected = value === tier.id;
          const shortName = tier.name.replace(" Bouquet", "");
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onChange(tier.id)}
              className={cn(
                "rounded-lg border px-2 py-2 text-left text-xs transition-all",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/40"
              )}
            >
              <span className="font-medium block leading-tight">{shortName}</span>
              <span className="text-primary text-[10px] font-semibold">{tier.priceLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BouquetSizePicker;
