import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildEarlyAccessCustomerEmail,
  buildEarlyAccessMerchantEmail,
  sendCustomerAndMerchantEmails,
} from "./lib/sendOrderEmails.js";

type EarlyAccessNotifyBody = {
  name?: string;
  email?: string;
  phone?: string;
  deliveryAddress?: string;
  firstDeliveryDate?: string;
  bouquetSource?: string;
  bouquetDetails?: string;
  receiverNotes?: string;
  bouquetNotes?: string;
  giveawayId?: string;
  monthsCount?: number | string;
};

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

  const body = (req.body ?? {}) as EarlyAccessNotifyBody;
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const deliveryAddress = body.deliveryAddress?.trim() ?? "";
  const firstDeliveryDate = body.firstDeliveryDate?.trim() ?? "";
  const bouquetSource = body.bouquetSource?.trim() ?? "";
  const bouquetDetails = body.bouquetDetails?.trim() ?? "";
  const receiverNotes = body.receiverNotes?.trim() ?? "";
  const bouquetNotes = body.bouquetNotes?.trim() ?? "";
  const giveawayId = body.giveawayId?.trim() ?? "";
  const parsedMonths =
    typeof body.monthsCount === "number"
      ? body.monthsCount
      : typeof body.monthsCount === "string"
        ? Number.parseInt(body.monthsCount, 10)
        : NaN;
  const monthsCount =
    Number.isFinite(parsedMonths) && parsedMonths > 0
      ? parsedMonths
      : giveawayId === "three-month-mini" || /3[- ]month/i.test(bouquetSource)
        ? 3
        : 1;

  if (!name || !email || !deliveryAddress) {
    return res.status(400).json({
      error: "Name, email, and delivery address are required.",
    });
  }

  const isThreeMonth = monthsCount >= 3;

  const details = {
    customerName: name,
    customerEmail: email,
    phone,
    deliveryAddress,
    firstDeliveryDate,
    bouquetSource,
    bouquetDetails,
    receiverNotes,
    bouquetNotes,
    monthsCount,
    giveawayId: giveawayId || undefined,
  };

  try {
    const customerEmailContent = buildEarlyAccessCustomerEmail(details);
    const merchantEmailContent = buildEarlyAccessMerchantEmail(details);

    await sendCustomerAndMerchantEmails({
      customerEmail: email,
      customerName: name,
      subjectCustomer: isThreeMonth
        ? "Your Made You Blush 3-month mini giveaway claim is confirmed"
        : "Your Made You Blush early-access claim is confirmed",
      subjectMerchant: isThreeMonth
        ? `3-month mini giveaway claim — ${name}`
        : `Early-access claim — ${name}`,
      htmlCustomer: customerEmailContent.html,
      htmlMerchant: merchantEmailContent.html,
      textCustomer: customerEmailContent.text,
      textMerchant: merchantEmailContent.text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    console.error("early-access-notify:", message);
    return res.status(500).json({ error: message });
  }
}
