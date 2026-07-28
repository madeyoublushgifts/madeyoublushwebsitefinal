import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OccasionPicker from "@/components/OccasionPicker";
import BouquetPalettePicker from "@/components/BouquetPalettePicker";
import SignatureBouquetCard from "@/components/SignatureBouquetCard";
import {
  defaultTierPaletteSelection,
  formatTierPaletteChoice,
  isTierPaletteComplete,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { bouquetTiers, getBouquetTier } from "@/data/bouquetTiers";
import { getSignatureBouquet, signatureBouquets } from "@/data/signatureBouquets";
import {
  defaultSignatureSizeId,
  formatSignatureSizeLabel,
  getSignatureSizeTier,
} from "@/data/signatureBouquetSizes";
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import {
  biweeklyDeliveryOptions,
  commitmentMonthOptions,
  formatBiweeklyDeliveryLabel,
  formatMonthlyCommitmentLabel,
  specialDatesAnnualPlan,
  specialDatesPlans,
  subscriptionPlans,
  type PaymentPlan,
  type SubscriptionCadence,
} from "@/data/subscriptionPlans";
import { submitToFormspree } from "@/lib/formspree";
import {
  clearSubscriptionBuildDraft,
  loadSubscriptionBuildDraft,
  type SubscriptionBuildDraft,
} from "@/lib/subscriptionBuildDraft";
import { toast } from "@/hooks/use-toast";
import { BellRing, Flower, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const minDeliveryDate = getMinDeliveryDate();

type WaitlistPath = "recurring" | "special_dates";
type BouquetSource = "tier" | "signature" | "custom";

const pathOptions: { id: WaitlistPath; title: string; description: string }[] = [
  {
    id: "recurring",
    title: "Recurring Delivery Subscription Waitlist",
    description: "Bi-weekly, monthly, or annual delivery on a repeating schedule.",
  },
  {
    id: "special_dates",
    title: "Special Dates & Occasions Only",
    description:
      "Annual $150 package or pay per occasion for Valentine’s, Mother’s Day, birthdays, and more.",
  },
];

const bouquetStyleOptions: {
  id: BouquetSource;
  title: string;
  description: string;
}[] = [
  {
    id: "tier",
    title: "Bouquet tier",
    description: "Pick a size tier and choose colour templates or a custom palette",
  },
  {
    id: "signature",
    title: "Preset bouquet",
    description: "Choose a named signature look from our lookbook favourites",
  },
  {
    id: "custom",
    title: "Build your custom bouquet",
    description: "Custom stems for your subscription — separate from shop orders",
  },
];

const SubscriptionWaitlistForm = () => {
  const location = useLocation();
  const [waitlistPath, setWaitlistPath] = useState<WaitlistPath | "">("");
  const [cadence, setCadence] = useState<SubscriptionCadence | "">("");
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | "">("");
  const [commitmentValue, setCommitmentValue] = useState<number | "custom" | "">("");
  const [customCommitment, setCustomCommitment] = useState("");
  const [bouquetSource, setBouquetSource] = useState<BouquetSource | "">("");
  const [tierId, setTierId] = useState("");
  const [tierPalette, setTierPalette] = useState<TierPaletteSelection>(
    defaultTierPaletteSelection()
  );
  const [signatureId, setSignatureId] = useState("");
  const [signatureSizes, setSignatureSizes] = useState<Record<string, string>>({});
  const [buildDraft, setBuildDraft] = useState<SubscriptionBuildDraft | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [occasions, setOccasions] = useState<SubscriptionOccasion[]>([]);
  const [receiverNotes, setReceiverNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const draft = loadSubscriptionBuildDraft();
    if (draft) {
      setBuildDraft(draft);
      setBouquetSource("custom");
    }
  }, [location.pathname, location.hash]);

  const selectedTier = tierId ? getBouquetTier(tierId) : undefined;
  const selectedSignature = signatureId ? getSignatureBouquet(signatureId) : undefined;
  const selectedSignatureSize = signatureId
    ? getSignatureSizeTier(signatureSizes[signatureId] ?? defaultSignatureSizeId)
    : undefined;

  const resolvedCommitment = useMemo(() => {
    if (commitmentValue === "custom") {
      const n = Number.parseInt(customCommitment, 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    return typeof commitmentValue === "number" ? commitmentValue : 0;
  }, [commitmentValue, customCommitment]);

  const minTemplates =
    waitlistPath === "recurring" &&
    bouquetSource === "tier" &&
    tierPalette.mode === "template" &&
    resolvedCommitment > 0
      ? Math.min(resolvedCommitment, 15)
      : 1;

  const cadencePlans =
    waitlistPath === "special_dates" ? specialDatesPlans : subscriptionPlans;

  const showPaymentPlan =
    waitlistPath === "recurring" ||
    (waitlistPath === "special_dates" &&
      (cadence === "annual" || cadence === "per_occasion"));
  /** Commitment length for recurring bi-weekly/monthly only — recurring annual is payment plan alone. */
  const showCommitment =
    waitlistPath === "recurring" && cadence !== "annual";

  const getSignatureSize = (bouquetId: string) =>
    signatureSizes[bouquetId] ?? defaultSignatureSizeId;

  const setSignatureSize = (bouquetId: string, sizeId: string) => {
    setSignatureSizes((prev) => ({ ...prev, [bouquetId]: sizeId }));
  };

  const handlePathChange = (path: WaitlistPath) => {
    setWaitlistPath(path);
    setCadence("");
    setPaymentPlan("");
    setCommitmentValue("");
    setCustomCommitment("");
  };

  const handleTierSelect = (id: string) => {
    const tier = getBouquetTier(id);
    setTierId(id);
    setTierPalette(defaultTierPaletteSelection(tier?.shopBouquetId));
  };

  const handleBouquetSourceChange = (source: BouquetSource) => {
    setBouquetSource(source);
    setTierId("");
    setTierPalette(defaultTierPaletteSelection());
    setSignatureId("");
    setSignatureSizes({});
    if (source === "custom") {
      setBuildDraft(loadSubscriptionBuildDraft());
    } else {
      setBuildDraft(null);
      clearSubscriptionBuildDraft();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistPath) {
      toast({
        title: "Choose a waitlist option",
        description: "Select recurring delivery or special dates & occasions only.",
        variant: "destructive",
      });
      return;
    }

    if (!cadence) {
      toast({
        title: "Choose a delivery cadence",
        description:
          waitlistPath === "special_dates"
            ? "Select annual package or per occasion."
            : "Select bi-weekly, monthly, or annual.",
        variant: "destructive",
      });
      return;
    }

    if (showPaymentPlan) {
      if (!paymentPlan) {
        toast({
          title: "Choose a payment plan",
          description: "Select auto-renewal or prepay.",
          variant: "destructive",
        });
        return;
      }
    }

    if (showCommitment && !resolvedCommitment) {
      toast({
        title: "Choose a subscription length",
        description:
          cadence === "biweekly"
            ? "Pick how many bi-weekly deliveries you want, or enter a custom number."
            : "Pick 1, 3, 6, 9, 12 months, or enter a custom number of months.",
        variant: "destructive",
      });
      return;
    }

    if (!bouquetSource) {
      toast({
        title: "How would you like your bouquets?",
        description: "Pick a bouquet tier, preset bouquet, or build your custom bouquet.",
        variant: "destructive",
      });
      return;
    }

    if (bouquetSource === "tier") {
      if (!tierId || !selectedTier) {
        toast({
          title: "Choose a bouquet tier",
          description: "Select which tier you'd like for your subscription.",
          variant: "destructive",
        });
        return;
      }

      if (
        !isTierPaletteComplete(tierPalette, selectedTier.shopBouquetId, {
          minTemplates,
        })
      ) {
        toast({
          title: "Choose a palette",
          description:
            tierPalette.mode === "template"
              ? `Select at least ${minTemplates} colour template${minTemplates === 1 ? "" : "s"}, or switch to the colour picker.`
              : "Pick at least one colour for your bouquet tier.",
          variant: "destructive",
        });
        return;
      }
    }

    if (bouquetSource === "signature" && !signatureId) {
      toast({
        title: "Choose a preset bouquet",
        description: "Select one of our signature lookbook bouquets.",
        variant: "destructive",
      });
      return;
    }

    if (bouquetSource === "custom" && !buildDraft) {
      toast({
        title: "Build your custom bouquet",
        description: "Use the subscription builder to describe your custom stems.",
        variant: "destructive",
      });
      return;
    }

    if (waitlistPath === "special_dates") {
      if (occasions.length === 0) {
        toast({
          title: "Add at least one special date",
          description: "Special Dates & Occasions Only needs one or more dates.",
          variant: "destructive",
        });
        return;
      }
      const incompleteCustom = occasions.some((o) => o.type === "custom" && !o.label.trim());
      if (incompleteCustom) {
        toast({
          title: "Complete custom occasions",
          description: "Add text for each custom occasion.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!isDeliveryDateValid(deliveryDate)) {
      toast({
        title: "Check your first delivery date",
        description: "First delivery must be at least one week from today.",
        variant: "destructive",
      });
      return;
    }

    const cadenceLabel =
      waitlistPath === "special_dates"
        ? cadence === "per_occasion"
          ? "Per occasion (Special Dates)"
          : `Annual (Special Dates — ${specialDatesAnnualPlan.priceLabel})`
        : cadence === "biweekly"
          ? "Bi-weekly"
          : cadence === "monthly"
            ? "Monthly"
            : `Annual (${subscriptionPlans.find((p) => p.id === "annual")?.priceLabel ?? "$185"})`;

    const paymentPlanLabel =
      paymentPlan === "autorenew"
        ? "Auto-renewal"
        : paymentPlan === "prepay"
          ? "Prepay"
          : "";

    const commitmentLabel =
      waitlistPath === "special_dates"
        ? cadence === "per_occasion"
          ? `Per occasion (${occasions.length} occasion${occasions.length === 1 ? "" : "s"} selected)`
          : `Annual package (${specialDatesAnnualPlan.priceLabel})`
        : cadence === "biweekly"
          ? resolvedCommitment === 1
            ? "1 bi-weekly delivery"
            : `${resolvedCommitment} bi-weekly deliveries`
          : cadence === "annual"
            ? "Annual"
            : `${resolvedCommitment} month${resolvedCommitment === 1 ? "" : "s"}`;

    const paletteLabel =
      bouquetSource === "tier" && selectedTier
        ? formatTierPaletteChoice(tierPalette, selectedTier.shopBouquetId)
        : "";

    const tierSummary =
      bouquetSource === "tier" && selectedTier
        ? `${selectedTier.name} (${selectedTier.priceLabel})${paletteLabel ? ` — ${paletteLabel}` : ""}`
        : bouquetSource === "signature" && selectedSignature && selectedSignatureSize
          ? `${selectedSignature.name} — ${formatSignatureSizeLabel(selectedSignatureSize.id)}`
          : buildDraft
            ? `Custom build (est. $${buildDraft.estimatedTotal.toFixed(2)}/delivery) — ${buildDraft.summary}`
            : "Custom build";

    const sourceLabel =
      bouquetSource === "tier"
        ? "Bouquet tier"
        : bouquetSource === "signature"
          ? "Preset bouquet"
          : "Build your custom bouquet";

    setIsSubmitting(true);

    try {
      await submitToFormspree("waitlist", {
        _subject:
          waitlistPath === "special_dates"
            ? "Special dates waitlist — Made You Blush"
            : "Recurring delivery subscription waitlist — Made You Blush",
        _replyto: email,
        source: "Subscription page",
        waitlistPath:
          waitlistPath === "special_dates"
            ? "Special Dates & Occasions Only"
            : "Recurring Delivery Subscription Waitlist",
        name,
        email,
        phone,
        deliveryAddress: address,
        cadence: cadenceLabel,
        paymentPlan: paymentPlanLabel,
        commitmentMonths: commitmentLabel,
        firstDeliveryDate: deliveryDate,
        bouquetSource: sourceLabel,
        bouquetTier: tierSummary,
        occasions: occasions.length
          ? occasions.map((o) => `${o.type}: ${o.label || "(no label)"} (${o.date})`).join("; ")
          : "None added",
        receiverNotes,
        bouquetNotes: notes,
      });

      toast({
        title: "You're on the waitlist!",
        description:
          "Thanks for your interest. We'll email you when subscriptions open with your preferences saved.",
      });

      clearSubscriptionBuildDraft();
      setWaitlistPath("");
      setCadence("");
      setPaymentPlan("");
      setCommitmentValue("");
      setCustomCommitment("");
      setBouquetSource("");
      setTierId("");
      setTierPalette(defaultTierPaletteSelection());
      setSignatureId("");
      setSignatureSizes({});
      setBuildDraft(null);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDeliveryDate(minDeliveryDate);
      setOccasions([]);
      setReceiverNotes("");
      setNotes("");
    } catch (err) {
      toast({
        title: "Could not join waitlist",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email madeyoublushgifts@gmail.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-elegant bg-card-gradient overflow-hidden">
      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 overflow-x-hidden">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Choose your waitlist *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pathOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handlePathChange(option.id)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all min-h-11",
                    waitlistPath === option.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="font-medium block">{option.title}</span>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {waitlistPath ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Delivery cadence *</legend>
              <div
                className={cn(
                  "grid gap-3",
                  waitlistPath === "special_dates"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-3"
                )}
              >
                {cadencePlans.map((plan) => {
                  const selected = cadence === plan.id;
                  return (
                    <button
                      key={`${waitlistPath}-${plan.id}-${plan.priceLabel ?? "std"}`}
                      type="button"
                      onClick={() => {
                        setCadence(plan.id);
                        setCommitmentValue("");
                        setCustomCommitment("");
                      }}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all min-h-11",
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium">{plan.label}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {plan.priceLabel ? (
                            <span className="text-primary text-xs font-semibold">
                              {plan.priceLabel}
                            </span>
                          ) : null}
                          {plan.badge ? (
                            <Badge className="text-[10px] uppercase tracking-wide">
                              {plan.badge}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {plan.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {showPaymentPlan ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Payment plan *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  waitlistPath === "special_dates"
                    ? ([
                        {
                          id: "autorenew" as const,
                          title: "Auto-renewal",
                          description:
                            "Renew each year for the same occasions on your list.",
                        },
                        {
                          id: "prepay" as const,
                          title: "Prepay",
                          description:
                            "Prepay for your selected occasions as a package.",
                        },
                      ] as const)
                    : ([
                        {
                          id: "autorenew" as const,
                          title: "Auto-renewal",
                          description:
                            cadence === "annual"
                              ? "Stay subscribed and renew automatically each year."
                              : cadence === "biweekly"
                                ? "Stay subscribed and renew automatically after your chosen deliveries."
                                : "Stay subscribed and renew automatically after your term.",
                        },
                        {
                          id: "prepay" as const,
                          title: "Prepay",
                          description:
                            cadence === "annual"
                              ? "Pay for the full year up front."
                              : cadence === "biweekly"
                                ? "Pay up front for your chosen number of bi-weekly deliveries."
                                : "Pay up front for a set number of months.",
                        },
                      ] as const)
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentPlan(option.id)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all min-h-11",
                      paymentPlan === option.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="font-medium block">{option.title}</span>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {showCommitment ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">
                {paymentPlan === "prepay"
                  ? cadence === "biweekly"
                    ? "How many bi-weekly deliveries? *"
                    : "Prepay length *"
                  : cadence === "biweekly"
                    ? "How many bi-weekly deliveries? *"
                    : "How long do you want to subscribe? *"}
              </legend>
              <p className="text-xs text-muted-foreground -mt-1">
                {cadence === "biweekly"
                  ? "Pick a delivery count (with month equivalents), or enter a custom number of deliveries."
                  : "Choose how many monthly deliveries you want in this term."}
              </p>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {(cadence !== "biweekly"
                  ? commitmentMonthOptions
                  : biweeklyDeliveryOptions
                ).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setCommitmentValue(value);
                      setCustomCommitment("");
                    }}
                    className={cn(
                      "rounded-lg border-2 px-2.5 py-2.5 text-xs sm:text-sm font-medium min-h-11 transition-all leading-snug",
                      commitmentValue === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    {cadence === "biweekly"
                      ? formatBiweeklyDeliveryLabel(value)
                      : formatMonthlyCommitmentLabel(value)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCommitmentValue("custom")}
                  className={cn(
                    "rounded-lg border-2 px-2.5 py-2.5 text-xs sm:text-sm font-medium min-h-11 transition-all",
                    commitmentValue === "custom"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  Custom
                </button>
              </div>
              {commitmentValue === "custom" ? (
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="wl-custom-commitment">
                    {cadence === "biweekly" ? "Number of deliveries *" : "Custom months *"}
                  </Label>
                  <Input
                    id="wl-custom-commitment"
                    type="number"
                    min={1}
                    max={cadence === "biweekly" ? 52 : 36}
                    value={customCommitment}
                    onChange={(e) => setCustomCommitment(e.target.value)}
                    placeholder={cadence === "biweekly" ? "e.g. 4" : "e.g. 8"}
                    required
                  />
                </div>
              ) : null}
            </fieldset>
          ) : showPaymentPlan &&
            waitlistPath === "special_dates" &&
            cadence === "per_occasion" ? (
            <p className="text-xs text-muted-foreground rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
              Term length isn’t needed for per occasion — you’ll schedule each date below.
              Your payment plan applies to those occasions.
            </p>
          ) : null}

          {waitlistPath ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Your bouquet style *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bouquetStyleOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleBouquetSourceChange(option.id)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all min-h-11",
                      bouquetSource === option.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="font-medium block">{option.title}</span>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {bouquetSource === "tier" ? (
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Choose bouquet tier *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bouquetTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleTierSelect(tier.id)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left text-sm transition-all min-h-11",
                      tierId === tier.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{tier.name}</span>
                      <span className="text-primary text-xs font-semibold">{tier.priceLabel}</span>
                    </div>
                    <span className="text-muted-foreground block text-xs mt-0.5">
                      {tier.description}
                    </span>
                  </button>
                ))}
              </div>

              {selectedTier ? (
                <div className="rounded-xl border border-border bg-background/60 p-4 space-y-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Colour template or colour picker *
                    {waitlistPath === "recurring" && minTemplates > 1
                      ? cadence === "biweekly"
                        ? ` (choose at least ${minTemplates} templates for ${resolvedCommitment} deliveries)`
                        : ` (choose at least ${minTemplates} templates for a ${resolvedCommitment}-month plan)`
                      : ""}
                  </p>
                  <BouquetPalettePicker
                    bouquetId={selectedTier.shopBouquetId}
                    selection={tierPalette}
                    onChange={setTierPalette}
                    allowMultipleTemplates={waitlistPath === "recurring"}
                    minTemplates={minTemplates}
                  />

                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <Label htmlFor="wl-receiver-notes">Tell us more about the receiver</Label>
                    <Textarea
                      id="wl-receiver-notes"
                      value={receiverNotes}
                      onChange={(e) => setReceiverNotes(e.target.value)}
                      placeholder="Favorite flowers? Special interests? Meaningful moments?"
                      rows={3}
                    />
                  </div>
                </div>
              ) : null}
            </fieldset>
          ) : null}

          {bouquetSource === "signature" ? (
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Choose a preset bouquet *</legend>
              <p className="text-xs text-muted-foreground -mt-1">
                Our signature lookbook favourites — each styled in-house with a named mood.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {signatureBouquets.map((bouquet) => (
                  <SignatureBouquetCard
                    key={bouquet.id}
                    bouquet={bouquet}
                    singleSelectMode
                    selected={signatureId === bouquet.id}
                    onSelect={() => {
                      setSignatureId(bouquet.id);
                      if (!signatureSizes[bouquet.id]) {
                        setSignatureSize(bouquet.id, defaultSignatureSizeId);
                      }
                    }}
                    selectedSizeId={getSignatureSize(bouquet.id)}
                    onSizeChange={(sizeId) => {
                      setSignatureSize(bouquet.id, sizeId);
                      setSignatureId(bouquet.id);
                    }}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          {bouquetSource === "custom" ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 space-y-3 text-sm">
              {buildDraft ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">Your custom bouquet</p>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{buildDraft.summary}</p>
                    <p className="text-primary font-semibold mt-2">
                      Est. ${buildDraft.estimatedTotal.toFixed(2)} per delivery
                    </p>
                  </div>
                  <Button asChild type="button" variant="outline" size="sm">
                    <Link to="/subscription/build-bouquet">
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Flower className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
                  <span className="text-muted-foreground">
                    Use our subscription-only builder to pick stems, wrap, and add-ons for your custom
                    bouquet.
                  </span>
                  <Button asChild type="button" variant="secondary" size="sm" className="mt-2">
                    <Link to="/subscription/build-bouquet">Build your custom bouquet</Link>
                  </Button>
                </>
              )}
            </div>
          ) : null}

          {waitlistPath ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wl-name">Full name *</Label>
                  <Input
                    id="wl-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wl-email">Email *</Label>
                  <Input
                    id="wl-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wl-phone">Phone (optional)</Label>
                  <Input
                    id="wl-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 647-550-8476"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wl-delivery-date">Preferred first delivery *</Label>
                  <Input
                    id="wl-delivery-date"
                    type="date"
                    min={minDeliveryDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Earliest: {formatDisplayDate(minDeliveryDate)} (1 week from today)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wl-address">Delivery address *</Label>
                <Input
                  id="wl-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Full GTA delivery address"
                />
              </div>

              <OccasionPicker
                occasions={occasions}
                onChange={setOccasions}
                minDate={minDeliveryDate}
                required={waitlistPath === "special_dates"}
              />

              <div className="space-y-2">
                <Label htmlFor="wl-notes">Notes</Label>
                <Textarea
                  id="wl-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, gift vs self-care, delivery instructions…"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full min-h-12" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Joining waitlist…
                  </>
                ) : (
                  <>
                    <BellRing className="mr-2 h-5 w-5" />
                    Join waitlist
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No payment today — pricing follows your bouquet choice
                {waitlistPath === "special_dates"
                  ? cadence === "per_occasion"
                    ? " and each selected occasion"
                    : ` and the ${specialDatesAnnualPlan.priceLabel} annual special-dates package`
                  : ""}
                . We&apos;ll email you when subscriptions launch.
              </p>
            </>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionWaitlistForm;
