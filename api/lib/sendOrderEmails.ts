import { Resend } from "resend";

const DEFAULT_FROM_EMAIL = "info@madeyoublush.ca";
const DEFAULT_NOTIFY_EMAIL = "info@madeyoublush.ca";
const FROM_NAME = "Made You Blush";
const BUSINESS_NAME = "Made You Blush";
const SERVICE_AREA = "Toronto / GTA";

export type EmailContent = {
  html: string;
  text: string;
};

export type SendCustomerAndMerchantEmailsArgs = {
  customerEmail: string;
  customerName?: string;
  subjectCustomer: string;
  subjectMerchant: string;
  htmlCustomer: string;
  htmlMerchant: string;
  textCustomer: string;
  textMerchant: string;
  /** Optional Resend idempotency keys (e.g. Stripe session id). */
  idempotencyKeyCustomer?: string;
  idempotencyKeyMerchant?: string;
};

function getFromEmail(): string {
  return (process.env.ORDER_FROM_EMAIL ?? DEFAULT_FROM_EMAIL).trim() || DEFAULT_FROM_EMAIL;
}

function getFromAddress(): string {
  return `${FROM_NAME} <${getFromEmail()}>`;
}

function getReplyTo(): string {
  return getFromEmail();
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
  textCustomer,
  textMerchant,
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
  const replyTo = getReplyTo();
  const merchantTo = getMerchantNotifyEmail();

  const [customerResult, merchantResult] = await Promise.all([
    resend.emails.send(
      {
        from,
        to: [toCustomer],
        replyTo,
        subject: subjectCustomer,
        html: htmlCustomer,
        text: textCustomer,
      },
      idempotencyKeyCustomer ? { idempotencyKey: idempotencyKeyCustomer } : undefined
    ),
    resend.emails.send(
      {
        from,
        to: [merchantTo],
        replyTo,
        subject: subjectMerchant,
        html: htmlMerchant,
        text: textMerchant,
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

type EmailRow = { label: string; value?: string | null };

function normalizeRows(rows: EmailRow[]): Array<{ label: string; value: string }> {
  return rows
    .map((r) => ({ label: r.label, value: r.value?.trim() ?? "" }))
    .filter((r) => r.value.length > 0);
}

function htmlRows(rows: Array<{ label: string; value: string }>): string {
  return rows
    .map(
      (r) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee5e8;vertical-align:top;width:140px;color:#7a656b;font-size:13px;">
        ${escapeHtml(r.label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eee5e8;color:#3d2c2e;font-size:14px;line-height:1.5;">
        ${escapeHtml(r.value).replace(/\n/g, "<br />")}
      </td>
    </tr>`
    )
    .join("");
}

function textRows(rows: Array<{ label: string; value: string }>): string {
  return rows.map((r) => `${r.label}: ${r.value}`).join("\n");
}

export function formatCadFromCents(cents: number | string | null | undefined): string {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n / 100);
}

const DEFAULT_CUSTOMER_REASON =
  "You received this email because you placed an order with Made You Blush.";
const DEFAULT_MERCHANT_REASON =
  "Internal copy: a customer order or claim was submitted on madeyoublush.ca.";

export function wrapBrandedEmail(opts: {
  title: string;
  intro: string;
  rows: EmailRow[];
  footerNote?: string;
  reasonLine?: string;
}): EmailContent {
  const rows = normalizeRows(opts.rows);
  const footer =
    opts.footerNote?.trim() ||
    `Questions? Reply to this email or write to ${getFromEmail()}.`;
  const reason = opts.reasonLine?.trim() || DEFAULT_CUSTOMER_REASON;
  const contactLine = `${BUSINESS_NAME} · Florals for ${SERVICE_AREA} · ${getFromEmail()}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f3f4;font-family:Georgia,'Times New Roman',serif;color:#3d2c2e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3f4;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ebe3e6;">
          <tr>
            <td style="padding:26px 28px 18px;border-bottom:1px solid #ebe3e6;">
              <p style="margin:0 0 8px;font-size:14px;line-height:1.4;color:#8a6b74;">${escapeHtml(BUSINESS_NAME)}</p>
              <h1 style="margin:0;font-size:22px;line-height:1.35;color:#3d2c2e;font-weight:normal;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#5c454c;">${escapeHtml(opts.intro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${htmlRows(rows)}
              </table>
              <p style="margin:22px 0 0;font-size:14px;line-height:1.55;color:#5c454c;">${escapeHtml(footer)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 26px;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#8a6b74;">${escapeHtml(contactLine)}</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a858b;">${escapeHtml(reason)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    BUSINESS_NAME,
    opts.title,
    "",
    opts.intro,
    "",
    textRows(rows),
    "",
    footer,
    "",
    contactLine,
    reason,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  return { html, text };
}

export type OrderEmailDetails = {
  /** Purchaser / person who paid */
  customerName: string;
  customerEmail: string;
  /** Delivery recipient when different from purchaser */
  recipientName?: string;
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

function recipientRows(details: OrderEmailDetails): EmailRow[] {
  const recipient = details.recipientName?.trim();
  if (!recipient) return [];
  if (recipient.toLowerCase() === details.customerName.trim().toLowerCase()) return [];
  return [{ label: "Recipient", value: recipient }];
}

export function buildPaidOrderCustomerEmail(details: OrderEmailDetails): EmailContent {
  return wrapBrandedEmail({
    title: "Order confirmation",
    intro: `Hi ${details.customerName || "there"}, thank you for your order with ${BUSINESS_NAME}. We have received your payment and will prepare your arrangement with care.`,
    rows: [
      { label: "Customer", value: details.customerName },
      { label: "Email", value: details.customerEmail },
      ...recipientRows(details),
      { label: "Phone", value: details.phone },
      { label: "Delivery address", value: details.address },
      { label: "Delivery date", value: details.deliveryDate },
      { label: "Order", value: details.orderSummary },
      { label: "Subtotal", value: details.subtotalLabel },
      { label: "Handling fee", value: details.handlingFeeLabel },
      { label: "Total paid", value: details.amountLabel },
      { label: "Notes", value: details.notes },
    ],
    footerNote:
      "We will be in touch if we need anything before delivery. Reply to this email anytime with questions.",
    reasonLine: DEFAULT_CUSTOMER_REASON,
  });
}

export function buildPaidOrderMerchantEmail(details: OrderEmailDetails): EmailContent {
  return wrapBrandedEmail({
    title: "New paid order",
    intro: "A Stripe checkout payment completed. Customer and delivery details are below.",
    rows: [
      { label: "Customer", value: details.customerName },
      { label: "Email", value: details.customerEmail },
      ...recipientRows(details),
      { label: "Phone", value: details.phone },
      { label: "Delivery address", value: details.address },
      { label: "Delivery date", value: details.deliveryDate },
      { label: "Order summary", value: details.orderSummary },
      { label: "Subtotal", value: details.subtotalLabel },
      { label: "Handling fee", value: details.handlingFeeLabel },
      { label: "Amount paid", value: details.amountLabel },
      { label: "Notes", value: details.notes },
      { label: "Stripe session", value: details.sessionId },
    ],
    footerNote: `Merchant notification for ${BUSINESS_NAME} (${SERVICE_AREA}).`,
    reasonLine: DEFAULT_MERCHANT_REASON,
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

export function buildEarlyAccessCustomerEmail(details: EarlyAccessEmailDetails): EmailContent {
  return wrapBrandedEmail({
    title: "Early-access claim received",
    intro: `Hi ${details.customerName || "there"}, thank you for claiming an early-access mini bouquet from ${BUSINESS_NAME}. We have your details and will follow up about delivery soon.`,
    rows: [
      { label: "Name", value: details.customerName },
      { label: "Email", value: details.customerEmail },
      { label: "Phone", value: details.phone },
      { label: "Delivery address", value: details.deliveryAddress },
      { label: "Preferred delivery", value: details.firstDeliveryDate },
      { label: "Bouquet style", value: details.bouquetSource },
      { label: "Bouquet details", value: details.bouquetDetails },
      { label: "About the receiver", value: details.receiverNotes },
      { label: "Notes", value: details.bouquetNotes },
    ],
    footerNote:
      "No payment is due for this early-access claim. Reply to this email if your details change.",
    reasonLine:
      "You received this email because you submitted an early-access claim with Made You Blush.",
  });
}

export function buildEarlyAccessMerchantEmail(details: EarlyAccessEmailDetails): EmailContent {
  return wrapBrandedEmail({
    title: "New early-access claim",
    intro: "Someone claimed an early-access mini bouquet. Details are below.",
    rows: [
      { label: "Customer", value: details.customerName },
      { label: "Email", value: details.customerEmail },
      { label: "Phone", value: details.phone },
      { label: "Delivery address", value: details.deliveryAddress },
      { label: "Preferred delivery", value: details.firstDeliveryDate },
      { label: "Bouquet style", value: details.bouquetSource },
      { label: "Bouquet details", value: details.bouquetDetails },
      { label: "About the receiver", value: details.receiverNotes },
      { label: "Notes", value: details.bouquetNotes },
    ],
    footerNote: `Merchant notification for ${BUSINESS_NAME} (${SERVICE_AREA}).`,
    reasonLine: DEFAULT_MERCHANT_REASON,
  });
}
