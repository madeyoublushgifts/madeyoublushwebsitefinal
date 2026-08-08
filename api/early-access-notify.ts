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

  if (!name || !email || !deliveryAddress) {
    return res.status(400).json({
      error: "Name, email, and delivery address are required.",
    });
  }

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
  };

  try {
    const customerEmailContent = buildEarlyAccessCustomerEmail(details);
    const merchantEmailContent = buildEarlyAccessMerchantEmail(details);

    await sendCustomerAndMerchantEmails({
      customerEmail: email,
      customerName: name,
      subjectCustomer: "Your Made You Blush early-access claim is confirmed",
      subjectMerchant: `Early-access claim — ${name}`,
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
