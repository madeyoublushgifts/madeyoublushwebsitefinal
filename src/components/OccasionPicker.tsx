import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createOccasionId,
  occasionTypeOptions,
  type SubscriptionOccasion,
} from "@/data/subscriptionOccasions";
import { getMinDeliveryDate } from "@/data/subscriptionDates";
import { Plus, Trash2 } from "lucide-react";

type OccasionPickerProps = {
  occasions: SubscriptionOccasion[];
  onChange: (occasions: SubscriptionOccasion[]) => void;
  minDate: string;
};

const OccasionPicker = ({ occasions, onChange, minDate }: OccasionPickerProps) => {
  const addOccasion = () => {
    onChange([
      ...occasions,
      {
        id: createOccasionId(),
        type: "birthday",
        label: "",
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Special dates & occasions</p>
          <p className="text-xs text-muted-foreground">
            Birthdays, anniversaries, holidays, or events we can style blooms around.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addOccasion}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {occasions.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border px-4 py-3">
          Optional — add dates you&apos;d like us to remember for gifting.
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
                <Label className="text-xs">Label</Label>
                <Input
                  value={occasion.label}
                  onChange={(e) => updateOccasion(occasion.id, { label: e.target.value })}
                  placeholder="e.g. Mom's birthday"
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  min={minDate}
                  value={occasion.date}
                  onChange={(e) => updateOccasion(occasion.id, { date: e.target.value })}
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
