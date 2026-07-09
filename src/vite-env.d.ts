/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GOOGLE_BUSINESS_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_BIWEEKLY_AMOUNT_CENTS?: string;
  readonly VITE_STRIPE_MONTHLY_AMOUNT_CENTS?: string;
  readonly VITE_STRIPE_ANNUAL_AMOUNT_CENTS?: string;
  readonly VITE_FORMSPREE_CONTACT_ID?: string;
  readonly VITE_FORMSPREE_INQUIRY_ID?: string;
  readonly VITE_FORMSPREE_BUILD_BOUQUET_ID?: string;
  readonly VITE_FORMSPREE_WAITLIST_ID?: string;
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

