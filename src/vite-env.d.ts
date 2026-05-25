/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_CONTACT_ID?: string;
  readonly VITE_FORMSPREE_INQUIRY_ID?: string;
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

