import { company } from "@/content/company";
import { v14Social } from "@/content/site-v14";

/**
 * SEO + AI-SEO for every page (26/11/2026, Mike approved the plan): one helper builds each route's <head>:
 * title, description, Open Graph, canonical, hreflang (el ↔ en + x-default = Greek) and, on the home pages,
 * the Organization / ProfessionalService schema with the same name, address and phone (NAP) as the Google
 * Business Profile, LinkedIn, Facebook and Instagram. `sameAs` ties the brand to its profiles, so search engines
 * and AI assistants stop mixing Thynk up with similarly named agencies.
 */
export const SITE = "https://thynkagency.gr";

type Lang = "el" | "en";

/** the English path of a page ("/" for home); the Greek one is /el + path */
export function seoHead({ path, lang, title, description, schema = false, noindex = false }: {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  /** add the Organization schema (home pages) */
  schema?: boolean;
  noindex?: boolean;
}) {
  const en = `${SITE}${path === "/" ? "/" : path}`;
  const el = `${SITE}${path === "/" ? "/el" : `/el${path}`}`;
  const self = lang === "el" ? el : en;
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: self },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Thynk Digital Agency" },
    { property: "og:locale", content: lang === "el" ? "el_GR" : "en_GB" },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  const links = [
    { rel: "canonical", href: self },
    { rel: "alternate", hrefLang: "el", href: el },
    { rel: "alternate", hrefLang: "en", href: en },
    { rel: "alternate", hrefLang: "x-default", href: el },
  ];
  const scripts = schema ? [{ type: "application/ld+json", children: JSON.stringify(orgSchema(lang)) }] : [];
  return { meta, links, scripts };
}

export function orgSchema(lang: Lang) {
  const el = lang === "el";
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${SITE}/#organization`,
    name: "Thynk Digital Agency",
    alternateName: ["Thynk", "Thynk Agency"],
    legalName: company.legalName[lang],
    vatID: `EL${company.vat}`,
    identifier: { "@type": "PropertyValue", propertyID: "GEMI", value: company.gemi },
    url: el ? `${SITE}/el` : SITE,
    logo: `${SITE}/apple-touch-icon.png`,
    email: company.email,
    telephone: company.phone.replace(/\s+/g, ""),
    foundingDate: "2026",
    founder: [
      { "@type": "Person", name: el ? "Δημήτρης Χρυσοχόου" : "Dimitris Chrysochoou" },
      { "@type": "Person", name: el ? "Μιχαήλ Μπούμπας" : "Michael Boumpas" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: el ? "Παπάζογλου 14Δ" : "Papazoglou 14D",
      postalCode: "454 44",
      addressLocality: el ? "Ιωάννινα" : "Ioannina",
      addressRegion: el ? "Ήπειρος" : "Epirus",
      addressCountry: "GR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 39.66813, longitude: 20.85431 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: el ? "Ιωάννινα" : "Ioannina" },
      { "@type": "AdministrativeArea", name: el ? "Ήπειρος" : "Epirus" },
      { "@type": "Country", name: el ? "Ελλάδα" : "Greece" },
    ],
    description: el
      ? "Η Thynk Digital Agency είναι εταιρεία digital marketing και AI αυτοματισμών με έδρα τα Ιωάννινα. Διαφήμιση σε Google, Meta, TikTok και ChatGPT, διαχείριση social media, στρατηγική, παραγωγή περιεχομένου, email & SMS marketing, κατασκευή ιστοσελίδων και AI αυτοματισμοί."
      : "Thynk Digital Agency is a digital marketing and AI automation agency based in Ioannina, Greece. Advertising on Google, Meta, TikTok and ChatGPT, social media management, strategy, content creation, email & SMS marketing, websites and AI automation.",
    knowsAbout: [
      "Performance Marketing",
      "Social Media Management",
      "Digital Marketing Strategy",
      "Content Creation",
      "Email & SMS Marketing",
      "Websites & Landing Pages",
      "Agentic AI",
      "Custom AI agents",
      "AI Automation",
      "AI Audit",
    ],
    sameAs: v14Social.map((s) => s.href),
  };
}
