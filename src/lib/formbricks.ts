/** Formbricks Client Response API — Made You Blush surveys. */

const DEFAULT_APP_URL = "https://app.formbricks.com";
const DEFAULT_ENVIRONMENT_ID = "cmsjm2ef862ue01s22sgiuks0";

const DEFAULT_SURVEY_IDS = {
  earlyAccess: "cmsjmvqza621y01s5p3ardf5j",
  contact: "cmsk0dyon6vji01qdl1c6on71",
  inquiry: "cmsk1ctph6vnw01u2z2dav1ho",
  waitlist: "cmsk1cuur6sbb01sgkc7d7n54",
} as const;

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

const CONTACT_QUESTION_IDS = {
  name: "8wtwvh80fwlw39zdwyivhyst",
  email: "28rszv1ni5nmatx5a52b6822",
  subject: "qwthzvdho8odblbooaps0rgz",
  message: "jo2n4zufjlhvagz3eclwc6h9",
  source: "yz2dtu5z8k6iinthyky9gami",
} as const;

const INQUIRY_QUESTION_IDS = {
  name: "qmgmltkwlml6ok0eszxjncxb",
  email: "i2k1eafzuq4a1oon0yiawoze",
  phone: "tg60zp7gmdfcz9rty4ferd7w",
  deliveryAddress: "upjx16ifqo84jwkngg2od9eo",
  item: "v5v61e27o5nej7j6oqeat8hr",
  isGift: "zkq17qlgbo5of62pm51g3px8",
  personalMessage: "a3xfds8ehae0hcncpb8ar93v",
  source: "flio5qhuwcevdngbwtbs1pfg",
} as const;

const WAITLIST_QUESTION_IDS = {
  name: "czlievomc8pw8e87eiykcjqx",
  email: "7joio9t100qyigi0rektt08o",
  phone: "k6sphbsf92thifqip1bqnxqz",
  deliveryAddress: "ykkgw5qwn4lkntw3wv4egvzg",
  waitlistPath: "c9e3diplosw3zl8t8916ydni",
  cadence: "nz4jzk3qomt195jufkdcvpeo",
  paymentPlan: "m0g82a351kcx0n1sewb6jpt1",
  commitment: "alyg304w7bnlxz39hhepa2oq",
  firstDeliveryDate: "2tuxj9o8mfon9oo9dl8l3dvm",
  bouquetSource: "byzleh2fr7ml0mxd7eppt7er",
  bouquetDetails: "dk43mn9eq1d08mbtwxubfpnx",
  occasions: "6u0259uncnblmefvjqbmsjcz",
  receiverNotes: "72o9m9s2bogu0qkryodn084u",
  bouquetNotes: "vplcdbjbbyyco3ou0onf5wkj",
  source: "5omzk4ty7ih0z6ecs1jluymb",
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

export type FormbricksContactFields = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: string;
};

export type FormbricksInquiryFields = {
  name: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  item: string;
  isGift: boolean | string;
  personalMessage?: string;
  source: string;
};

export type FormbricksWaitlistFields = {
  name: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  waitlistPath: string;
  cadence: string;
  paymentPlan?: string;
  commitment: string;
  firstDeliveryDate: string;
  bouquetSource: string;
  bouquetDetails: string;
  occasions: string;
  receiverNotes?: string;
  bouquetNotes?: string;
  source: string;
};

function resolveBaseConfig() {
  const appUrl = (
    import.meta.env.VITE_FORMBRICKS_APP_URL?.trim() || DEFAULT_APP_URL
  ).replace(/\/$/, "");
  const environmentId =
    import.meta.env.VITE_FORMBRICKS_ENVIRONMENT_ID?.trim() ||
    DEFAULT_ENVIRONMENT_ID;

  return { appUrl, environmentId };
}

function resolveSurveyId(
  envKey:
    | "VITE_FORMBRICKS_SURVEY_ID"
    | "VITE_FORMBRICKS_CONTACT_SURVEY_ID"
    | "VITE_FORMBRICKS_INQUIRY_SURVEY_ID"
    | "VITE_FORMBRICKS_WAITLIST_SURVEY_ID",
  fallback: string,
): string {
  const fromEnv = import.meta.env[envKey]?.trim();
  return fromEnv || fallback;
}

