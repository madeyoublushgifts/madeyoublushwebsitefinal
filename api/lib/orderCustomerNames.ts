/**
 * Resolve purchaser vs delivery-recipient names from a Stripe Checkout Session.
 * Greeting / customer emails must never use the recipient as "Hi {name}".
 */
export function resolveOrderCustomerNames(session: {
  customer_details?: { name?: string | null } | null;
  metadata?: Record<string, string> | null;
}): { customerName: string; recipientName?: string } {
  const meta = session.metadata ?? {};
  const stripeBillingName = session.customer_details?.name?.trim() || "";
  const metaCustomerName = meta.customerName?.trim() || "";
  const legacyMetaName = meta.name?.trim() || "";
  const metaRecipientName = meta.recipientName?.trim() || "";

  const customerName =
    metaCustomerName || stripeBillingName || legacyMetaName || "Customer";

  let recipientName = metaRecipientName;
  if (!recipientName && legacyMetaName) {
    // Older checkouts stored the delivery name in `name` while Stripe had the cardholder.
    const legacyMatchesPurchaser =
      legacyMetaName.toLowerCase() === customerName.toLowerCase() ||
      Boolean(
        metaCustomerName && legacyMetaName.toLowerCase() === metaCustomerName.toLowerCase()
      );
    if (
      !legacyMatchesPurchaser &&
      stripeBillingName &&
      legacyMetaName.toLowerCase() !== stripeBillingName.toLowerCase()
    ) {
      recipientName = legacyMetaName;
    }
  }

  if (recipientName && recipientName.toLowerCase() === customerName.toLowerCase()) {
    recipientName = "";
  }

  return {
    customerName,
    recipientName: recipientName || undefined,
  };
}
