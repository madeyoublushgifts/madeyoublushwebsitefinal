import { instagram, tiktok } from "@/lib/social";

/** Public site URL — override with VITE_SITE_URL in Vercel if needed. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://www.madeyoublush.ca"
).replace(/\/$/, "");

export const googleBusiness = {
  shareUrl:
    import.meta.env.VITE_GOOGLE_BUSINESS_URL ??
    "https://share.google/Xt7UfFkDRsu6SqYYO",
  knowledgeGraphId: "11zcsyt5bx",
  mapsUrl:
    "https://www.google.com/maps/search/Made+You+Blush+Toronto+florist",
  profileUrl:
    import.meta.env.VITE_GOOGLE_BUSINESS_URL ??
    "https://www.google.com/search?kgmid=/g/11zcsyt5bx&hl=en-CA&q=Made+You+Blush",
} as const;

export const siteConfig = {
  name: "Made You Blush",
  tagline: "Affordable Toronto Florist, Custom Bouquets & Gift Shop",
  defaultDescription:
    "Made You Blush — Toronto florist and gift shop for affordable hand-tied bouquets, custom flower gifts, floral subscriptions, pop-ups, and bouquet-building experiences. Inquire for pickup or delivery across the GTA.",
  locale: "en_CA",
  email: "madeyoublushgifts@gmail.com",
  phone: "+1-647-550-8476",
  city: "Toronto",
  region: "ON",
  country: "CA",
  priceRange: "$$",
  sameAs: [instagram.url, tiktok.url, googleBusiness.shareUrl],
  keywords: [
    "Made You Blush",
    "Made You Blush Toronto",
    "Toronto florist",
    "affordable bouquets Toronto",
    "custom bouquets Toronto",
    "flower gift shop Toronto",
    "floral subscription Toronto",
    "hand-tied bouquets Toronto",
    "Toronto flower delivery",
    "GTA florist",
    "build your own bouquet Toronto",
    "florist pop-ups Toronto",
    "Toronto gift shop flowers",
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
      "Made You Blush — Toronto’s affordable florist for hand-tied bouquets, custom flower gifts, curated gift sets, and floral subscriptions. Shop tiers, build a bouquet, or inquire for GTA pickup and delivery.",
    path: "/",
  },
  "/shop": {
    title: `Shop Bouquets & Flower Gifts in Toronto | ${siteConfig.name}`,
    description:
      "Browse affordable bouquet tiers from single stems to luxury, plus cards, snail-mail notes, and curated gift sets. Made You Blush — Toronto florist. Inquire to confirm pickup, delivery, and personalization.",
    path: "/shop",
  },
  "/create-bouquet": {
    title: `Build a Custom Bouquet in Toronto | ${siteConfig.name}`,
    description:
      "Design your own bouquet online — pick stems, wrapping, ribbon, and add-ons. Made You Blush custom Toronto florist with transparent pricing. We confirm availability before anything is cut.",
    path: "/create-bouquet",
  },
  "/contact": {
    title: `Contact Toronto Florist | ${siteConfig.name}`,
    description:
      "Contact Made You Blush for bouquet inquiries, floral subscriptions, gift bundles, pop-up dates, bouquet-building nights, and event florals across Toronto and the GTA.",
    path: "/contact",
  },
  "/coming-soon": {
    title: `Coming Soon — Bouquet Builder & Blush Notes | ${siteConfig.name}`,
    description:
      "Preview the upcoming online bouquet builder and Blush Notes blog from Made You Blush — Toronto stories, seasonal gifting, and local creativity alongside our floral world.",
    path: "/coming-soon",
  },
  "/subscription": {
    title: `Floral Subscription Waitlist Toronto | ${siteConfig.name}`,
    description:
      "Join the floral subscription waitlist in Toronto — bi-weekly, monthly, or $185/year annual plan. Choose a shop tier or custom build, add special occasions, and get notified when delivery memberships launch.",
    path: "/subscription",
  },
};

export function getPageSeo(pathname: string): PageSeo {
  return (
    pages[pathname] ?? {
      title: `Page Not Found | ${siteConfig.name}`,
      description: siteConfig.defaultDescription,
      path: pathname,
    }
  );
}

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function floristJsonLd() {
  const businessId = `${SITE_URL}/#business`;

  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": businessId,
    name: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl("/og-image.png"),
    image: absoluteUrl("/og-image.png"),
    description: siteConfig.defaultDescription,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    additionalType: "https://schema.org/GiftShop",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    areaServed: [
      { "@type": "City", name: "Toronto" },
      {
        "@type": "AdministrativeArea",
        name: "Greater Toronto Area",
        containedInPlace: { "@type": "Country", name: "Canada" },
      },
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 43.6532,
        longitude: -79.3832,
      },
      geoRadius: "50000",
    },
    hasMap: googleBusiness.mapsUrl,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Google Knowledge Graph",
      value: `/g/${googleBusiness.knowledgeGraphId}`,
    },
    knowsAbout: [
      "Hand-tied bouquets",
      "Custom flower arrangements",
      "Floral subscriptions",
      "Gift shop flowers",
      "Toronto pop-up florist",
    ],
    sameAs: [...siteConfig.sameAs, googleBusiness.profileUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.defaultDescription,
    inLanguage: "en-CA",
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}