function buildQuestionData(
  questionIds: Record<string, string>,
  fields: Record<string, string | undefined>,
): Record<string, string> {
  const data: Record<string, string> = {};
  for (const [key, questionId] of Object.entries(questionIds)) {
    const value = fields[key];
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (trimmed) data[questionId] = trimmed;
  }
  return data;
}

/**
 * Submit answers via Formbricks Client Response API.
 * No API key required — public client endpoint.
 */
export async function submitFormbricksResponse({
  surveyId,
  data,
  metaSource,
}: {
  surveyId: string;
  data: Record<string, string>;
  metaSource: string;
}): Promise<void> {
  const { appUrl, environmentId } = resolveBaseConfig();

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
          source: metaSource,
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
      `Could not submit form (${response.status})`;
    throw new Error(detail);
  }
}

/** Submit early-access giveaway answers. */
export async function submitToFormbricksEarlyAccess(
  fields: FormbricksEarlyAccessFields,
): Promise<void> {
  const surveyId = resolveSurveyId(
    "VITE_FORMBRICKS_SURVEY_ID",
    DEFAULT_SURVEY_IDS.earlyAccess,
  );

  await submitFormbricksResponse({
    surveyId,
    data: buildQuestionData(EARLY_ACCESS_QUESTION_IDS, fields),
    metaSource: "early-access",
  });
}

/** Submit contact form answers (homepage / contact page). */
export async function submitToFormbricksContact(
  fields: FormbricksContactFields,
): Promise<void> {
  const surveyId = resolveSurveyId(
    "VITE_FORMBRICKS_CONTACT_SURVEY_ID",
    DEFAULT_SURVEY_IDS.contact,
  );

  await submitFormbricksResponse({
    surveyId,
    data: buildQuestionData(CONTACT_QUESTION_IDS, {
      name: fields.name,
      email: fields.email,
      subject: fields.subject,
      message: fields.message,
      source: fields.source,
    }),
    metaSource: "contact",
  });
}

/** Submit shop / product inquiry answers. */
export async function submitToFormbricksInquiry(
  fields: FormbricksInquiryFields,
): Promise<void> {
  const surveyId = resolveSurveyId(
    "VITE_FORMBRICKS_INQUIRY_SURVEY_ID",
    DEFAULT_SURVEY_IDS.inquiry,
  );

  const isGift =
    typeof fields.isGift === "boolean"
      ? fields.isGift
        ? "Yes"
        : "No"
      : fields.isGift;

  await submitFormbricksResponse({
    surveyId,
    data: buildQuestionData(INQUIRY_QUESTION_IDS, {
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      deliveryAddress: fields.deliveryAddress,
      item: fields.item,
      isGift,
      personalMessage: fields.personalMessage,
      source: fields.source,
    }),
    metaSource: "inquiry",
  });
}

/** Submit subscription waitlist answers. */
export async function submitToFormbricksWaitlist(
  fields: FormbricksWaitlistFields,
): Promise<void> {
  const surveyId = resolveSurveyId(
    "VITE_FORMBRICKS_WAITLIST_SURVEY_ID",
    DEFAULT_SURVEY_IDS.waitlist,
  );

  await submitFormbricksResponse({
    surveyId,
    data: buildQuestionData(WAITLIST_QUESTION_IDS, {
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      deliveryAddress: fields.deliveryAddress,
      waitlistPath: fields.waitlistPath,
      cadence: fields.cadence,
      paymentPlan: fields.paymentPlan,
      commitment: fields.commitment,
      firstDeliveryDate: fields.firstDeliveryDate,
      bouquetSource: fields.bouquetSource,
      bouquetDetails: fields.bouquetDetails,
      occasions: fields.occasions,
      receiverNotes: fields.receiverNotes,
      bouquetNotes: fields.bouquetNotes,
      source: fields.source,
    }),
    metaSource: "waitlist",
  });
}
