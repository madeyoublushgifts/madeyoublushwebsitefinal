import { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InquiryForm from "@/components/ui/inquiry-form";
import { Plus, Minus, ChevronRight, ChevronLeft } from "lucide-react";
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
  kraftPaper as kraft_paper,
  silkRibbon as silk_ribbon,
  basket,
  vase,
  buildGreetingCard as card,
} from "../assets/images";

const STEM_CATEGORIES: StemCategory[] = ["main", "filler", "greenery"];

const findStem = (id: string) => buildBouquetStems.find((s) => s.id === id);

const formatMoney = (amount: number) =>
  amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);

type StemColorSelection = (BouquetStemColor | null)[];

const CreateBouquet = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStems, setSelectedStems] = useState<Record<string, number>>({});
  const [stemColors, setStemColors] = useState<Record<string, StemColorSelection>>({});
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, boolean>>({});
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Choose Stems",
      description: "Main flowers, fillers, and greenery",
    },
    { id: 2, title: "Choose Materials", description: "Wrapping, ribbons, vase, or basket" },
    { id: 3, title: "Review & inquire", description: "We confirm details before anything is cut" },
  ];

  const materials = [
    { id: "kraft", name: "Kraft Paper", price: 1, image: kraft_paper, description: "Natural brown paper wrapping" },
    { id: "silk", name: "Silk Ribbon Wrapping", price: 5, image: silk_ribbon, description: "Elegant silk ribbon finish" },
    { id: "basket", name: "Wicker Basket", price: 8, image: basket, description: "Charming wicker presentation" },
    { id: "vase", name: "Glass Vase", price: 15, image: vase, description: "Beautiful clear glass vase" },
    { id: "card", name: "Greeting Card", price: 2, image: card, description: "Personalized message card" },
  ];

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

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [materialId]: !prev[materialId],
    }));
  };

  const calculateTotal = () => {
    const stemTotal = Object.entries(selectedStems).reduce((sum, [stemId, quantity]) => {
      const stem = findStem(stemId);
      return sum + (stem ? stem.price * quantity : 0);
    }, 0);

    const materialTotal = Object.entries(selectedMaterials).reduce((sum, [materialId, selected]) => {
      if (!selected) return sum;
      const material = materials.find((m) => m.id === materialId);
      return sum + (material ? material.price : 0);
    }, 0);

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

    const materialItems = Object.entries(selectedMaterials)
      .filter(([_, selected]) => selected)
      .map(([materialId]) => {
        const material = materials.find((m) => m.id === materialId);
        return material ? material.name : "";
      })
      .filter(Boolean);

    return [...stemItems, ...materialItems].join(", ");
  };

  const handlePlaceOrder = () => {
    setIsInquiryOpen(true);
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

  const renderColorPicker = (stemId: string, index: number, selected: BouquetStemColor | null) => (
    <div key={index} className="flex flex-wrap items-center gap-2 justify-center">
      <span className="text-xs text-muted-foreground w-6 shrink-0">#{index + 1}</span>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {bouquetStemColors.map((color) => {
          const isActive = selected === color.id;
          return (
            <button
              key={color.id}
              type="button"
              title={color.name}
              aria-label={`Stem ${index + 1}: ${color.name}`}
              aria-pressed={isActive}
              onClick={() => setStemColorAtIndex(stemId, index, color.id)}
              className={`h-7 w-7 rounded-full border-2 transition-all shrink-0 ${
                isActive
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );

  const renderStemCard = (stem: StemOption) => {
    const qty = selectedStems[stem.id] || 0;
    const showColors = qty > 0 && stemSupportsColor(stem.id, stem.category);
    const colors = stemColors[stem.id] ?? [];

    return (
      <motion.div
        key={stem.id}
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 15 },
          visible: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 shadow-md bg-card-gradient h-full">
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
                    Color per stem
                  </p>
                  {Array.from({ length: qty }, (_, i) =>
                    renderColorPicker(stem.id, i, colors[i] ?? null)
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
              Build a Bouquet
            </motion.h1>
            <motion.p
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Pick stems by the piece—main flowers, fillers, and greenery priced for Toronto. We follow up to
              confirm availability, wrapping, and pickup or delivery before anything is cut.
            </motion.p>
          </motion.div>
        </section>

        <section className="py-8 border-b border-border">
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

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
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
                      color for each flower stem you add—greenery stays natural. Final totals are confirmed
                      when we reply to your inquiry.
                    </p>
                    {!step1Complete && Object.keys(selectedStems).length > 0 && (
                      <p className="text-sm text-amber-700 dark:text-amber-400 max-w-xl mx-auto">
                        Choose a color for every flower and filler stem before continuing.
                      </p>
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
                    <p className="text-lg lg:text-xl text-muted-foreground">
                      Select how you&apos;d like your bouquet presented
                    </p>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
                    }}
                  >
                    {materials.map((material) => (
                      <motion.div
                        key={material.id}
                        variants={{
                          hidden: { opacity: 0, scale: 0.95, y: 15 },
                          visible: { opacity: 1, scale: 1, y: 0 },
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card
                          className={`border-2 shadow-md cursor-pointer transition-all ${
                            selectedMaterials[material.id]
                              ? "border-primary bg-primary/5"
                              : "border-transparent bg-card-gradient"
                          }`}
                          onClick={() => toggleMaterial(material.id)}
                        >
                          <CardContent className="p-6 text-center space-y-4">
                            {renderImage(material.image, material.name)}
                            <h3 className="font-heading text-lg font-semibold">{material.name}</h3>
                            <p className="text-lg text-muted-foreground">{material.description}</p>
                            <Badge variant="secondary">+${material.price}</Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
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
                        Review Your Custom Bouquet
                      </h2>
                      <p className="text-lg lg:text-xl text-muted-foreground">
                        Perfect! Let&apos;s finalize your beautiful creation
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

                        {Object.values(selectedMaterials).some(Boolean) && (
                          <div>
                            <h4 className="font-semibold mb-3">Presentation & Materials:</h4>
                            {Object.entries(selectedMaterials)
                              .filter(([_, selected]) => selected)
                              .map(([id]) => {
                                const material = materials.find((m) => m.id === id);
                                return (
                                  material && (
                                    <div key={id} className="flex justify-between items-center text-sm">
                                      <span>{material.name}</span>
                                      <span>${material.price}</span>
                                    </div>
                                  )
                                );
                              })}
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Estimated Total:</span>
                            <span className="text-primary">${formatMoney(calculateTotal())}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Final price will be confirmed when we contact you—seasonal availability and stem
                            size may adjust totals slightly.
                          </p>
                        </div>

                        <Button
                          className="w-full text-lg py-6"
                          onClick={handlePlaceOrder}
                          disabled={Object.keys(selectedStems).length === 0}
                        >
                          Inquire / Pre-order
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={
                  currentStep === 3 ||
                  (currentStep === 1 && !step1Complete)
                }
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <InquiryForm
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        title="Inquire / Pre-order"
        description="Share your build notes—we’ll reply with stem availability, add-on ideas, and a confirmed estimate before we finalize anything."
        itemName={`Custom bouquet — ${getSelectedItemsText()} (Est. $${formatMoney(calculateTotal())})`}
        source="Build a Bouquet"
      />
    </div>
  );
};

export default CreateBouquet;
