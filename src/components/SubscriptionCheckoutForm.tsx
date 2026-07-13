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
import type { SubscriptionOccasion } from "@/data/subscriptionOccasions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const minDeliveryDate = getMinDeliveryDate();

/**
 * Legacy paid-subscription form. Live subscriptions use the waitlist on /subscription.
 * Kept for backwards compatibility if routes are re-enabled later.
 */
const SubscriptionCheckoutForm = () => {
  const [cadence, setCadence] = useState<SubscriptionCadence | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);
  const [occasions, setOccasions] = useState<SubscriptionOccasion[]>([]);
  const [notes, setNotes] = useState("");

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

    toast({
      title: "Subscriptions are on the waitlist",
      description:
        "Paid recurring checkout isn’t live yet — join the waitlist on the Subscription page.",
    });
  };

  return (
    <Card className="border-0 shadow-elegant bg-card-gradient">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
          Recurring Stripe checkout isn’t live yet.{" "}
          <Link
            to="/subscription#waitlist"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Join the subscription waitlist
          </Link>{" "}
          (no payment today).
        </div>

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
                placeholder="(416) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-date">First delivery *</Label>
              <Input
                id="sub-date"
                type="date"
                min={minDeliveryDate}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Earliest: {formatDisplayDate(minDeliveryDate)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub-address">Delivery address *</Label>
            <Textarea
              id="sub-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              placeholder="Street, city, postal code"
            />
          </div>

          <OccasionPicker value={occasions} onChange={setOccasions} />

          <div className="space-y-2">
            <Label htmlFor="sub-notes">Notes (optional)</Label>
            <Textarea
              id="sub-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Preferences, allergies, gate codes…"
            />
          </div>

          <Button asChild type="button" className="w-full" size="lg">
            <Link to="/subscription#waitlist">Go to subscription waitlist</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCheckoutForm;
