import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, ChevronRight, ChevronLeft, ShoppingCart } from "lucide-react";
import { saveCheckoutCart } from "@/lib/checkoutCart";
import { saveSubscriptionBuildDraft } from "@/lib/subscriptionBuildDraft";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildBouquetStems,
  bouquetStemColors,
  stemCategoryLabels,
  formatStemPrice,
  formatStemColorSummary,
  stemSupportsColor,
  type BouquetStemColor,
  type StemCategory,
  type StemOption,
} from "@/data/buildBouquetStems";
import {
  materialGroupLabels,
  materialsByGroup,
  findMaterial,
  formatMaterialPrice,
  materialSupportsColor,
  type MaterialGroup,
  type BouquetMaterialOption,
} from "@/data/buildBouquetMaterials";

const STEM_CATEGORIES: StemCategory[] = ["main", "filler", "greenery"];
const MATERIAL_GROUPS: MaterialGroup[] = ["wrapping", "ribbon", "addon"];

const findStem = (id: string) => buildBouquetStems.find((s) => s.id === id);

const formatMoney = (amount: number) =>
  amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);

type StemColorSelection = (BouquetStemColor | null)[];

type CreateBouquetProps = {
  mode?: "order" | "subscription";
};

const CreateBouquet = ({ mode = "order" }: CreateBouquetProps) => {
  const isSubscription = mode === "subscription";
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStems, setSelectedStems] = useState<Record<string, number>>({});
  const [stemColors, setStemColors] = useState<Record<string, StemColorSelection>>({});
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);
  const [selectedRibbon, setSelectedRibbon] = useState<string | null>(null);
  const [wrappingColor, setWrappingColor] = useState<BouquetStemColor | null>(null);
  const [ribbonColor, setRibbonColor] = useState<BouquetStemColor | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  const steps = isSubscription
    ? [
        {
          id: 1,
          title: "Choose Stems",
          description: "Main flowers, fillers, and greenery",
        },
        { id: 2, title: "Choose Materials", description: "Wrapping, ribbon & add-ons" },
        {
          id: 3,
          title: "Review & save",
          description: "Save your build for the subscription waitlist",
        },
      ]
    : [
        {
          id: 1,
          title: "Choose Stems",
          description: "Main flowers, fillers, and greenery",
        },
        { id: 2, title: "Choose Materials", description: "Wrapping, ribbon & add-ons" },
        { id: 3, title: "Review & checkout", description: "Confirm your build and pay securely with Stripe" },
      ];

  const selectWrapping = (id: string) => {
    setSelectedWrapping((prev) => {
      if (prev === id) {
        setWrappingColor(null);
        return null;
      }
      setWrappingColor(null);
      return id;
    });
  };

  const selectRibbon = (id: string) => {
    setSelectedRibbon((prev) => {
      if (prev === id) {
        setRibbonColor(null);
        return null;
      }
      setRibbonColor(null);
      return id;
    });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isMaterialSelected = (item: BouquetMaterialOption) => {
    if (item.group === "wrapping") return selectedWrapping === item.id;
    if (item.group === "ribbon") return selectedRibbon === item.id;
    return Boolean(selectedAddons[item.id]);
  };

  const handleMaterialClick = (item: BouquetMaterialOption) => {
    if (item.group === "wrapping") selectWrapping(item.id);
    else if (item.group === "ribbon") selectRibbon(item.id);
    else toggleAddon(item.id);
  };

  const selectedMaterialEntries = (): BouquetMaterialOption[] => {
    const items: BouquetMaterialOption[] = [];
    if (selectedWrapping) {
      const w = findMaterial(selectedWrapping);
      if (w) items.push(w);
    }
    if (selectedRibbon) {
      const r = findMaterial(selectedRibbon);
      if (r) items.push(r);
    }
    for (const [id, on] of Object.entries(selectedAddons)) {
      if (!on) continue;
      const a = findMaterial(id);
      if (a) items.push(a);
    }
    return items;
  };

  const updateStemQuantity = (stemId: string, change: number) => {
    const stem = findStem(stemId);
    setSelectedStems((prevStems) => {
      const newQuantity = (prevStems[stemId] || 0) + change;
      const nextStems =
        newQuantity <= 0
          ? (() => {
              const { [stemId]: _, ...rest } = prevStems;
              return rest;
            })()
          : { ...prevStems, [stemId]: newQuantity };

      if (stem && stemSupportsColor(stemId, stem.category)) {
        setStemColors((prevColors) => {
          if (newQuantity <= 0) {
            const { [stemId]: _, ...rest } = prevColors;
            return rest;
          }
          const current = prevColors[stemId] ?? [];
          if (change > 0) {
            return {
              ...prevColors,
              [stemId]: [...current, ...Array(change).fill(null)],
            };
          }
          return { ...prevColors, [stemId]: current.slice(0, newQuantity) };
        });
      }

      return nextStems;
    });
  };

  const setStemColorAtIndex = (stemId: string, index: number, color: BouquetStemColor) => {
    setStemColors((prev) => {
      const current = [...(prev[stemId] ?? [])];
      current[index] = color;
      return { ...prev, [stemId]: current };
    });
  };

  const floralStemsNeedingColors = () =>
    Object.entries(selectedStems).filter(([stemId, qty]) => {
      const stem = findStem(stemId);
      return stem && qty > 0 && stemSupportsColor(stemId, stem.category);
    });

  const allFloralColorsChosen = () =>
    floralStemsNeedingColors().every(([stemId, qty]) => {
      const colors = stemColors[stemId] ?? [];
      return colors.length === qty && colors.every((c): c is BouquetStemColor => c !== null);
    });

  const step1Complete =
    Object.keys(selectedStems).length > 0 &&
    (floralStemsNeedingColors().length === 0 || allFloralColorsChosen());

  const stemsNeedingColor = floralStemsNeedingColors();
  const floralColorErrors = stemsNeedingColor
    .map(([stemId, qty]) => {
      const stem = findStem(stemId);
      const colors = stemColors[stemId] ?? [];
      const filledCount = colors.filter((c): c is BouquetStemColor => c !== null).length;
      const missingCount = Math.max(0, qty - filledCount);
      return { stemId, stemName: stem?.name ?? stemId, missingCount };
    })
    .filter((e) => e.missingCount > 0);

  const materialColorComplete = (materialId: string | null, color: BouquetStemColor | null) =>
    !materialId || !materialSupportsColor(materialId) || color !== null;

  const hasMaterialSelection =
    selectedWrapping !== null ||
    selectedRibbon !== null ||
    Object.values(selectedAddons).some(Boolean);

  const step2Complete =
    hasMaterialSelection &&
    materialColorComplete(selectedWrapping, wrappingColor) &&
    materialColorComplete(selectedRibbon, ribbonColor);

  const needsWrapColor =
    selectedWrapping !== null &&
    materialSupportsColor(selectedWrapping) &&
    wrappingColor === null;

  const needsRibbonColor =
    selectedRibbon !== null &&
    materialSupportsColor(selectedRibbon) &&
    ribbonColor === null;

  const getMaterialColorLabel = (item: BouquetMaterialOption) => {
    if (item.group === "wrapping" && selectedWrapping === item.id && wrappingColor) {
      return bouquetStemColors.find((c) => c.id === wrappingColor)?.name;
    }
    if (item.group === "ribbon" && selectedRibbon === item.id && ribbonColor) {
      return bouquetStemColors.find((c) => c.id === ribbonColor)?.name;
    }
    return null;
  };

  const formatMaterialLineLabel = (item: BouquetMaterialOption) => {
    const colorName = getMaterialColorLabel(item);
    return colorName ? `${item.name} (${colorName})` : item.name;
  };

  const calculateTotal = () => {
    const stemTotal = Object.entries(selectedStems).reduce((sum, [stemId, quantity]) => {
      const stem = findStem(stemId);
      return sum + (stem ? stem.price * quantity : 0);
    }, 0);

    const materialTotal = selectedMaterialEntries().reduce((sum, m) => sum + m.price, 0);

    return Math.round((stemTotal + materialTotal) * 100) / 100;
  };

  const formatStemLineLabel = (stemId: string, quantity: number) => {
    const stem = findStem(stemId);
    if (!stem) return "";
    const colors = (stemColors[stemId] ?? []).filter((c): c is BouquetStemColor => c !== null);
    const colorPart =
      stemSupportsColor(stemId, stem.category) && colors.length > 0
        ? ` (${formatStemColorSummary(colors)})`
        : "";
    return `${quantity}x ${stem.name}${colorPart}`;
  };

  const getSelectedItemsText = () => {
    const stemItems = Object.entries(selectedStems)
      .map(([stemId, quantity]) => formatStemLineLabel(stemId, quantity))
      .filter(Boolean);

    const materialItems = selectedMaterialEntries().map((m) => formatMaterialLineLabel(m));

    return [...stemItems, ...materialItems].join(", ");
  };

  const handlePlaceOrder = () => {
    const total = calculateTotal();
    if (Object.keys(selectedStems).length === 0) {
      toast({
        title: "Add stems first",
        description: isSubscription
          ? "Choose at least one stem for your subscription build."
          : "Choose at least one stem before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (total < 1) {
      toast({
        title: "Invalid total",
        description: "Your bouquet total must be at least $1.00.",
        variant: "destructive",
      });
      return;
    }

    if (isSubscription) {
      saveSubscriptionBuildDraft({
        summary: getSelectedItemsText(),
        estimatedTotal: total,
      });
      navigate("/subscription#waitlist");
      return;
    }

    saveCheckoutCart({
      source: "build",
      itemName: "Custom bouquet",
      itemSummary: getSelectedItemsText(),
      amountCents: Math.round(total * 100),
    });
    navigate("/cart");
  };

  const progress = (currentStep / steps.length) * 100;

  const renderImage = (image: string, alt: string) => (
    <img
      src={image}
      alt={alt}
      width={400}
      height={300}
      decoding="async"
      className="w-full h-52 object-contain rounded-md bg-gradient-to-br from-primary/5 to-accent/5"
    />
  );

  const renderColorSwatches = (
    selected: BouquetStemColor | null,
    onSelect: (color: BouquetStemColor) => void,
    ariaPrefix: string
  ) => (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {bouquetStemColors.map((color) => {
        const isActive = selected === color.id;
        return (
          <button
            key={color.id}
            type="button"
            title={color.name}
            aria-label={`${ariaPrefix}: ${color.name}`}
            aria-pressed={isActive}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(color.id);
            }}
            className={`h-7 w-7 rounded-full border-2 transition-all duration-200 shrink-0 active:scale-90 ${
              isActive
                ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                : "border-border hover:border-primary hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
          />
        );
      })}
    </div>
  );

  const renderColorPicker = (stemId: string, index: number, selected: BouquetStemColor | null) => (
    <div key={index} className="flex flex-wrap items-center gap-2 justify-center">
      <span className="text-xs text-muted-foreground w-6 shrink-0">#{index + 1}</span>
      {renderColorSwatches(selected, (c) => setStemColorAtIndex(stemId, index, c), `Stem ${index + 1}`)}
    </div>
  );

  const renderMaterialCard = (item: BouquetMaterialOption) => {
    const selected = isMaterialSelected(item);
    const showColorPicker = selected && materialSupportsColor(item.id);
    const activeColor =
      item.group === "wrapping"
        ? wrappingColor
        : item.group === "ribbon"
          ? ribbonColor
          : null;
    const setActiveColor = (color: BouquetStemColor) => {
      if (item.group === "wrapping") setWrappingColor(color);
      else if (item.group === "ribbon") setRibbonColor(color);
    };

    return (
      <motion.div
        key={item.id}
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 15 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className={`border-2 shadow-md cursor-pointer transition-all h-full ${
            selected ? "border-primary bg-primary/5" : "border-transparent bg-card-gradient"
          }`}
          onClick={() => handleMaterialClick(item)}
        >
          <CardContent className="p-5 sm:p-6 text-center space-y-3">
            {renderImage(item.image, item.name)}
            <h3 className="font-heading text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[2.5rem]">
              {item.description}
            </p>
            <Badge variant="secondary">+{formatMaterialPrice(item.price)}</Badge>
            {showColorPicker && (
              <div
                className="w-full pt-3 border-t border-border/60 space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs font-medium text-center text-muted-foreground">
                  Choose colour
                </p>
                {renderColorSwatches(activeColor, setActiveColor, item.name)}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderMaterialGroup = (group: MaterialGroup) => {
    const items = materialsByGroup(group);
    const { title, subtitle, pickOne } = materialGroupLabels[group];
    return (
      <div key={group} className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-heading text-2xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
          {pickOne && (
            <p className="text-xs text-muted-foreground">Tap again to clear your choice</p>
          )}
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {items.map((item) => renderMaterialCard(item))}
        </motion.div>
      </div>
    );
  };

  const renderStemCard = (stem: StemOption) => {
    const qty = selectedStems[stem.id] || 0;
    const showColors = qty > 0 && stemSupportsColor(stem.id, stem.category);
    const colors = stemColors[stem.id] ?? [];
    const filledCount = colors.filter((c): c is BouquetStemColor => c !== null).length;
    const missingCount = showColors ? Math.max(0, qty - filledCount) : 0;
    const showStemColorError = !step1Complete && showColors && missingCount > 0;

    return (
      <motion.div
        key={stem.id}
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 15 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className={`border-0 shadow-md bg-card-gradient h-full ${
            showStemColorError ? "ring-2 ring-destructive/60" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {renderImage(stem.image, stem.name)}
              <h3 className="font-heading text-xl font-semibold text-center">{stem.name}</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{stem.description}</p>
              <Badge variant="secondary">{formatStemPrice(stem.price)} each</Badge>
              <div className="flex items-center space-x-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStemQuantity(stem.id, -1)}
                  disabled={!qty}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <Button variant="outline" size="sm" onClick={() => updateStemQuantity(stem.id, 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {showColors && (
                <div className="w-full pt-3 border-t border-border/60 space-y-2">
                  <p className="text-xs font-medium text-center text-muted-foreground">
                    Colour per stem
                  </p>
                  {Array.from({ length: qty }, (_, i) =>
                    renderColorPicker(stem.id, i, colors[i] ?? null)
                  )}
                  {showStemColorError && (
                    <p className="text-[11px] text-destructive text-center">
                      Missing {missingCount} colour{missingCount === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="py-20 lg:py-28 bg-hero">
          <motion.div
            className="container mx-auto px-4 lg:px-8 text-center space-y-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h1
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {isSubscription
                ? "Build Your Subscription Bouquet"
                : "Build a Custom Bouquet in Toronto"}
            </motion.h1>
            <motion.p
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {isSubscription
                ? "Design stems, wrap, and add-ons for recurring delivery. This builder is for the subscription waitlist—not one-time shop checkout."
                : "Design your own bouquet online—pick stems, wrapping, ribbon, and add-ons with transparent Toronto florist pricing. We confirm availability and GTA pickup or delivery before anything is cut."}
            </motion.p>
          </motion.div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        <section className="pt-8 lg:pt-10 pb-8 border-b border-border">
          <motion.div
            className="container mx-auto px-4 lg:px-8 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Progress value={progress} className="h-2 mb-6" />
            <motion.div
              className="flex justify-between"
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
              }}
              viewport={{ once: true }}
            >
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`text-center ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted"
                    }`}
                  >
                    {step.id}
                  </div>
                  <h3 className="font-medium text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="pb-24 sm:pb-28">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl pt-8 sm:pt-10">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-16"
                >
                  <div className="text-center mb-4">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                      Choose Your Stems
                    </h2>
                    <p className="text-lg lg:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
                      Per-stem pricing reflects typical Toronto florist wholesale + hand-tied labour. Pick a
                      colour for each flower stem you add—greenery stays natural. Final totals are confirmed
                      when we reply to your inquiry.
                    </p>
                    {!step1Complete && floralColorErrors.length > 0 && (
                      <div
                        role="alert"
                        className="text-sm text-amber-700 dark:text-amber-400 max-w-xl mx-auto bg-amber-50/40 dark:bg-amber-900/20 border border-amber-200/70 dark:border-amber-800/50 rounded-xl px-4 py-3 space-y-1"
                      >
                        <p className="font-medium">
                          Choose a colour for these stems before continuing:
                        </p>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {floralColorErrors.map((e) => (
                            <li key={e.stemId}>
                              {e.stemName} ({e.missingCount} missing)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {STEM_CATEGORIES.map((category) => {
                    const stems = buildBouquetStems.filter((s) => s.category === category);
                    const { title, subtitle } = stemCategoryLabels[category];
                    return (
                      <div key={category} className="space-y-8">
                        <div className="text-center space-y-2">
                          <h3 className="font-heading text-2xl font-semibold">{title}</h3>
                          <p className="text-muted-foreground">{subtitle}</p>
                          <div className="flex justify-center">
                            <div className="w-16 h-1 bg-primary rounded-full" />
                          </div>
                        </div>
                        <motion.div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.1 }}
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
                          }}
                        >
                          {stems.map((stem) => renderStemCard(stem))}
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="text-center mb-10">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                      Choose Materials & Presentation
                    </h2>
                    <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                      Pick at least one wrap, ribbon, or add-on. Wrapping and ribbon are one choice
                      each; add-ons can be combined.
                    </p>
                    {!step2Complete && (
                      <p className="text-sm text-amber-700 dark:text-amber-400 max-w-xl mx-auto">
                        {!hasMaterialSelection
                          ? "Choose at least one wrap, ribbon, or add-on to continue."
                          : needsWrapColor && needsRibbonColor
                            ? "Choose a colour for your selected wrap and ribbon before continuing."
                            : needsWrapColor
                              ? "Choose a colour for your selected wrap before continuing."
                              : "Choose a colour for your ribbon before continuing."}
                      </p>
                    )}
                  </div>

                  <div className="space-y-16">
                    {MATERIAL_GROUPS.map((group) => renderMaterialGroup(group))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                        {isSubscription ? "Review Your Subscription Build" : "Review Your Custom Bouquet"}
                      </h2>
                      <p className="text-lg lg:text-xl text-muted-foreground">
                        {isSubscription
                          ? "Save this build to your subscription waitlist preferences"
                          : "Perfect! Let's finalize your beautiful creation"}
                      </p>
                    </div>
                    <Card className="border-0 shadow-lg bg-card-gradient">
                      <CardHeader>
                        <CardTitle className="text-center text-2xl">Your Custom Bouquet</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {Object.keys(selectedStems).length > 0 && (
                          <>
                            {STEM_CATEGORIES.map((category) => {
                              const entries = Object.entries(selectedStems).filter(([id]) => {
                                const stem = findStem(id);
                                return stem?.category === category;
                              });
                              if (entries.length === 0) return null;
                              return (
                                <div key={category}>
                                  <h4 className="font-semibold mb-3">{stemCategoryLabels[category].title}:</h4>
                                  {entries.map(([id, qty]) => {
                                    const stem = findStem(id);
                                    if (!stem) return null;
                                    const lineTotal = stem.price * qty;
                                    const colorSummary =
                                      stemSupportsColor(id, stem.category) &&
                                      (stemColors[id]?.length ?? 0) > 0
                                        ? formatStemColorSummary(
                                            (stemColors[id] ?? []).filter(
                                              (c): c is BouquetStemColor => c !== null
                                            )
                                          )
                                        : null;
                                    return (
                                      <div key={id} className="flex justify-between items-start gap-4 text-sm">
                                        <span>
                                          {qty}x {stem.name}
                                          {colorSummary && (
                                            <span className="block text-muted-foreground text-xs mt-0.5">
                                              {colorSummary}
                                            </span>
                                          )}
                                        </span>
                                        <span className="shrink-0">${formatMoney(lineTotal)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </>
                        )}

                        {selectedMaterialEntries().length > 0 && (
                          <>
                            {MATERIAL_GROUPS.map((group) => {
                              const entries = selectedMaterialEntries().filter(
                                (m) => m.group === group
                              );
                              if (entries.length === 0) return null;
                              return (
                                <div key={group}>
                                  <h4 className="font-semibold mb-3">
                                    {materialGroupLabels[group].title}:
                                  </h4>
                                  {entries.map((m) => {
                                    const colorName = getMaterialColorLabel(m);
                                    return (
                                      <div
                                        key={m.id}
                                        className="flex justify-between items-start gap-4 text-sm mb-1"
                                      >
                                        <span>
                                          {m.name}
                                          {colorName && (
                                            <span className="block text-muted-foreground text-xs mt-0.5">
                                              {colorName}
                                            </span>
                                          )}
                                        </span>
                                        <span className="shrink-0">{formatMaterialPrice(m.price)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Estimated Total:</span>
                            <span className="text-primary">${formatMoney(calculateTotal())}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {isSubscription
                              ? "Estimated per delivery — seasonal availability may adjust stem selection slightly."
                              : "Total at checkout — seasonal availability may adjust stem selection slightly."}
                          </p>
                        </div>

                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handlePlaceOrder}
                          disabled={Object.keys(selectedStems).length === 0}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {isSubscription ? "Save for subscription waitlist" : "Add to cart"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sticky bottom-0 z-30 mt-6 border-t border-primary/15 bg-background/95 backdrop-blur-md shadow-[0_-8px_24px_hsl(340_30%_25%_/0.08)]">
            <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[7rem] sm:min-w-[9rem]"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                size="lg"
                className="min-w-[7rem] sm:min-w-[9rem]"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={
                  currentStep === 3 ||
                  (currentStep === 1 && !step1Complete) ||
                  (currentStep === 2 && !step2Complete)
                }
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBouquet;
