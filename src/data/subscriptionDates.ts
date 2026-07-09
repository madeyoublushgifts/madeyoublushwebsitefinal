export const MIN_DELIVERY_LEAD_DAYS = 7;

export function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMinDeliveryDate(): string {
  return toDateInputValue(addDays(new Date(), MIN_DELIVERY_LEAD_DAYS));
}

export function isDeliveryDateValid(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const chosen = new Date(`${dateStr}T12:00:00`);
  const min = addDays(new Date(), MIN_DELIVERY_LEAD_DAYS);
  min.setHours(0, 0, 0, 0);
  return chosen >= min;
}

export function formatDisplayDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
