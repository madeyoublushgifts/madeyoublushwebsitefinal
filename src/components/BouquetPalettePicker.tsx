import {
  bouquetColorTemplates,
  bouquetStemColors,
  getMaxCustomColorsForTier,
  isSingleStemTier,
  type BouquetStemColor,
  type BouquetTierColorMode,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { cn } from "@/lib/utils";

type BouquetPalettePickerProps = {
  bouquetId: number;
  selection: TierPaletteSelection;
  onChange: (next: TierPaletteSelection) => void;
};

const BouquetPalettePicker = ({ bouquetId, selection, onChange }: BouquetPalettePickerProps) => {
  const pickerOnly = isSingleStemTier(bouquetId);
  const maxCustomColors = getMaxCustomColorsForTier(bouquetId);

  const setMode = (mode: BouquetTierColorMode) => {
    onChange({
      mode,
      templateId: mode === "template" ? selection.templateId : null,
      customColors: mode === "custom" ? selection.customColors : [],
    });
  };

  const selectTemplate = (templateId: string) => {
    onChange({ mode: "template", templateId, customColors: [] });
  };

  const toggleCustomColor = (colorId: BouquetStemColor) => {
    const current = selection.customColors;
    if (current.includes(colorId)) {
      onChange({
        mode: "custom",
        templateId: null,
        customColors: current.filter((c) => c !== colorId),
      });
      return;
    }
    if (maxCustomColors === 1) {
      onChange({
        mode: "custom",
        templateId: null,
        customColors: [colorId],
      });
      return;
    }
    if (current.length >= maxCustomColors) return;
    onChange({
      mode: "custom",
      templateId: null,
      customColors: [...current, colorId],
    });
  };

  const colorPicker = (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground text-center">
        {pickerOnly
          ? "Pick one colour for your stem"
          : `Pick up to ${maxCustomColors} colours`}
      </p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {bouquetStemColors.map((color) => {
          const active = selection.customColors.includes(color.id);
          const atMax = !active && selection.customColors.length >= maxCustomColors;
          return (
            <button
              key={color.id}
              type="button"
              title={color.name}
              aria-label={color.name}
              aria-pressed={active}
              disabled={atMax}
              onClick={() => toggleCustomColor(color.id)}
            className={cn(
                    "h-7 w-7 rounded-full border-2 transition-all duration-200 shrink-0 active:scale-90",
                    active
                      ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                      : "border-border hover:border-primary hover:scale-105",
                    atMax && "opacity-40 cursor-not-allowed"
                  )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );

  if (pickerOnly) {
    return (
      <div className="space-y-3 pt-1 border-t border-border/50">
        <p className="text-xs font-medium text-muted-foreground">Stem colour</p>
        {colorPicker}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-1 border-t border-border/50">
      <p className="text-xs font-medium text-muted-foreground">Palette</p>

      <div className="flex rounded-full border border-border p-0.5 bg-muted/40">
        <button
          type="button"
          onClick={() => setMode("template")}
          className={cn(
            "flex-1 text-xs py-1.5 rounded-full transition-all duration-200 active:scale-[0.97]",
            selection.mode === "template"
              ? "bg-primary text-primary-foreground shadow-sm font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          )}
        >
          Colour template
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={cn(
            "flex-1 text-xs py-1.5 rounded-full transition-all duration-200 active:scale-[0.97]",
            selection.mode === "custom"
              ? "bg-primary text-primary-foreground shadow-sm font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          )}
        >
          Colour picker
        </button>
      </div>

      {selection.mode === "template" ? (
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-0.5">
          {bouquetColorTemplates.map((template) => {
            const active = selection.templateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => selectTemplate(template.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex -space-x-1 shrink-0">
                  {template.colors.map((colorId) => {
                    const color = bouquetStemColors.find((c) => c.id === colorId);
                    if (!color) return null;
                    return (
                      <span
                        key={colorId}
                        className="h-5 w-5 rounded-full border-2 border-background"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
                <span className="min-w-0">
                  <span className="block text-xs font-medium leading-tight">{template.name}</span>
                  <span className="block text-[10px] text-muted-foreground leading-tight truncate">
                    {template.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        colorPicker
      )}
    </div>
  );
};

export default BouquetPalettePicker;
