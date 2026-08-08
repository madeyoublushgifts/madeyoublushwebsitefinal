/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GOOGLE_BUSINESS_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_BIWEEKLY_AMOUNT_CENTS?: string;
  readonly VITE_STRIPE_MONTHLY_AMOUNT_CENTS?: string;
  readonly VITE_STRIPE_ANNUAL_AMOUNT_CENTS?: string;
  readonly VITE_FORMBRICKS_APP_URL?: string;
  readonly VITE_FORMBRICKS_ENVIRONMENT_ID?: string;
  /** Early-access survey ID (legacy name kept for compatibility). */
  readonly VITE_FORMBRICKS_SURVEY_ID?: string;
  readonly VITE_FORMBRICKS_CONTACT_SURVEY_ID?: string;
  readonly VITE_FORMBRICKS_INQUIRY_SURVEY_ID?: string;
  readonly VITE_FORMBRICKS_WAITLIST_SURVEY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.webp?url" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}
