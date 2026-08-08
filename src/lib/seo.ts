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

/** E.164 — used in JSON-LD / tel: links (no separators). */
export const PHONE_E164 = "+16475508476";

export const siteConfig = {
  name: "Made You Blush",
  tagline: "Affordable Toronto Florist, Custom Bouquets & Gift Shop",
  defaultDescription:
    "Made You Blush — Toronto florist and gift shop for affordable hand-tied bouquets, custom flower gifts, floral subscriptions, pop-ups, and bouquet-building experiences. Inquire for pickup or delivery across the GTA.",
  locale: "en_CA",
  email: "madeyoublushgifts@gmail.com",
  phone: PHONE_E164,
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

/** Public marketing routes that should be indexed + listed in sitemap. */
export const INDEXABLE_ROUTES = [
  "/",
  "/shop",
  "/create-bouquet",
  "/contact",
  "/coming-soon",
  "/subscription",
  "/events",
  "/pop-ups",
] as const;

export type IndexableRoute = (typeof INDEXABLE_ROUTES)[number];

export function isIndexablePath(pathname: string): boolean {
  return (INDEXABLE_ROUTES as readonly string[]).includes(pathname);
}

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
    title: `Contact Us | ${siteConfig.name}`,
    description:
      "Contact Made You Blush for bouquet inquiries, floral subscriptions, gift bundles, Bloom Bar experiences, pop-up dates, partnerships, and event florals across Toronto and the GTA.",
    path: "/contact",
  },
  "/events": {
    title: `Bloom Bar, Floral Décor & Private Experiences Toronto | ${siteConfig.name}`,
    description:
      "Book a Made You Blush Bloom Bar, make-your-own bouquet station, or floral arrangements and décor for weddings, bridal showers, birthdays, anniversaries, and parties across Toronto and the GTA.",
    path: "/events",
  },
  "/pop-ups": {
    title: `Toronto Florist Pop-ups & Markets | ${siteConfig.name}`,
    description:
      "Find Made You Blush at Toronto markets and pop-ups—upcoming dates, past polaroids from Fox Theatre and more, plus collab inquiries.",
    path: "/pop-ups",
  },
  "/coming-soon": {
    title: `Coming Soon — Bouquet Visualizer & Blush Notes | ${siteConfig.name}`,
    description:
      "Build a bouquet on Made You Blush today—and preview the upcoming visual bouquet visualizer plus Blush Notes, our blog and newsletter for Toronto stories and seasonal gifting.",
    path: "/coming-soon",
  },
  "/subscription": {
    title: `Recurring Delivery Subscription Waitlist Toronto | ${siteConfig.name}`,
    description:
      "Join the Made You Blush waitlist for recurring floral delivery or special dates & occasions only — choose cadence, bouquet style, colour templates, and get notified when memberships launch.",
    path: "/subscription",
  },
  "/subscription/build-bouquet": {
    title: `Build Your Custom Bouquet | ${siteConfig.name}`,
    description:
      "Design stems, wrap, and add-ons for your Made You Blush subscription waitlist — separate from one-time shop checkout.",
    path: "/subscription/build-bouquet",
  },
  "/cart": {
    title: `Your Cart | ${siteConfig.name}`,
    description: "Review your bouquet order before secure checkout with Made You Blush.",
    path: "/cart",
  },
  "/checkout": {
    title: `Checkout | ${siteConfig.name}`,
    description: "Complete your Made You Blush bouquet order with secure Stripe checkout.",
    path: "/checkout",
  },
  "/checkout/success": {
    title: `Order Confirmed | ${siteConfig.name}`,
    description: "Thank you for your Made You Blush order.",
    path: "/checkout/success",
  },
  "/checkout/cancel": {
    title: `Checkout Cancelled | ${siteConfig.name}`,
    description: "Your checkout was cancelled. Return to the shop anytime.",
    path: "/checkout/cancel",
  },
  "/early-access/monthly-mini": {
    title: `Early Access Free Mini Bouquet | ${siteConfig.name}`,
    description:
      "Invite-only early access: claim one complimentary mini bouquet month from Made You Blush. No payment required.",
    path: "/early-access/monthly-mini",
  },
  "/early-access/monthly-mini/build": {
    title: `Build Your Free Mini Bouquet | ${siteConfig.name}`,
    description:
      "Design a custom mini bouquet for your Made You Blush early-access giveaway claim.",
    path: "/early-access/monthly-mini/build",
  },
  "/early-access/three-month-mini": {
    title: `Early Access 3-Month Mini Subscription | ${siteConfig.name}`,
    description:
      "Invite-only early access: claim a complimentary 3-month mini bouquet subscription from Made You Blush. No payment required.",
    path: "/early-access/three-month-mini",
  },
  "/early-access/three-month-mini/build": {
    title: `Build Your Free Mini Bouquet | ${siteConfig.name}`,
    description:
      "Design a custom mini bouquet for your Made You Blush 3-month early-access giveaway claim.",
    path: "/early-access/three-month-mini/build",
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

const businessId = () => `${SITE_URL}/#business`;
const organizationId = () => `${SITE_URL}/#organization`;
const websiteId = () => `${SITE_URL}/#website`;

/** Organization — brand entity (no fake street address). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl("/og-image.png"),
    image: absoluteUrl("/og-image.png"),
    description: siteConfig.defaultDescription,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    sameAs: [...siteConfig.sameAs, googleBusiness.profileUrl],
    areaServed: [
      { "@type": "City", name: "Toronto" },
      {
        "@type": "AdministrativeArea",
        name: "Greater Toronto Area",
        containedInPlace: { "@type": "Country", name: "Canada" },
      },
    ],
  };
}

/**
 * Florist / LocalBusiness — NAP without inventing a street address.
 * Service-area business: city + region + areaServed / GeoCircle.
 */
export function floristJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Florist", "LocalBusiness"],
    "@id": businessId(),
    name: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl("/og-image.png"),
    image: absoluteUrl("/og-image.png"),
    description: siteConfig.defaultDescription,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    additionalType: "https://schema.org/GiftShop",
    parentOrganization: { "@id": organizationId() },
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
    "@id": websiteId(),
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.defaultDescription,
    inLanguage: "en-CA",
    publisher: { "@id": organizationId() },
    about: { "@id": businessId() },
  };
}

/** Full business graph for homepage + Contact (and static index.html). */
export function primaryJsonLd(): Record<string, unknown>[] {
  return [organizationJsonLd(), floristJsonLd(), websiteJsonLd()];
}

/**
 * Default JSON-LD for a route.
 * - Home / Contact: Organization + Florist + WebSite
 * - Other indexable marketing pages: WebSite only
 * - Noindex / tool pages: none
 */
export function getJsonLdForPath(pathname: string): Record<string, unknown>[] {
  if (pathname === "/" || pathname === "/contact") {
    return primaryJsonLd();
  }
  if (isIndexablePath(pathname)) {
    return [websiteJsonLd()];
  }
  return [];
}
