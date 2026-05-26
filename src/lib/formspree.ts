export type FormspreeFormType = "contact" | "inquiry" | "buildBouquet" | "waitlist";

/** Fallbacks match `.env.example` — used when Vercel/env is missing or blank at build time. */
const defaultFormIds: Record<FormspreeFormType, string> = {
  contact: "mbdwvwzv",
  inquiry: "xnjwkwge",
  buildBouquet: "xzdwjevj",
  waitlist: "xdabrbpo",
};

const envIds: Record<FormspreeFormType, string | undefined> = {
  contact: import.meta.env.VITE_FORMSPREE_CONTACT_ID,
  inquiry: import.meta.env.VITE_FORMSPREE_INQUIRY_ID,
  buildBouquet: import.meta.env.VITE_FORMSPREE_BUILD_BOUQUET_ID,
  waitlist: import.meta.env.VITE_FORMSPREE_WAITLIST_ID,
};

const resolveFormId = (type: FormspreeFormType) => {
  const fromEnv = envIds[type]?.trim();
  return fromEnv || defaultFormIds[type];
};

const envLabels: Record<FormspreeFormType, string> = {
  contact: "VITE_FORMSPREE_CONTACT_ID",
  inquiry: "VITE_FORMSPREE_INQUIRY_ID",
  buildBouquet: "VITE_FORMSPREE_BUILD_BOUQUET_ID",
  waitlist: "VITE_FORMSPREE_WAITLIST_ID",
};

export function isFormspreeConfigured(type: FormspreeFormType): boolean {
  return Boolean(resolveFormId(type));
}

function serializeValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined) return "";
  return String(value);
}

/**
 * Submit to Formspree (https://formspree.io).
 * Create one form per type in your Formspree dashboard and paste each form ID into `.env`.
 */
export async function submitToFormspree(
  type: FormspreeFormType,
  fields: Record<string, unknown>,
): Promise<void> {
  const formId = resolveFormId(type);
  if (!formId) {
    throw new Error(
      `Formspree is not set up for "${type}". Add ${envLabels[type]} to your .env file (see .env.example).`,
    );
  }

  const payload: Record<string, string> = {
    _formType: type,
  };

  for (const [key, value] of Object.entries(fields)) {
    const serialized = serializeValue(value);
    if (serialized) payload[key] = serialized;
  }

  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    errors?: { message: string }[];
  };

  if (!response.ok) {
    const detail =
      data.error ||
      data.errors?.map((e) => e.message).join(", ") ||
      `Could not send (${response.status})`;
    throw new Error(detail);
  }
}
