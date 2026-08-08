import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BouquetPalettePicker from "@/components/BouquetPalettePicker";
import {
  defaultTierPaletteSelection,
  type TierPaletteSelection,
} from "@/data/bouquetTierColors";
import { getBouquetTier } from "@/data/bouquetTiers";
import {
  earlyAccessColorTemplates,
  earlyAccessPaletteColors,
  formatEarlyAccessPaletteChoice,
  isEarlyAccessPaletteComplete,
} from "@/data/earlyAccessStock";
import { formatDisplayDate } from "@/data/subscriptionDates";
import { submitToFormbricksEarlyAccess } from "@/lib/formbricks";
import {
  clearSubscriptionBuildDraft,
  loadSubscriptionBuildDraft,
  type SubscriptionBuildDraft,
} from "@/lib/subscriptionBuildDraft";
import { toast } from "@/hooks/use-toast";
import { Gift, Heart, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/** Fixed giveaway delivery window. */
const DELIVERY_DATE_OPTIONS = ["2026-08-14", "2026-08-15", "2026-08-16"] as const;
const DEFAULT_DELIVERY_DATE = DELIVERY_DATE_OPTIONS[0];

const miniTier = getBouquetTier("mini")!;

export const EARLY_ACCESS_PATH = "/early-access/monthly-mini";

type BouquetSource = "tier" | "custom";

const bouquetStyleOptions: {
  id: BouquetSource;
  title: string;
  description: string;
}[] = [
  {
    id: "tier",
    title: "Bouquet tier",
    description: "Mini size with pink, white & yellow palettes from current stock",
  },
  {
    id: "custom",
    title: "Build your custom bouquet",
    description: "Daisy, roses, carnations, eucalyptus stem & fillers from current stock",
  },
];

const EarlyAccessGiveawayForm = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [bouquetSource, setBouquetSource] = useState<BouquetSource | "">("");
  const [tierPalette, setTierPalette] = useState<TierPaletteSelection>(
    defaultTierPaletteSelection(miniTier.shopBouquetId)
  );
  const [buildDraft, setBuildDraft] = useState<SubscriptionBuildDraft | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<string>(DEFAULT_DELIVERY_DATE);
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

  const handleBouquetSourceChange = (source: BouquetSource) => {
    setBouquetSource(source);
    setTierPalette(defaultTierPaletteSelection(miniTier.shopBouquetId));
    if (source === "custom") {
      setBuildDraft(loadSubscriptionBuildDraft());
    } else {
      setBuildDraft(null);
      clearSubscriptionBuildDraft();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bouquetSource) {
      toast({
        title: "How would you like your bouquet?",
        description: "Pick a bouquet tier or build your custom bouquet.",
        variant: "destructive",
      });
      return;
    }

    if (bouquetSource === "tier" && !isEarlyAccessPaletteComplete(tierPalette)) {
      toast({
        title: "Choose a palette",
        description:
          tierPalette.mode === "template"
            ? "Select at least one colour template, or switch to the colour picker."
            : "Pick at least one colour for your mini bouquet.",
        variant: "destructive",
      });
      return;
    }

    if (bouquetSource === "custom" && !buildDraft) {
      toast({
        title: "Build your custom bouquet",
        description: "Use the builder to describe your custom stems, then return here.",
        variant: "destructive",
      });
      return;
    }

    if (
      !DELIVERY_DATE_OPTIONS.includes(
        deliveryDate as (typeof DELIVERY_DATE_OPTIONS)[number]
      )
    ) {
      toast({
        title: "Choose a delivery date",
        description: "Please pick August 14, 15, or 16.",
        variant: "destructive",
      });
      return;
    }

    const sourceLabel =
      bouquetSource === "tier" ? "Bouquet tier (Mini)" : "Custom bouquet (Mini)";

    const bouquetSummary =
      bouquetSource === "tier"
        ? `Mini Bouquet — ${formatEarlyAccessPaletteChoice(tierPalette)}`
        : buildDraft
          ? `Custom mini build (est. $${buildDraft.estimatedTotal.toFixed(2)}) — ${buildDraft.summary}`
          : "Custom mini build";

    setIsSubmitting(true);

    const claimPayload = {
      name,
      email,
      phone,
      deliveryAddress: address,
      firstDeliveryDate: deliveryDate,
      bouquetSource: sourceLabel,
      bouquetDetails: bouquetSummary,
      receiverNotes,
      bouquetNotes: notes,
    };

    try {
      await submitToFormbricksEarlyAccess(claimPayload);

      clearSubscriptionBuildDraft();
      setSubmitted(true);

      // Emails are best-effort after Formbricks success (secrets stay server-side).
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
              Order confirmed!
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              We&apos;ll be in touch soon with your free mini bouquet details.
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

  return (
    <Card className="border-0 shadow-elegant bg-card-gradient overflow-hidden">
      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 overflow-x-hidden">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Early access giveaway</Badge>
              <Badge variant="secondary">Free · no payment</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This invite locks in <span className="font-medium text-foreground">1 month</span> and a{" "}
              <span className="font-medium text-foreground">Mini Bouquet</span>. Share your details and
              we&apos;ll take care of the rest.
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Bouquet style *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {bouquetSource === "tier" ? (
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Mini bouquet palette *</legend>
              <p className="text-xs text-muted-foreground -mt-1">
                Colours limited to current stock: pink, white, and yellow.
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
                  selection={tierPalette}
                  onChange={setTierPalette}
                  minTemplates={1}
                  templates={earlyAccessColorTemplates}
                  colors={earlyAccessPaletteColors}
                />
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label htmlFor="ea-receiver-notes">Tell us more about the receiver</Label>
                  <Textarea
                    id="ea-receiver-notes"
                    value={receiverNotes}
                    onChange={(e) => setReceiverNotes(e.target.value)}
                    placeholder="Favorite flowers? Special interests? Meaningful moments?"
                    rows={3}
                  />
                </div>
              </div>
            </fieldset>
          ) : null}

          {bouquetSource === "custom" ? (
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium">Custom mini bouquet *</legend>
              {buildDraft ? (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Your custom build is ready</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{buildDraft.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated lookbook total ${buildDraft.estimatedTotal.toFixed(2)} — this giveaway
                    is still free.
                  </p>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link to={`${EARLY_ACCESS_PATH}/build`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit custom bouquet
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Build your stems in our customizer, then return here to claim your free bouquet.
                  </p>
                  <Button asChild className="rounded-full">
                    <Link to={`${EARLY_ACCESS_PATH}/build`}>Build your custom bouquet</Link>
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="ea-receiver-notes-custom">Tell us more about the receiver</Label>
                <Textarea
                  id="ea-receiver-notes-custom"
                  value={receiverNotes}
                  onChange={(e) => setReceiverNotes(e.target.value)}
                  placeholder="Favorite flowers? Special interests? Meaningful moments?"
                  rows={3}
                />
              </div>
            </fieldset>
          ) : null}

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
            <div className="space-y-2 sm:col-span-2">
              <Label>Preferred delivery date *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DELIVERY_DATE_OPTIONS.map((date) => (
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
              <p className="text-xs text-muted-foreground">
                Choose August 14, 15, or 16 for your complimentary delivery.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
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
                Claim free bouquet
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
