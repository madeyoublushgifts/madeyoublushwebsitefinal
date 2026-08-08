/** Formbricks Client Response API — early-access giveaway survey. */

const DEFAULT_APP_URL = "https://app.formbricks.com";
const DEFAULT_ENVIRONMENT_ID = "cmsjm2ef862ue01s22sgiuks0";
const DEFAULT_SURVEY_ID = "cmsjmvqza621y01s5p3ardf5j";

/** Survey-specific question IDs (Made You Blush early-access). */
const EARLY_ACCESS_QUESTION_IDS = {
  name: "e058rdh2jmcrb1a06w9ke5hn",
  email: "s1m8flfga2necja5l7ax4oc5",
  phone: "mnlc0jsgiu7p86ztdxvxm0oq",
  deliveryAddress: "j3t5ubnh9lq775bayt4tjqcu",
  firstDeliveryDate: "f213ao4lumc3iwspyx9ab5ov",
  bouquetSource: "wni730uis3s4a5krd83mfkvq",
  bouquetDetails: "uif04q4re0hky9i6xfwgourv",
  receiverNotes: "206yeminwfe6r39nuj2782gs",
  bouquetNotes: "5hz90ci30ldk2xw0pufadphy",
} as const;

export type FormbricksEarlyAccessFields = {
  name: string;
  email: string;
  phone?: string;
  deliveryAddress: string;
  firstDeliveryDate: string;
  bouquetSource: string;
  bouquetDetails: string;
  receiverNotes?: string;
  bouquetNotes?: string;
};

function resolveConfig() {
  const appUrl = (
    import.meta.env.VITE_FORMBRICKS_APP_URL?.trim() || DEFAULT_APP_URL
  ).replace(/\/$/, "");
  const environmentId =
    import.meta.env.VITE_FORMBRICKS_ENVIRONMENT_ID?.trim() || DEFAULT_ENVIRONMENT_ID;
  const surveyId =
    import.meta.env.VITE_FORMBRICKS_SURVEY_ID?.trim() || DEFAULT_SURVEY_ID;

  return { appUrl, environmentId, surveyId };
}

/**
 * Submit early-access giveaway answers via Formbricks Client Response API.
 * No API key required — public client endpoint.
 */
export async function submitToFormbricksEarlyAccess(
  fields: FormbricksEarlyAccessFields,
): Promise<void> {
  const { appUrl, environmentId, surveyId } = resolveConfig();

  const data: Record<string, string> = {};
  for (const [key, questionId] of Object.entries(EARLY_ACCESS_QUESTION_IDS)) {
    const value = fields[key as keyof FormbricksEarlyAccessFields];
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (trimmed) data[questionId] = trimmed;
  }

  const response = await fetch(
    `${appUrl}/api/v1/client/${environmentId}/responses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        surveyId,
        finished: true,
        data,
        meta: {
          source: "early-access",
          url: typeof window !== "undefined" ? window.location.href : undefined,
        },
      }),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    code?: string;
    details?: unknown;
  };

  if (!response.ok) {
    const detail =
      payload.message ||
      payload.error ||
      (payload.code ? `${payload.code} (${response.status})` : null) ||
      `Could not submit early-access form (${response.status})`;
    throw new Error(detail);
  }
}
