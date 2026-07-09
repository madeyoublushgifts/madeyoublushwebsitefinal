import { useState } from "react";
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
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import { redirectToStripeCheckout } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const minDeliveryDate = getMinDeliveryDate();

const SubscriptionCheckoutForm = () => {
  const [cadence, setCadence] = useState<SubscriptionCadence | "">("");
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
        title: "Choose a plan",
        description: "Select bi-weekly, monthly, or annual delivery.",
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

    setIsSubmitting(true);

    try {
      await redirectToStripeCheckout({
        cadence,
        name,
        email,
        phone,
        address,
        deliveryDate,
        occasions,
        notes,
      });
    } catch (err) {
      toast({
        title: "Checkout could not start",
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
            <legend className="text-sm font-medium">Choose your plan *</legend>
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
                    <p className="text-primary font-semibold text-sm">{plan.priceLabel}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sub-name">Full name *</Label>
              <Input
                id="sub-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-email">Email *</Label>
              <Input
                id="sub-email"
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
              <Label htmlFor="sub-phone">Phone (optional)</Label>
              <Input
                id="sub-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 647-550-8476"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-delivery-date">First delivery date *</Label>
              <Input
                id="sub-delivery-date"
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
            <Label htmlFor="sub-address">Delivery address *</Label>
            <Input
              id="sub-address"
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
            <Label htmlFor="sub-notes">Bouquet style or notes</Label>
            <Textarea
              id="sub-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mini vs standard, colours, allergies, gift vs self-care…"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting to secure checkout…
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Continue to Stripe checkout
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment by Stripe · CAD · Cancel anytime from your Stripe receipt
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCheckoutForm;
