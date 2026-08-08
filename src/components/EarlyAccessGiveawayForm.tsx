import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BouquetPalettePicker from "@/components/BouquetPalettePicker";
import SignatureBouquetCard from "@/components/SignatureBouquetCard";
import {
  defaultTierPaletteSelection,
  formatTierPaletteChoice,
  isTierPaletteComplete,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { getBouquetTier } from "@/data/bouquetTiers";
import {
  earlyAccessBuildHref,
  getEarlyAccessGiveaway,
  type EarlyAccessBouquetStyle,
  type EarlyAccessGiveawayId,
  type EarlyAccessMonthConfig,
} from "@/data/earlyAccessGiveaways";
import {
  earlyAccessColorTemplates,
  earlyAccessPaletteColors,
  formatEarlyAccessPaletteChoice,
  isEarlyAccessPaletteComplete,
} from "@/data/earlyAccessStock";
import { getSignatureBouquet, signatureBouquets } from "@/data/signatureBouquets";
import { addMonthsIso, formatDisplayDate } from "@/data/subscriptionDates";
import { submitToFormbricksEarlyAccess } from "@/lib/formbricks";
import {
  clearAllEarlyAccessBuildDrafts,
  clearEarlyAccessBuildDraft,
  loadEarlyAccessBuildDraft,
  type EarlyAccessBuildDraft,
} from "@/lib/earlyAccessBuildDraft";
import { toast } from "@/hooks/use-toast";
import { Gift, Heart, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const miniTier = getBouquetTier("mini")!;

type BouquetSource = EarlyAccessBouquetStyle;

type MonthBouquetState = {
  source: BouquetSource | "";
  tierPalette: TierPaletteSelection;
  signatureId: string;
  buildDraft: EarlyAccessBuildDraft | null;
  receiverNotes: string;
  notes: string;
};

const emptyMonthState = (): MonthBouquetState => ({
  source: "",
  tierPalette: defaultTierPaletteSelection(miniTier.shopBouquetId),
  signatureId: "",
  buildDraft: null,
  receiverNotes: "",
  notes: "",
});

const styleMeta: Record<
  BouquetSource,
  { title: string; description: (month: EarlyAccessMonthConfig) => string }
> = {
  tier: {
    title: "Bouquet tier",
    description: (month) =>
      month.tierPalette === "early-access"
        ? "Mini size with pink, white & yellow palettes from current stock"
        : "Mini size with our full colour templates or a custom palette",
  },
  signature: {
    title: "Preset bouquet",
    description: () => "Choose a named signature look — locked to Mini size",
  },
  custom: {
    title: "Build your custom bouquet",
    description: (month) =>
      month.builderVariant === "stock"
        ? "Daisy, roses, carnations, eucalyptus stem & fillers from current stock"
        : "Full stem catalog with wrap, ribbon, and add-ons",
  },
};

function monthNotesSuffix(state: MonthBouquetState): string {
  const lines: string[] = [];
  const receiver = state.receiverNotes.trim();
  const notes = state.notes.trim();
  if (receiver) lines.push(`  About the receiver: ${receiver}`);
  if (notes) lines.push(`  Notes: ${notes}`);
  return lines.length ? `\n${lines.join("\n")}` : "";
}

function summarizeMonth(
  month: EarlyAccessMonthConfig,
  state: MonthBouquetState,
  deliveryDate: string,
  deliveryAddress: string
): string {
  const dateLabel = `${deliveryDate} · ${formatDisplayDate(deliveryDate)}`;
  const prefix = `${month.label} (${dateLabel})`;
  const addressSuffix = deliveryAddress
    ? `\n  Delivery address: ${deliveryAddress}`
    : "";
  const notesSuffix = monthNotesSuffix(state);

  if (state.source === "tier") {
    const palette =
      month.tierPalette === "early-access"
        ? formatEarlyAccessPaletteChoice(state.tierPalette)
        : formatTierPaletteChoice(state.tierPalette, miniTier.shopBouquetId);
    return `${prefix}: Bouquet tier (Mini) — Mini Bouquet — ${palette}${addressSuffix}${notesSuffix}`;
  }

  if (state.source === "signature") {
    const sig = getSignatureBouquet(state.signatureId);
    return `${prefix}: Preset (Mini) — ${sig?.name ?? state.signatureId}${addressSuffix}${notesSuffix}`;
  }

  if (state.source === "custom" && state.buildDraft) {
    return `${prefix}: Custom mini build (est. $${state.buildDraft.estimatedTotal.toFixed(2)}) — ${state.buildDraft.summary}${addressSuffix}${notesSuffix}`;
  }

  return `${prefix}: (incomplete)${addressSuffix}${notesSuffix}`;
}

type EarlyAccessGiveawayFormProps = {
  giveawayId: EarlyAccessGiveawayId;
};

const EarlyAccessGiveawayForm = ({ giveawayId }: EarlyAccessGiveawayFormProps) => {
  const giveaway = getEarlyAccessGiveaway(giveawayId);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMultiMonth = giveaway.monthsCount > 1;

  const [submitted, setSubmitted] = useState(false);
  const [activeMonth, setActiveMonth] = useState(() => {
    const raw = Number.parseInt(searchParams.get("month") ?? "1", 10);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, giveaway.monthsCount);
  });
  const [months, setMonths] = useState<Record<number, MonthBouquetState>>(() => {
    const init: Record<number, MonthBouquetState> = {};
    for (const m of giveaway.months) init[m.month] = emptyMonthState();
    return init;
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [monthAddresses, setMonthAddresses] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    for (const m of giveaway.months) init[m.month] = "";
    return init;
  });
  const [sameAsMonth1, setSameAsMonth1] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    for (const m of giveaway.months) {
      if (m.month > 1) init[m.month] = true;
    }
    return init;
  });
  const [deliveryDate, setDeliveryDate] = useState<string>(giveaway.defaultDeliveryDate);
  const [receiverNotes, setReceiverNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthDeliveryDates = useMemo(() => {
    const map: Record<number, string> = {};
    for (const m of giveaway.months) {
      map[m.month] = addMonthsIso(deliveryDate, m.month - 1);
    }
    return map;
  }, [deliveryDate, giveaway.months]);

  const getEffectiveMonthAddress = (month: number): string => {
    if (!isMultiMonth) return address.trim();
    if (month === 1 || sameAsMonth1[month]) {
      return (monthAddresses[1] ?? "").trim();
    }
    return (monthAddresses[month] ?? "").trim();
  };

  const formatDeliveryAddressSummary = (): string => {
    if (!isMultiMonth) return address.trim();
    return giveaway.months
      .map((m) => {
        const addr = getEffectiveMonthAddress(m.month);
        const sameNote =
          m.month > 1 && sameAsMonth1[m.month] ? " (same as Month 1)" : "";
        return `${m.label}: ${addr}${sameNote}`;
      })
      .join("\n");
  };

  useEffect(() => {
    const raw = Number.parseInt(searchParams.get("month") ?? "", 10);
    if (Number.isFinite(raw) && raw >= 1 && raw <= giveaway.monthsCount) {
      setActiveMonth(raw);
    }

    setMonths((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of giveaway.months) {
        const draft = loadEarlyAccessBuildDraft(giveawayId, m.month);
        if (draft) {
          next[m.month] = {
            ...(next[m.month] ?? emptyMonthState()),
            buildDraft: draft,
            source: "custom",
          };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [
    location.pathname,
    location.hash,
    searchParams,
    giveawayId,
    giveaway.months,
    giveaway.monthsCount,
  ]);

  const updateMonth = (month: number, patch: Partial<MonthBouquetState>) => {
    setMonths((prev) => ({
      ...prev,
      [month]: { ...(prev[month] ?? emptyMonthState()), ...patch },
    }));
  };

  const handleBouquetSourceChange = (
    monthConfig: EarlyAccessMonthConfig,
    source: BouquetSource
  ) => {
    const month = monthConfig.month;
    if (source === "custom") {
      updateMonth(month, {
        source,
        tierPalette: defaultTierPaletteSelection(miniTier.shopBouquetId),
        signatureId: "",
        buildDraft: loadEarlyAccessBuildDraft(giveawayId, month),
      });
      return;
    }

    clearEarlyAccessBuildDraft(giveawayId, month);
    updateMonth(month, {
      source,
      tierPalette: defaultTierPaletteSelection(miniTier.shopBouquetId),
      signatureId: "",
      buildDraft: null,
    });
  };

  const validateMonth = (monthConfig: EarlyAccessMonthConfig): string | null => {
    const state = months[monthConfig.month] ?? emptyMonthState();
    if (!state.source) {
      return `${monthConfig.label}: pick a bouquet style.`;
    }
    if (state.source === "tier") {
      const complete =
        monthConfig.tierPalette === "early-access"
          ? isEarlyAccessPaletteComplete(state.tierPalette)
          : isTierPaletteComplete(state.tierPalette, miniTier.shopBouquetId);
      if (!complete) {
        return `${monthConfig.label}: choose a colour palette.`;
      }
    }
    if (state.source === "signature" && !state.signatureId) {
      return `${monthConfig.label}: choose a preset bouquet.`;
    }
    if (state.source === "custom" && !state.buildDraft) {
      return `${monthConfig.label}: build your custom bouquet, then return here.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const monthConfig of giveaway.months) {
      const err = validateMonth(monthConfig);
      if (err) {
        toast({
          title: "Finish your bouquet plan",
          description: err,
          variant: "destructive",
        });
        setActiveMonth(monthConfig.month);
        return;
      }
    }

    if (
      !giveaway.deliveryDateOptions.includes(
        deliveryDate as (typeof giveaway.deliveryDateOptions)[number]
      )
    ) {
      toast({
        title: "Choose a delivery date",
        description: "Please pick August 14, 15, or 16.",
        variant: "destructive",
      });
      return;
    }

    if (isMultiMonth) {
      if (!getEffectiveMonthAddress(1)) {
        toast({
          title: "Delivery address needed",
          description: "Month 1 delivery address is required.",
          variant: "destructive",
        });
        setActiveMonth(1);
        return;
      }
      for (const monthConfig of giveaway.months) {
        if (monthConfig.month === 1) continue;
        if (
          !sameAsMonth1[monthConfig.month] &&
          !(monthAddresses[monthConfig.month] ?? "").trim()
        ) {
          toast({
            title: "Delivery address needed",
            description: `${monthConfig.label}: enter a delivery address, or check “Same as Month 1”.`,
            variant: "destructive",
          });
          setActiveMonth(monthConfig.month);
          return;
        }
      }
    }

    const monthSummaries = giveaway.months.map((m) =>
      summarizeMonth(
        m,
        months[m.month] ?? emptyMonthState(),
        monthDeliveryDates[m.month],
        isMultiMonth ? getEffectiveMonthAddress(m.month) : ""
      )
    );

    const bouquetDetails = isMultiMonth
      ? monthSummaries.join("\n")
      : monthSummaries[0].replace(/^[^:]+:\s*/, "");

    // Multi-month: also flatten notes into top-level Formbricks/email fields
    // (bouquetDetails still carries the full per-month plan).
    const aggregatedReceiverNotes = isMultiMonth
      ? giveaway.months
          .map((m) => {
            const n = (months[m.month] ?? emptyMonthState()).receiverNotes.trim();
            return n ? `${m.label}: ${n}` : "";
          })
          .filter(Boolean)
          .join("\n")
      : receiverNotes.trim();
    const aggregatedBouquetNotes = isMultiMonth
      ? giveaway.months
          .map((m) => {
            const n = (months[m.month] ?? emptyMonthState()).notes.trim();
            return n ? `${m.label}: ${n}` : "";
          })
          .filter(Boolean)
          .join("\n")
      : notes.trim();

    const firstMonth = months[1] ?? emptyMonthState();
    const bouquetSource = isMultiMonth
      ? giveaway.bouquetSourceLabel
      : firstMonth.source === "tier"
        ? "Bouquet tier (Mini)"
        : "Custom bouquet (Mini)";

    setIsSubmitting(true);

    const deliveryAddress = formatDeliveryAddressSummary();

    const claimPayload = {
      name,
      email,
      phone,
      deliveryAddress,
      firstDeliveryDate: deliveryDate,
      bouquetSource,
      bouquetDetails,
      receiverNotes: aggregatedReceiverNotes,
      bouquetNotes: aggregatedBouquetNotes,
      giveawayId,
      monthsCount: giveaway.monthsCount,
    };

    try {
      await submitToFormbricksEarlyAccess(claimPayload);

      clearAllEarlyAccessBuildDrafts(
        giveawayId,
        giveaway.months.map((m) => m.month)
      );
      setSubmitted(true);

      try {
        const notifyRes = await fetch("/api/early-access-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(claimPayload),
        });
        if (!notifyRes.ok) {
          const errBody = (await notifyRes.json().catch(() => null)) as {
            error?: string;
          } | null;
          console.error(
            "early-access-notify failed:",
            errBody?.error ?? notifyRes.statusText
          );
          toast({
            title: "Claim saved",
            description:
              "Confirmation email may be delayed — we'll still follow up soon.",
          });
        }
      } catch (notifyErr) {
        console.error("early-access-notify failed:", notifyErr);
        toast({
          title: "Claim saved",
          description:
            "Confirmation email may be delayed — we'll still follow up soon.",
        });
      }
    } catch (err) {
      toast({
        title: "Could not claim bouquet",
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

  const renderMonthAddressField = (monthConfig: EarlyAccessMonthConfig) => {
    const month = monthConfig.month;
    const isMonth1 = month === 1;
    const usesMonth1 = !isMonth1 && Boolean(sameAsMonth1[month]);
    const fieldId = `ea-address-m${month}`;

    return (
      <div className="space-y-3 rounded-xl border border-border/70 bg-background/50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor={usesMonth1 ? undefined : fieldId} className="text-sm font-medium">
            Delivery address {isMonth1 || !usesMonth1 ? "*" : ""}
          </Label>
          {!isMonth1 ? (
            <div className="flex items-center gap-2">
              <Checkbox
                id={`ea-same-m${month}`}
                checked={usesMonth1}
                onCheckedChange={(checked) =>
                  setSameAsMonth1((prev) => ({
                    ...prev,
                    [month]: checked === true,
                  }))
                }
              />
              <Label
                htmlFor={`ea-same-m${month}`}
                className="text-xs font-normal cursor-pointer"
              >
                Same as Month 1
              </Label>
            </div>
          ) : null}
        </div>

        {usesMonth1 ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-lg border border-dashed border-border px-3 py-2 min-h-[2.75rem]">
            {(monthAddresses[1] ?? "").trim()
              ? monthAddresses[1]
              : "Uses Month 1 address once it’s entered."}
          </p>
        ) : (
          <Textarea
            id={fieldId}
            required={isMonth1 || !usesMonth1}
            value={monthAddresses[month] ?? ""}
            onChange={(e) =>
              setMonthAddresses((prev) => ({
                ...prev,
                [month]: e.target.value,
              }))
            }
            placeholder="Street, city, postal code"
            rows={2}
            autoComplete={isMonth1 ? "street-address" : "off"}
          />
        )}
      </div>
    );
  };

  const renderMonthConfigurator = (monthConfig: EarlyAccessMonthConfig) => {
    const state = months[monthConfig.month] ?? emptyMonthState();
    const buildHref = earlyAccessBuildHref(giveaway, monthConfig.month);
    const deliveryIso = monthDeliveryDates[monthConfig.month];

    return (
      <div className="space-y-4">
        {isMultiMonth ? (
          <p className="text-xs text-muted-foreground">
            Delivery:{" "}
            <span className="font-medium text-foreground">
              {formatDisplayDate(deliveryIso)}
            </span>
            {monthConfig.month > 1
              ? " (auto from your Month 1 date)"
              : null}
          </p>
        ) : null}

        {isMultiMonth ? renderMonthAddressField(monthConfig) : null}

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Bouquet style *</legend>
          <div
            className={cn(
              "grid gap-3",
              monthConfig.styles.length >= 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            {monthConfig.styles.map((styleId) => {
              const meta = styleMeta[styleId];
              return (
                <button
                  key={styleId}
                  type="button"
                  onClick={() => handleBouquetSourceChange(monthConfig, styleId)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all min-h-11",
                    state.source === styleId
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="font-medium block">{meta.title}</span>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {meta.description(monthConfig)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {state.source === "tier" ? (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium">Mini bouquet palette *</legend>
            <p className="text-xs text-muted-foreground -mt-1">
              {monthConfig.tierPalette === "early-access"
                ? "Colours limited to current stock: pink, white, and yellow."
                : "Choose colour templates or build a custom palette."}
            </p>
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{miniTier.name}</span>
                <span className="text-primary text-xs font-semibold">Included free</span>
              </div>
              <span className="text-muted-foreground block text-xs mt-0.5">
                {miniTier.description}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4 space-y-4">
              <BouquetPalettePicker
                bouquetId={miniTier.shopBouquetId}
                selection={state.tierPalette}
                onChange={(tierPalette) => updateMonth(monthConfig.month, { tierPalette })}
                minTemplates={1}
                templates={
                  monthConfig.tierPalette === "early-access"
                    ? earlyAccessColorTemplates
                    : undefined
                }
                colors={
                  monthConfig.tierPalette === "early-access"
                    ? earlyAccessPaletteColors
                    : undefined
                }
              />
            </div>
          </fieldset>
        ) : null}

        {state.source === "signature" ? (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium">Choose a preset bouquet *</legend>
            <p className="text-xs text-muted-foreground -mt-1">
              Signature lookbook favourites — Mini size only for this giveaway.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {signatureBouquets.map((bouquet) => (
                <SignatureBouquetCard
                  key={bouquet.id}
                  bouquet={bouquet}
                  singleSelectMode
                  selected={state.signatureId === bouquet.id}
                  onSelect={() =>
                    updateMonth(monthConfig.month, { signatureId: bouquet.id })
                  }
                  selectedSizeId="mini"
                  onSizeChange={() => undefined}
                  hideSizePicker
                  lockedSizeLabel="Mini · included free"
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        {state.source === "custom" ? (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium">Custom mini bouquet *</legend>
            {state.buildDraft ? (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Your custom build is ready</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {state.buildDraft.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated lookbook total ${state.buildDraft.estimatedTotal.toFixed(2)} — this
                  giveaway is still free.
                </p>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to={buildHref}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit custom bouquet
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Build your stems in our customizer, then return here to claim.
                </p>
                <Button asChild className="rounded-full">
                  <Link to={buildHref}>Build your custom bouquet</Link>
                </Button>
              </div>
            )}
          </fieldset>
        ) : null}

        {isMultiMonth ? (
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor={`ea-receiver-notes-m${monthConfig.month}`}>
                Tell us more about the receiver
              </Label>
              <Textarea
                id={`ea-receiver-notes-m${monthConfig.month}`}
                value={state.receiverNotes}
                onChange={(e) =>
                  updateMonth(monthConfig.month, { receiverNotes: e.target.value })
                }
                placeholder="Favorite flowers? Special interests? Meaningful moments?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`ea-notes-m${monthConfig.month}`}>Notes</Label>
              <Textarea
                id={`ea-notes-m${monthConfig.month}`}
                value={state.notes}
                onChange={(e) =>
                  updateMonth(monthConfig.month, { notes: e.target.value })
                }
                placeholder="Delivery instructions, gate codes, card message ideas…"
                rows={3}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  if (submitted) {
    return (
      <Card className="border-0 shadow-elegant bg-card-gradient overflow-hidden">
        <CardContent className="p-8 sm:p-12 text-center space-y-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Heart className="h-8 w-8 fill-primary/20" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              {giveaway.successTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              {giveaway.successBody}
              <span className="block mt-2 text-foreground font-medium">Thank you!</span>
            </p>
            <p className="text-sm text-muted-foreground pt-2">
              Keep an eye on your inbox — a little blush is on its way.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const activeMonthConfig =
    giveaway.months.find((m) => m.month === activeMonth) ?? giveaway.months[0];

  return (
    <Card className="border-0 shadow-elegant bg-card-gradient overflow-hidden">
      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 overflow-x-hidden">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{giveaway.formBadge}</Badge>
              <Badge variant="secondary">Free · no payment</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This invite locks in{" "}
              <span className="font-medium text-foreground">
                {giveaway.monthsCount === 1 ? "1 month" : `${giveaway.monthsCount} months`}
              </span>{" "}
              and{" "}
              <span className="font-medium text-foreground">
                {giveaway.monthsCount === 1 ? "a Mini Bouquet" : "Mini Bouquets"}
              </span>
              . Share your details and we&apos;ll take care of the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ea-name">Full name *</Label>
              <Input
                id="ea-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ea-email">Email *</Label>
              <Input
                id="ea-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ea-phone">Phone</Label>
              <Input
                id="ea-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            {!isMultiMonth ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ea-address">Delivery address *</Label>
                <Textarea
                  id="ea-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, postal code"
                  rows={2}
                  autoComplete="street-address"
                />
              </div>
            ) : null}
            <div className="space-y-2 sm:col-span-2">
              <Label>
                {isMultiMonth ? "Month 1 delivery date *" : "Preferred delivery date *"}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {giveaway.deliveryDateOptions.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setDeliveryDate(date)}
                    className={cn(
                      "rounded-xl border-2 px-3 py-3 text-sm font-medium min-h-11 transition-all",
                      deliveryDate === date
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    {formatDisplayDate(date)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{giveaway.deliveryHint}</p>
              {isMultiMonth ? (
                <div className="rounded-xl border border-border/70 bg-background/50 p-3 space-y-2 text-xs text-muted-foreground">
                  <p>Each month can use its own delivery address — set it in the month cards below.</p>
                  {giveaway.months.map((m) => {
                    const addr = getEffectiveMonthAddress(m.month);
                    const sameNote =
                      m.month > 1 && sameAsMonth1[m.month] ? " · same as Month 1" : "";
                    return (
                      <p key={m.month}>
                        <span className="font-medium text-foreground">{m.label}:</span>{" "}
                        {formatDisplayDate(monthDeliveryDates[m.month])}
                        {addr ? (
                          <span className="block mt-0.5 text-foreground/80 whitespace-pre-wrap">
                            {addr}
                            {sameNote}
                          </span>
                        ) : (
                          <span className="block mt-0.5 italic">Address not set yet</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {isMultiMonth ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {giveaway.months.map((m) => {
                  const state = months[m.month];
                  const ready = state?.source && !validateMonth(m);
                  return (
                    <button
                      key={m.month}
                      type="button"
                      onClick={() => setActiveMonth(m.month)}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-sm font-medium min-h-11 transition-all",
                        activeMonth === m.month
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      {m.label}
                      {ready ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
                <h3 className="font-heading text-lg font-semibold mb-4">
                  Configure {activeMonthConfig.label}
                </h3>
                {renderMonthConfigurator(activeMonthConfig)}
              </div>
            </div>
          ) : (
            renderMonthConfigurator(giveaway.months[0])
          )}

          {!isMultiMonth ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ea-receiver-notes">Tell us more about the receiver</Label>
                <Textarea
                  id="ea-receiver-notes"
                  value={receiverNotes}
                  onChange={(e) => setReceiverNotes(e.target.value)}
                  placeholder="Favorite flowers? Special interests? Meaningful moments?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ea-notes">Notes</Label>
                <Textarea
                  id="ea-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery instructions, gate codes, card message ideas…"
                  rows={3}
                />
              </div>
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full min-h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Claiming…
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                {giveaway.claimCta}
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No payment required — we&apos;ll email you to confirm delivery.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EarlyAccessGiveawayForm;
