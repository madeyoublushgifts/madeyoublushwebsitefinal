import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OccasionPicker from "@/components/OccasionPicker";
import {
  formatDisplayDate,
  getMinDeliveryDate,
  isDeliveryDateValid,
} from "@/data/subscriptionDates";
import { subscriptionPlans, type SubscriptionCadence } from "@/data/subscriptionPlans";
import { bouquetTiers } from "@/data/bouquetTiers";
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import { submitToFormspree } from "@/lib/formspree";
import { toast } from "@/hooks/use-toast";
import { BellRing, Flower, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const minDeliveryDate = getMinDeliveryDate();

type BouquetSource = "preset" | "custom";

const SubscriptionWaitlistForm = () => {
  const [cadence, setCadence] = useState<SubscriptionCadence | "">("");
  const [bouquetSource, setBouquetSource] = useState<BouquetSource | "">("");
  const [tierId, setTierId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [occasions, setOccasions] = useState<SubscriptionOccasion[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (bouquetSource === "preset" && !tierId) {
      toast({
        title: "Choose a bouquet tier",
        description: "Select which tier you'd like for your subscription.",
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

    const tier = bouquetTiers.find((t) => t.id === tierId);
    const cadenceLabel =
      cadence === "biweekly" ? "Bi-weekly" : cadence === "monthly" ? "Monthly" : "Annual";

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
        bouquetSource: bouquetSource === "preset" ? "Shop tier" : "Build a bouquet",
        bouquetTier: bouquetSource === "preset" ? tier?.name ?? tierId : "Custom build",
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

      setCadence("");
      setBouquetSource("");
      setTierId("");
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
                    {plan.priceLabel ? (
                      <p className="text-primary font-semibold text-sm">{plan.priceLabel}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pricing coming soon</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
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
                }}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  bouquetSource === "preset"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="font-medium block">Shop bouquet tier</span>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Pick a preset tier from our shop lineup
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBouquetSource("custom");
                  setTierId("");
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
                  Custom stems, wrap & add-ons —{" "}
                  <Link to="/create-bouquet" className="text-primary underline-offset-4 hover:underline">
                    try the builder
                  </Link>
                </span>
              </button>
            </div>
          </fieldset>

          {bouquetSource === "preset" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Choose bouquet tier *</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bouquetTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setTierId(tier.id)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left text-sm transition-all",
                      tierId === tier.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <span className="font-medium">{tier.name}</span>
                    <span className="text-muted-foreground block text-xs mt-0.5">
                      {tier.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {bouquetSource === "custom" ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
              <Flower className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
              Describe your ideal custom build in notes below, or{" "}
              <Link to="/create-bouquet" className="text-primary underline-offset-4 hover:underline">
                build a bouquet now
              </Link>{" "}
              to explore stems and pricing.
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
              placeholder="Colours, allergies, custom build details, gift vs self-care…"
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
            No payment today — we&apos;ll reach out when subscriptions launch. Annual plan: $185/year.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionWaitlistForm;
