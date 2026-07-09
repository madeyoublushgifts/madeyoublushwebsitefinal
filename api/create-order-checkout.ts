import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

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
    name,
    email,
    phone,
    address,
    deliveryDate,
    itemName,
    itemSummary,
    amountCents,
    source,
    notes,
  } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryDate?: string;
    itemName?: string;
    itemSummary?: string;
    amountCents?: number;
    source?: "shop" | "build";
    notes?: string;
  };

  if (!name?.trim() || !email?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "Name, email, and delivery address are required." });
  }

  if (!itemName?.trim() || !amountCents || amountCents < 100) {
    return res.status(400).json({ error: "Invalid order total." });
  }

  if (!deliveryDate || !isValidDeliveryDate(deliveryDate)) {
    return res.status(400).json({
      error: `Delivery must be at least ${MIN_LEAD_DAYS} days from today.`,
    });
  }

  if (source !== "shop" && source !== "build") {
    return res.status(400).json({ error: "Invalid order source." });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-06-24.dahlia",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: Math.round(amountCents),
            product_data: {
              name: itemName.trim(),
              description: `Delivery ${deliveryDate} · ${source === "build" ? "Custom bouquet" : "Shop order"}`,
            },
          },
        },
      ],
      success_url: `${SITE_URL}/checkout/success?type=order&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      metadata: {
        orderType: "one_time",
        source,
        name: name.trim(),
        phone: phone?.trim() ?? "",
        address: address.trim(),
        deliveryDate,
        itemSummary: itemSummary?.trim() ?? itemName.trim(),
        notes: notes?.trim() ?? "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("create-order-checkout:", message);
    return res.status(500).json({ error: message });
  }
}
