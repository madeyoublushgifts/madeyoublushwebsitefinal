import { instagram, tiktok } from "@/lib/social";

/** Public site URL — set VITE_SITE_URL in Vercel env when using a custom domain. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://flora-bloom-download-main.vercel.app"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Made You Blush",
  tagline: "Affordable Toronto Florist, Custom Bouquets & Gift Shop",
  defaultDescription:
    "Toronto florist for affordable hand-tied bouquets, custom flower gifts, floral subscriptions, pop-ups, and bouquet-building experiences. Inquire for pickup or delivery across the GTA.",
  locale: "en_CA",
  email: "madeyoublushgifts@gmail.com",
  phone: "+1-647-550-8476",
  city: "Toronto",
  region: "ON",
  country: "CA",
  priceRange: "$$",
  sameAs: [instagram.url, tiktok.url],
  keywords: [
    "Toronto florist",
    "affordable bouquets Toronto",
    "custom bouquets Toronto",
    "flower gift shop Toronto",
    "floral subscription Toronto",
    "hand-tied bouquets Toronto",
    "Toronto flower delivery",
    "build your own bouquet Toronto",
    "florist pop-ups Toronto",
    "Made You Blush",
  ],
} as const;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
};

const pages: Record<string, PageSeo> = {
  "/": {
    title: `${siteConfig.name} | Affordable Toronto Florist & Gift Shop`,
    description:
      "Toronto’s affordable florist for hand-tied bouquets, custom flower gifts, curated gift sets, and floral subscriptions. Shop tiers, build a bouquet, or inquire for GTA pickup and delivery.",
    path: "/",
  },
  "/shop": {
    title: `Shop Bouquets & Flower Gifts in Toronto | ${siteConfig.name}`,
    description:
      "Browse affordable bouquet tiers from single stems to luxury, plus cards, snail-mail notes, and curated gift sets. Toronto florist — inquire to confirm pickup, delivery, and personalization.",
    path: "/shop",
  },
  "/create-bouquet": {
    title: `Build a Custom Bouquet in Toronto | ${siteConfig.name}`,
    description:
      "Design your own bouquet online — pick stems, wrapping, ribbon, and add-ons. Toronto custom florist with transparent pricing. We confirm availability before anything is cut.",
    path: "/create-bouquet",
  },
  "/contact": {
    title: `Contact Toronto Florist | ${siteConfig.name}`,
    description:
      "Reach Made You Blush for bouquet inquiries, floral subscriptions, gift bundles, pop-up dates, bouquet-building nights, and event florals across Toronto and the GTA.",
    path: "/contact",
  },
  "/coming-soon": {
    title: `Floral Subscription Toronto Waitlist | ${siteConfig.name}`,
    description:
      "Join the waitlist for affordable floral subscriptions in Toronto — convenient, personal blooms delivered on your schedule. Shop bouquets and gifts while you wait.",
    path: "/coming-soon",
  },
};

export function getPageSeo(pathname: string): PageSeo {
  return pages[pathname] ?? {
    title: `Page Not Found | ${siteConfig.name}`,
    description: siteConfig.defaultDescription,
    path: pathname,
  };
}

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function floristJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl("/og-image.png"),
    image: absoluteUrl("/og-image.png"),
    description: siteConfig.defaultDescription,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    areaServed: {
      "@type": "City",
      name: "Toronto",
    },
    sameAs: [...siteConfig.sameAs],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.defaultDescription,
    inLanguage: "en-CA",
  };
}
