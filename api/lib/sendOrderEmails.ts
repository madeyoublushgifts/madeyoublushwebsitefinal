import { Resend } from "resend";

const DEFAULT_FROM_EMAIL = "info@madeyoublush.ca";
const DEFAULT_NOTIFY_EMAIL = "info@madeyoublush.ca";
const FROM_NAME = "Made You Blush";

export type SendCustomerAndMerchantEmailsArgs = {
  customerEmail: string;
  customerName?: string;
  subjectCustomer: string;
  subjectMerchant: string;
  htmlCustomer: string;
  htmlMerchant: string;
  /** Optional Resend idempotency keys (e.g. Stripe session id). */
  idempotencyKeyCustomer?: string;
  idempotencyKeyMerchant?: string;
};

function getFromAddress(): string {
  const email = (process.env.ORDER_FROM_EMAIL ?? DEFAULT_FROM_EMAIL).trim() || DEFAULT_FROM_EMAIL;
  return `${FROM_NAME} <${email}>`;
}

function getMerchantNotifyEmail(): string {
  return (process.env.ORDER_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL).trim() || DEFAULT_NOTIFY_EMAIL;
}

export async function sendCustomerAndMerchantEmails({
  customerEmail,
  subjectCustomer,
  subjectMerchant,
  htmlCustomer,
  htmlMerchant,
  idempotencyKeyCustomer,
  idempotencyKeyMerchant,
}: SendCustomerAndMerchantEmailsArgs): Promise<{
  customerId?: string;
  merchantId?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const toCustomer = customerEmail.trim();
  if (!toCustomer) {
    throw new Error("Customer email is required.");
  }

  const resend = new Resend(apiKey);
  const from = getFromAddress();
  const merchantTo = getMerchantNotifyEmail();

  const [customerResult, merchantResult] = await Promise.all([
    resend.emails.send(
      {
        from,
        to: [toCustomer],
        subject: subjectCustomer,
        html: htmlCustomer,
      },
      idempotencyKeyCustomer ? { idempotencyKey: idempotencyKeyCustomer } : undefined
    ),
    resend.emails.send(
      {
        from,
        to: [merchantTo],
        subject: subjectMerchant,
        html: htmlMerchant,
      },
      idempotencyKeyMerchant ? { idempotencyKey: idempotencyKeyMerchant } : undefined
    ),
  ]);

  if (customerResult.error) {
    throw new Error(`Customer email failed: ${customerResult.error.message}`);
  }
  if (merchantResult.error) {
    throw new Error(`Merchant email failed: ${merchantResult.error.message}`);
  }

  return {
    customerId: customerResult.data?.id,
    merchantId: merchantResult.data?.id,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | undefined | null): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0e4e8;vertical-align:top;width:140px;color:#8a6b74;font-size:13px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0e4e8;color:#3d2c2e;font-size:14px;line-height:1.5;">
        ${escapeHtml(trimmed).replace(/\n/g, "<br />")}
      </td>
    </tr>`;
}

export function formatCadFromCents(cents: number | string | null | undefined): string {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n / 100);
}

export function wrapBrandedEmail(opts: {
  title: string;
  intro: string;
  rowsHtml: string;
  footerNote?: string;
}): string {
  const footer =
    opts.footerNote?.trim() ||
    "Questions? Reply to this email or write to info@madeyoublush.ca.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#faf4f6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f0e4e8;">
          <tr>
            <td style="background:linear-gradient(135deg,#f7d6df 0%,#f3ebe8 100%);padding:28px 28px 22px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6b78;">Made You Blush</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#3d2c2e;font-weight:normal;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#5c454c;">${escapeHtml(opts.intro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${opts.rowsHtml}
              </table>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.55;color:#8a6b74;">${escapeHtml(footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type OrderEmailDetails = {
  customerName: string;
  customerEmail: string;
  phone?: string;
  address?: string;
  deliveryDate?: string;
  orderSummary?: string;
  notes?: string;
  amountLabel: string;
  subtotalLabel?: string;
  handlingFeeLabel?: string;
  sessionId?: string;
};

export function buildPaidOrderCustomerHtml(details: OrderEmailDetails): string {
  return wrapBrandedEmail({
    title: "Order confirmed",
    intro: `Hi ${details.customerName || "there"}, thank you for your order. We've received your payment and will prepare your bouquet with care.`,
    rowsHtml: [
      row("Name", details.customerName),
      row("Email", details.customerEmail),
      row("Phone", details.phone),
      row("Delivery address", details.address),
      row("Delivery date", details.deliveryDate),
      row("Order", details.orderSummary),
      row("Subtotal", details.subtotalLabel),
      row("Handling fee", details.handlingFeeLabel),
      row("Total paid", details.amountLabel),
      row("Notes", details.notes),
    ].join(""),
    footerNote:
      "We'll be in touch if we need anything else before delivery. Thank you for choosing Made You Blush.",
  });
}

export function buildPaidOrderMerchantHtml(details: OrderEmailDetails): string {
  return wrapBrandedEmail({
    title: "New paid order",
    intro: "A Stripe checkout payment completed. Customer and delivery details below.",
    rowsHtml: [
      row("Customer", details.customerName),
      row("Email", details.customerEmail),
      row("Phone", details.phone),
      row("Delivery address", details.address),
      row("Delivery date", details.deliveryDate),
      row("Order summary", details.orderSummary),
      row("Subtotal", details.subtotalLabel),
      row("Handling fee", details.handlingFeeLabel),
      row("Amount paid", details.amountLabel),
      row("Notes", details.notes),
      row("Stripe session", details.sessionId),
    ].join(""),
  });
}

export type EarlyAccessEmailDetails = {
  customerName: string;
  customerEmail: string;
  phone?: string;
  deliveryAddress?: string;
  firstDeliveryDate?: string;
  bouquetSource?: string;
  bouquetDetails?: string;
  receiverNotes?: string;
  bouquetNotes?: string;
};

export function buildEarlyAccessCustomerHtml(details: EarlyAccessEmailDetails): string {
  return wrapBrandedEmail({
    title: "Early-access claim received",
    intro: `Hi ${details.customerName || "there"}, your free mini bouquet claim is confirmed. We'll follow up with delivery details soon.`,
    rowsHtml: [
      row("Name", details.customerName),
      row("Email", details.customerEmail),
      row("Phone", details.phone),
      row("Delivery address", details.deliveryAddress),
      row("Preferred delivery", details.firstDeliveryDate),
      row("Bouquet style", details.bouquetSource),
      row("Bouquet details", details.bouquetDetails),
      row("About the receiver", details.receiverNotes),
      row("Notes", details.bouquetNotes),
    ].join(""),
    footerNote:
      "No payment is required for this early-access giveaway. Keep an eye on your inbox — a little blush is on its way.",
  });
}

export function buildEarlyAccessMerchantHtml(details: EarlyAccessEmailDetails): string {
  return wrapBrandedEmail({
    title: "New early-access claim",
    intro: "Someone claimed a free early-access mini bouquet. Details below.",
    rowsHtml: [
      row("Customer", details.customerName),
      row("Email", details.customerEmail),
      row("Phone", details.phone),
      row("Delivery address", details.deliveryAddress),
      row("Preferred delivery", details.firstDeliveryDate),
      row("Bouquet style", details.bouquetSource),
      row("Bouquet details", details.bouquetDetails),
      row("About the receiver", details.receiverNotes),
      row("Notes", details.bouquetNotes),
    ].join(""),
  });
}
