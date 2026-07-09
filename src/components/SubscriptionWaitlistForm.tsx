import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OccasionPicker from "@/components/OccasionPicker";
import ShopBouquetCard from "@/components/ShopBouquetCard";
import {
  defaultTierPaletteSelection,
  formatTierPaletteChoice,
  isTierPaletteComplete,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { shopBouquets } from "@/data/shopBouquets";
import { getBouquetTier } from "@/data/bouquetTiers";
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import { subscriptionPlans, type SubscriptionCadence } from "@/data/subscriptionPlans";
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

type BouquetSource = "preset" | "custom";

const SubscriptionWaitlistForm = () => {
  const location = useLocation();
  const [cadence, setCadence] = useState<SubscriptionCadence | "">("");
  const [bouquetSource, setBouquetSource] = useState<BouquetSource | "">("");
  const [tierId, setTierId] = useState("");
  const [tierPalettes, setTierPalettes] = useState<Record<number, TierPaletteSelection>>({});
  const [buildDraft, setBuildDraft] = useState<SubscriptionBuildDraft | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [occasions, setOccasions] = useState<SubscriptionOccasion[]>([]);
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

  const getTierPalette = (bouquetId: number) =>
    tierPalettes[bouquetId] ?? defaultTierPaletteSelection(bouquetId);

  const setTierPaletteForBouquet = (bouquetId: number, next: TierPaletteSelection) => {
    setTierPalettes((prev) => ({ ...prev, [bouquetId]: next }));
  };

  const handleTierSelect = (id: string, shopBouquetId: number) => {
    setTierId(id);
    setTierPalettes((prev) => ({
      ...prev,
      [shopBouquetId]: prev[shopBouquetId] ?? defaultTierPaletteSelection(shopBouquetId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cadence) {
      toast({
        title: "Choose a delivery cadence",
        description: "Select bi-weekly, monthly, or annual.",
        variant: "destructive",
      });
      return;
    }

    if (!bouquetSource) {
      toast({
        title: "How would you like your bouquets?",
        description: "Pick a shop tier or choose build-your-own.",
        variant: "destructive",
      });
      return;
    }

    if (bouquetSource === "preset") {
      if (!tierId) {
        toast({
          title: "Choose a bouquet tier",
          description: "Select which tier you'd like for your subscription.",
          variant: "destructive",
        });
        return;
      }

      if (!isTierPaletteComplete(getTierPalette(selectedTier.shopBouquetId), selectedTier.shopBouquetId)) {
        const palette = getTierPalette(selectedTier.shopBouquetId);
        toast({
          title: "Choose a palette",
          description:
            palette.mode === "template"
              ? "Select a colour template, or switch to the colour picker."
              : "Pick at least one colour for your bouquet tier.",
          variant: "destructive",
        });
        return;
      }
    }

    if (bouquetSource === "custom" && !buildDraft) {
      toast({
        title: "Build your subscription bouquet",
        description: "Use the subscription builder to describe your custom stems.",
        variant: "destructive",
      });
      return;
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
      cadence === "biweekly" ? "Bi-weekly" : cadence === "monthly" ? "Monthly" : "Annual";

    const paletteLabel =
      bouquetSource === "preset" && selectedTier
        ? formatTierPaletteChoice(
            getTierPalette(selectedTier.shopBouquetId),
            selectedTier.shopBouquetId
          )
        : "";

    const tierSummary =
      bouquetSource === "preset" && selectedTier
        ? `${selectedTier.name} (${selectedTier.priceLabel})${paletteLabel ? ` — ${paletteLabel}` : ""}`
        : buildDraft
          ? `Custom build (est. $${buildDraft.estimatedTotal.toFixed(2)}/delivery) — ${buildDraft.summary}`
          : "Custom build";

    setIsSubmitting(true);

    try {
      await submitToFormspree("waitlist", {
        _subject: "Floral subscription waitlist — Made You Blush",
        _replyto: email,
        source: "Subscription page",
        name,
        email,
        phone,
        deliveryAddress: address,
        cadence: cadenceLabel,
        firstDeliveryDate: deliveryDate,
        bouquetSource: bouquetSource === "preset" ? "Shop tier" : "Subscription custom build",
        bouquetTier: tierSummary,
        occasions: occasions.length
          ? occasions
              .map((o) => `${o.type}: ${o.label} (${o.date})`)
              .join("; ")
          : "None added",
        bouquetNotes: notes,
      });

      toast({
        title: "You're on the waitlist!",
        description:
          "Thanks for your interest. We'll email you when subscription delivery opens with your preferences saved.",
      });

      clearSubscriptionBuildDraft();
      setCadence("");
      setBouquetSource("");
      setTierId("");
      setTierPalettes({});
      setBuildDraft(null);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDeliveryDate(minDeliveryDate);
      setOccasions([]);
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
    <Card className="border-0 shadow-elegant bg-card-gradient">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Delivery cadence *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subscriptionPlans.map((plan) => {
                const selected = cadence === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setCadence(plan.id)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium">{plan.label}</span>
                      {plan.badge ? (
                        <Badge className="text-[10px] uppercase tracking-wide">
                          {plan.badge}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Your bouquet style *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setBouquetSource("preset");
                  setTierId("");
                  setTierPalettes({});
                  setBuildDraft(null);
                  clearSubscriptionBuildDraft();
                }}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  bouquetSource === "preset"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="font-medium block">Preset shop bouquets</span>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Same tiers as the shop—pick a bouquet and colour template or palette
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBouquetSource("custom");
                  setTierId("");
                  setTierPalettes({});
                }}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  bouquetSource === "custom"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="font-medium block">Build a bouquet</span>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Custom stems for your subscription — separate from shop orders
                </span>
              </button>
            </div>
          </fieldset>

          {bouquetSource === "preset" ? (
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">
                Choose a preset bouquet &amp; palette *
              </legend>
              <p className="text-xs text-muted-foreground -mt-1">
                Select a tier, then pick a colour template or use the colour picker—just like the
                shop page.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
                {shopBouquets.map((bouquet) => (
                  <ShopBouquetCard
                    key={bouquet.id}
                    bouquet={bouquet}
                    palette={getTierPalette(bouquet.id)}
                    onPaletteChange={(next) => {
                      setTierPaletteForBouquet(bouquet.id, next);
                      if (tierId !== bouquet.tierId) {
                        setTierId(bouquet.tierId);
                      }
                    }}
                    selected={tierId === bouquet.tierId}
                    onSelect={() => handleTierSelect(bouquet.tierId, bouquet.id)}
                  />
                ))}
              </div>
              {!tierId ? (
                <p className="text-xs text-muted-foreground text-center">
                  Tap a bouquet card above to select your subscription tier.
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {bouquetSource === "custom" ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 space-y-3 text-sm">
              {buildDraft ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">Your subscription build</p>
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
                </>
              ) : (
                <>
                  <Flower className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
                  <span className="text-muted-foreground">
                    Use our subscription-only builder to pick stems, wrap, and add-ons for recurring
                    delivery.
                  </span>
                  <Button asChild type="button" variant="secondary" size="sm" className="mt-2">
                    <Link to="/subscription/build-bouquet">Open subscription builder</Link>
                  </Button>
                </>
              )}
            </div>
          ) : null}

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

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Joining waitlist…
              </>
            ) : (
              <>
                <BellRing className="mr-2 h-5 w-5" />
                Join subscription waitlist
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No payment today — pricing follows your bouquet tier or custom build. We&apos;ll email you
            when subscriptions launch.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionWaitlistForm;
