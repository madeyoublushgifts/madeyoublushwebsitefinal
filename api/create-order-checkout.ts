import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import {
  calculateHandlingFeeCents,
  HANDLING_FEE_LABEL,
} from "../src/lib/orderFees";

const SITE_URL = (process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? "https://www.madeyoublush.ca").replace(
  /\/$/,
  ""
);

const MIN_LEAD_DAYS = 7;

type CheckoutLineItem = {
  itemName?: string;
  itemSummary?: string;
  amountCents?: number;
  source?: "shop" | "build";
};

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

function normalizeItems(body: Record<string, unknown>): CheckoutLineItem[] {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items as CheckoutLineItem[];
  }

  const { itemName, itemSummary, amountCents, source } = body;
  if (itemName && amountCents) {
    return [{ itemName, itemSummary, amountCents, source } as CheckoutLineItem];
  }

  return [];
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

  const body = (req.body ?? {}) as Record<string, unknown>;
  const { name, email, phone, address, deliveryDate, notes } = body as {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    deliveryDate?: string;
    notes?: string;
  };

  if (!name?.trim() || !email?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "Name, email, and delivery address are required." });
  }

  const items = normalizeItems(body);
  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  for (const item of items) {
    if (!item.itemName?.trim() || !item.amountCents || item.amountCents < 100) {
      return res.status(400).json({ error: "One or more cart items has an invalid price." });
    }
    if (item.source !== "shop" && item.source !== "build") {
      return res.status(400).json({ error: "Invalid order source on a cart item." });
    }
  }

  const subtotalCents = items.reduce((sum, item) => sum + Math.round(item.amountCents ?? 0), 0);
  if (subtotalCents < 100) {
    return res.status(400).json({ error: "Invalid order total." });
  }

  const handlingFeeCents = calculateHandlingFeeCents(subtotalCents);

  if (!deliveryDate || !isValidDeliveryDate(deliveryDate)) {
    return res.status(400).json({
      error: `Delivery must be at least ${MIN_LEAD_DAYS} days from today.`,
    });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-06-24.dahlia",
  });

  const orderSummary = items
    .map((item) => {
      const label = item.itemSummary?.trim() || item.itemName?.trim() || "Item";
      return `${item.itemName?.trim()}: ${label}`;
    })
    .join(" | ")
    .slice(0, 500);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim(),
      line_items: [
        ...items.map((item) => ({
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: Math.round(item.amountCents!),
            product_data: {
              name: item.itemName!.trim(),
              description:
                item.itemSummary?.trim() ||
                `${item.source === "build" ? "Custom bouquet" : "Shop bouquet"} · Delivery ${deliveryDate}`,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: handlingFeeCents,
            product_data: {
              name: HANDLING_FEE_LABEL,
              description: "Order handling fee",
            },
          },
        },
      ],
      success_url: `${SITE_URL}/checkout/success?type=order&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      metadata: {
        orderType: "one_time",
        itemCount: String(items.length),
        name: name.trim(),
        phone: phone?.trim() ?? "",
        address: address.trim(),
        deliveryDate,
        orderSummary,
        subtotalCents: String(subtotalCents),
        handlingFeeCents: String(handlingFeeCents),
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
