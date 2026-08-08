import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Readable } from "node:stream";
import Stripe from "stripe";
import { resolveOrderCustomerNames } from "./lib/orderCustomerNames.js";
import {
  buildPaidOrderCustomerEmail,
  buildPaidOrderMerchantEmail,
  formatCadFromCents,
  sendCustomerAndMerchantEmails,
} from "./lib/sendOrderEmails.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error("stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Stripe webhook is not configured." });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-06-24.dahlia",
  });

  let event: Stripe.Event;
  try {
    const rawBody = await buffer(req);
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({ error: "Missing Stripe signature." });
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("stripe-webhook: signature verification failed:", message);
    return res.status(400).json({ error: `Webhook Error: ${message}` });
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // One-time paid orders only (subscriptions use a different checkout flow).
    const orderType = session.metadata?.orderType;
    if (session.mode !== "payment" || (orderType && orderType !== "one_time")) {
      return res.status(200).json({ received: true, ignored: "not_one_time" });
    }

    const meta = session.metadata ?? {};
    const customerEmail =
      session.customer_details?.email?.trim() ||
      session.customer_email?.trim() ||
      "";
    const { customerName, recipientName } = resolveOrderCustomerNames(session);

    if (!customerEmail) {
      console.error("stripe-webhook: checkout session missing customer email", session.id);
      // Acknowledge so Stripe does not retry forever for unrecoverable data.
      return res.status(200).json({ received: true, skipped: "missing_email" });
    }

    let orderSummary = meta.orderSummary?.trim() || "";
    if (!orderSummary) {
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 20,
        });
        orderSummary = lineItems.data
          .map((item) => `${item.description ?? "Item"} × ${item.quantity ?? 1}`)
          .join(" | ")
          .slice(0, 500);
      } catch (lineErr) {
        console.error("stripe-webhook: failed to load line items:", lineErr);
      }
    }

    const amountLabel = formatCadFromCents(session.amount_total);
    const subtotalLabel = meta.subtotalCents
      ? formatCadFromCents(meta.subtotalCents)
      : undefined;
    const handlingFeeLabel = meta.handlingFeeCents
      ? formatCadFromCents(meta.handlingFeeCents)
      : undefined;

    const details = {
      customerName,
      customerEmail,
      recipientName,
      phone: meta.phone,
      address: meta.address,
      deliveryDate: meta.deliveryDate,
      orderSummary,
      notes: meta.notes,
      amountLabel,
      subtotalLabel,
      handlingFeeLabel,
      sessionId: session.id,
    };

    const customerEmailContent = buildPaidOrderCustomerEmail(details);
    const merchantEmailContent = buildPaidOrderMerchantEmail(details);

    await sendCustomerAndMerchantEmails({
      customerEmail,
      customerName,
      subjectCustomer: "Your Made You Blush order is confirmed",
      subjectMerchant: `New order — ${customerName}`,
      htmlCustomer: customerEmailContent.html,
      htmlMerchant: merchantEmailContent.html,
      textCustomer: customerEmailContent.text,
      textMerchant: merchantEmailContent.text,
      idempotencyKeyCustomer: `order-customer-${session.id}`,
      idempotencyKeyMerchant: `order-merchant-${session.id}`,
    });

    return res.status(200).json({ received: true, emailed: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    console.error("stripe-webhook: order email error:", message, session.id);
    // Return 500 so Stripe retries transient Resend/network failures.
    // Idempotency keys on Resend prevent duplicate customer/merchant emails.
    return res.status(500).json({ received: true, emailed: false, error: message });
  }
}
