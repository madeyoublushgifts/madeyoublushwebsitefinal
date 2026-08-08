import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  absoluteUrl,
  getJsonLdForPath,
  getPageSeo,
  siteConfig,
  type PageSeo,
} from "@/lib/seo";

type SeoProps = Partial<PageSeo> & {
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | null;
};

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string
) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

const Seo = ({ title, description, path, noindex, jsonLd }: SeoProps) => {
  const { pathname } = useLocation();
  const defaults = getPageSeo(pathname);
  const pageTitle = title ?? defaults.title;
  const pageDescription = description ?? defaults.description;
  const pagePath = path ?? defaults.path;
  const canonical = absoluteUrl(pagePath);
  const ogImage = absoluteUrl("/og-image.png");

  useEffect(() => {
    document.title = pageTitle;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const el = document.createElement("meta");
        el.name = "description";
        return el;
      },
      pageDescription
    );

    upsertMeta(
      'meta[name="keywords"]',
      () => {
        const el = document.createElement("meta");
        el.name = "keywords";
        return el;
      },
      siteConfig.keywords.join(", ")
    );

    upsertMeta(
      'meta[name="robots"]',
      () => {
        const el = document.createElement("meta");
        el.name = "robots";
        return el;
      },
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    upsertLink("canonical", canonical);

    const ogTags: Array<[string, string]> = [
      ["og:title", pageTitle],
      ["og:description", pageDescription],
      ["og:type", "website"],
      ["og:url", canonical],
      ["og:image", ogImage],
      ["og:site_name", siteConfig.name],
      ["og:locale", siteConfig.locale],
    ];

    for (const [property, content] of ogTags) {
      upsertMeta(
        `meta[property="${property}"]`,
        () => {
          const el = document.createElement("meta");
          el.setAttribute("property", property);
          return el;
        },
        content
      );
    }

    const twitterTags: Array<[string, string]> = [
      ["twitter:card", "summary_large_image"],
      ["twitter:title", pageTitle],
      ["twitter:description", pageDescription],
      ["twitter:image", ogImage],
    ];

    for (const [name, content] of twitterTags) {
      upsertMeta(
        `meta[name="${name}"]`,
        () => {
          const el = document.createElement("meta");
          el.name = name;
          return el;
        },
        content
      );
    }

    // Prefer explicit jsonLd; otherwise path-based defaults.
    // Static homepage JSON-LD in index.html is replaced on hydrate so it stays in sync.
    const schemas =
      jsonLd === null
        ? []
        : jsonLd !== undefined
          ? Array.isArray(jsonLd)
            ? jsonLd
            : [jsonLd]
          : noindex
            ? []
            : getJsonLdForPath(pathname);

    document
      .querySelectorAll('script[data-seo-jsonld="true"], script[data-seo-static="true"]')
      .forEach((node) => node.remove());

    for (const schema of schemas) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [pageTitle, pageDescription, canonical, ogImage, noindex, jsonLd, pathname]);

  return null;
};

export default Seo;
