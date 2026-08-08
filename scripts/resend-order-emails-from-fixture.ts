/**
 * Send paid-order confirmation emails from a Checkout Session JSON fixture
 * (same builders as api/stripe-webhook.ts). No Stripe charge.
 *
 *   $env:ORDER_EMAIL_OVERRIDE="info@madeyoublush.ca"
 *   npx tsx scripts/resend-order-emails-from-fixture.ts scripts/_njere-session-fixture.json
 */
import fs from "node:fs";
import { resolveOrderCustomerNames } from "../api/lib/orderCustomerNames.js";
import {
  buildPaidOrderCustomerEmail,
  buildPaidOrderMerchantEmail,
  formatCadFromCents,
  sendCustomerAndMerchantEmails,
} from "../api/lib/sendOrderEmails.js";

type SessionFixture = {
  id: string;
  mode: string;
  payment_status?: string;
  amount_total: number;
  customer_email?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  metadata?: Record<string, string> | null;
};

async function main() {
  const fixturePath = process.argv[2];
  if (!fixturePath || !fs.existsSync(fixturePath)) {
    console.error("Usage: npx tsx scripts/resend-order-emails-from-fixture.ts <fixture.json>");
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.error("RESEND_API_KEY missing in environment.");
    process.exit(1);
  }

  const session = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as SessionFixture;
  const orderType = session.metadata?.orderType;
  if (session.mode !== "payment" || (orderType && orderType !== "one_time")) {
    console.error("Fixture ignored by webhook rules:", { mode: session.mode, orderType });
    process.exit(1);
  }

  const meta = session.metadata ?? {};
  const originalCustomerEmail =
    session.customer_details?.email?.trim() || session.customer_email?.trim() || "";
  const { customerName, recipientName } = resolveOrderCustomerNames(session);

  if (!originalCustomerEmail) {
    console.error("Fixture missing customer email");
    process.exit(1);
  }

  const override = process.env.ORDER_EMAIL_OVERRIDE?.trim();
  const customerEmail = override || originalCustomerEmail;
  if (override) {
    process.env.ORDER_NOTIFY_EMAIL = override;
    console.log("Override: customer + merchant both ->", override);
    console.log(
      "Original customer (not emailed):",
      originalCustomerEmail.replace(/(^.).*(@.*)/, "$1***$2")
    );
  }

  const orderSummary = meta.orderSummary?.trim() || "";
  const details = {
    customerName,
    customerEmail: originalCustomerEmail,
    recipientName,
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
  console.log("Resolved names:", { customerName, recipientName: recipientName ?? "(none)" });

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
