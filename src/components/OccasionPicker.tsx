import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createOccasionId,
  occasionTypeOptions,
  type OccasionType,
  type SubscriptionOccasion,
} from "@/data/subscriptionOccasions";
import { Plus, Trash2 } from "lucide-react";

type OccasionPickerProps = {
  occasions: SubscriptionOccasion[];
  onChange: (occasions: SubscriptionOccasion[]) => void;
  minDate: string;
  /** When true, empty state encourages adding at least one date. */
  required?: boolean;
  title?: string;
  description?: string;
};

const OccasionPicker = ({
  occasions,
  onChange,
  minDate,
  required = false,
  title = "Special dates & occasions",
  description = "Valentine’s, Mother’s Day, birthdays, anniversaries, holidays, or a custom date.",
}: OccasionPickerProps) => {
  const addOccasion = (type: OccasionType = "birthday") => {
    onChange([
      ...occasions,
      {
        id: createOccasionId(),
        type,
        label: type === "custom" ? "" : "",
        date: minDate,
      },
    ]);
  };

  const updateOccasion = (id: string, patch: Partial<SubscriptionOccasion>) => {
    onChange(occasions.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const removeOccasion = (id: string) => {
    onChange(occasions.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {title}
            {required ? " *" : ""}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => addOccasion("birthday")}>
            <Plus className="h-4 w-4 mr-1" />
            Add date
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => addOccasion("custom")}>
            <Plus className="h-4 w-4 mr-1" />
            Add custom
          </Button>
        </div>
      </div>

      {occasions.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border px-4 py-3">
          {required
            ? "Add at least one special date or occasion."
            : "Optional — add dates you’d like us to remember for gifting."}
        </p>
      ) : (
        <div className="space-y-3">
          {occasions.map((occasion) => (
            <div
              key={occasion.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-xl border border-border bg-background/80 p-3"
            >
              <div className="sm:col-span-3 space-y-1">
                <Label className="text-xs">Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={occasion.type}
                  onChange={(e) =>
                    updateOccasion(occasion.id, {
                      type: e.target.value as SubscriptionOccasion["type"],
                    })
                  }
                >
                  {occasionTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-4 space-y-1">
                <Label className="text-xs">
                  {occasion.type === "custom" ? "Custom text *" : "Label"}
                </Label>
                <Input
                  value={occasion.label}
                  onChange={(e) => updateOccasion(occasion.id, { label: e.target.value })}
                  placeholder={
                    occasion.type === "custom"
                      ? "Describe the occasion…"
                      : "e.g. Mom’s birthday"
                  }
                  required={occasion.type === "custom"}
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <Label className="text-xs">Chosen date *</Label>
                <Input
                  type="date"
                  min={minDate}
                  value={occasion.date}
                  onChange={(e) => updateOccasion(occasion.id, { date: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove occasion"
                  onClick={() => removeOccasion(occasion.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OccasionPicker;
