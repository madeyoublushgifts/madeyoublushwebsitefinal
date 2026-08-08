/**
 * One-off: load a paid Checkout Session from Stripe and send the same
 * customer + merchant confirmation emails as api/stripe-webhook.ts.
 *
 *   npx tsx --env-file=.env.vercel.prod.tmp scripts/resend-order-emails-once.ts cs_live_...
 *
 * Set ORDER_EMAIL_OVERRIDE=info@madeyoublush.ca to route BOTH emails there
 * (avoids re-emailing the original customer). Does not charge again.
 */
import Stripe from "stripe";
import {
  buildPaidOrderCustomerEmail,
  buildPaidOrderMerchantEmail,
  formatCadFromCents,
  sendCustomerAndMerchantEmails,
} from "../api/lib/sendOrderEmails.js";

async function main() {
  const sessionId = process.argv[2];
  if (!sessionId?.startsWith("cs_")) {
    console.error(
      "Usage: npx tsx --env-file=.env.vercel.prod.tmp scripts/resend-order-emails-once.ts <cs_...>"
    );
    process.exit(1);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey?.startsWith("sk_")) {
    console.error("STRIPE_SECRET_KEY missing or invalid shape.");
    process.exit(1);
  }
  if (!process.env.RESEND_API_KEY?.trim()) {
    console.error("RESEND_API_KEY missing.");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const orderType = session.metadata?.orderType;
  if (session.mode !== "payment" || (orderType && orderType !== "one_time")) {
    console.error("Session ignored by webhook rules:", {
      mode: session.mode,
      orderType,
      payment_status: session.payment_status,
    });
    process.exit(1);
  }

  const meta = session.metadata ?? {};
  const originalCustomerEmail =
    session.customer_details?.email?.trim() || session.customer_email?.trim() || "";
  const customerName =
    meta.name?.trim() || session.customer_details?.name?.trim() || "Customer";

  if (!originalCustomerEmail) {
    console.error("Session missing customer email");
    process.exit(1);
  }

  let orderSummary = meta.orderSummary?.trim() || "";
  if (!orderSummary) {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });
    orderSummary = lineItems.data
      .map((item) => `${item.description ?? "Item"} × ${item.quantity ?? 1}`)
      .join(" | ")
      .slice(0, 500);
  }

  const override = process.env.ORDER_EMAIL_OVERRIDE?.trim();
  const customerEmail = override || originalCustomerEmail;
  if (override) {
    process.env.ORDER_NOTIFY_EMAIL = override;
    console.log("Override: customer + merchant both ->", override);
    const masked = originalCustomerEmail.replace(/(^.).*(@.*)/, "$1***$2");
    console.log("Original customer (not emailed):", masked);
  }

  const details = {
    customerName,
    customerEmail: originalCustomerEmail,
    phone: meta.phone,
    address: meta.address,
    deliveryDate: meta.deliveryDate,
    orderSummary,
    notes: meta.notes,
    amountLabel: formatCadFromCents(session.amount_total),
    subtotalLabel: meta.subtotalCents ? formatCadFromCents(meta.subtotalCents) : undefined,
    handlingFeeLabel: meta.handlingFeeCents
      ? formatCadFromCents(meta.handlingFeeCents)
      : undefined,
    sessionId: session.id,
  };

  const customerEmailContent = buildPaidOrderCustomerEmail(details);
  const merchantEmailContent = buildPaidOrderMerchantEmail(details);

  const stamp = Date.now();
  const result = await sendCustomerAndMerchantEmails({
    customerEmail,
    customerName,
    subjectCustomer: "Your Made You Blush order is confirmed",
    subjectMerchant: `New order — ${customerName}`,
    htmlCustomer: customerEmailContent.html,
    htmlMerchant: merchantEmailContent.html,
    textCustomer: customerEmailContent.text,
    textMerchant: merchantEmailContent.text,
    idempotencyKeyCustomer: `order-customer-replay-${session.id}-${stamp}`,
    idempotencyKeyMerchant: `order-merchant-replay-${session.id}-${stamp}`,
  });

  console.log("Emails sent successfully.");
  console.log("customerId:", result.customerId ?? "(none)");
  console.log("merchantId:", result.merchantId ?? "(none)");
  console.log("session:", session.id);
  console.log("payment_status:", session.payment_status);
  console.log("amount:", details.amountLabel);
  console.log("has_orderSummary:", Boolean(orderSummary));
  console.log("has_address:", Boolean(meta.address));
  console.log("has_deliveryDate:", Boolean(meta.deliveryDate));
}

main().catch((err) => {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
