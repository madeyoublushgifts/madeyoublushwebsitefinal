import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

type Cadence = "biweekly" | "monthly" | "annual";

type Occasion = {
  id: string;
  type: string;
  label: string;
  date: string;
};

const SITE_URL = (process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? "https://www.madeyoublush.ca").replace(
  /\/$/,
  ""
);

const MIN_LEAD_DAYS = 7;

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function isValidDeliveryDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const chosen = new Date(`${dateStr}T12:00:00`);
  const min = addDays(new Date(), MIN_LEAD_DAYS);
  min.setHours(0, 0, 0, 0);
  return chosen >= min;
}

function getAmountCents(cadence: Cadence): number {
  if (cadence === "annual") return 18500;
  if (cadence === "monthly") {
    return Number(process.env.STRIPE_MONTHLY_AMOUNT_CENTS ?? 3499);
  }
  return Number(process.env.STRIPE_BIWEEKLY_AMOUNT_CENTS ?? 3499);
}

function getRecurring(cadence: Cadence): Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring {
  if (cadence === "annual") {
    return { interval: "year" };
  }
  if (cadence === "monthly") {
    return { interval: "month" };
  }
  return { interval: "week", interval_count: 2 };
}

function getProductName(cadence: Cadence): string {
  if (cadence === "annual") return "Made You Blush — Annual Floral Subscription";
  if (cadence === "monthly") return "Made You Blush — Monthly Floral Subscription";
  return "Made You Blush — Bi-weekly Floral Subscription";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }

  const {
    cadence,
    name,
    email,
    phone,
    address,
    deliveryDate,
    occasions,
    notes,
  } = req.body as {
    cadence?: Cadence;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryDate?: string;
    occasions?: Occasion[];
    notes?: string;
  };

  if (!cadence || !["biweekly", "monthly", "annual"].includes(cadence)) {
    return res.status(400).json({ error: "Choose a subscription cadence." });
  }

  if (!name?.trim() || !email?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "Name, email, and delivery address are required." });
  }

  if (!deliveryDate || !isValidDeliveryDate(deliveryDate)) {
    return res.status(400).json({
      error: `First delivery must be at least ${MIN_LEAD_DAYS} days from today.`,
    });
  }

  const safeOccasions = Array.isArray(occasions) ? occasions : [];
  const occasionsJson = JSON.stringify(safeOccasions);

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-06-24.dahlia",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email.trim(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: getAmountCents(cadence),
            recurring: getRecurring(cadence),
            product_data: {
              name: getProductName(cadence),
              description: `Toronto floral subscription — first delivery ${deliveryDate}`,
            },
          },
        },
      ],
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      metadata: {
        cadence,
        name: name.trim(),
        phone: phone?.trim() ?? "",
        address: address.trim(),
        deliveryDate,
        occasions: occasionsJson,
        notes: notes?.trim() ?? "",
      },
      subscription_data: {
        metadata: {
          cadence,
          name: name.trim(),
          phone: phone?.trim() ?? "",
          address: address.trim(),
          deliveryDate,
          occasions: occasionsJson,
          notes: notes?.trim() ?? "",
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("create-checkout-session:", message);
    return res.status(500).json({ error: message });
  }
}
