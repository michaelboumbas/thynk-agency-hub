import type { Lang } from "./site-v14";

/**
 * The company's legal details (26/11/2026, Mike: «φτιάξαμε πλέον εταιρεία»). Thynk is a general partnership (Ο.Ε.).
 * Shown in the footer's last line, on the Privacy and Cookies pages (the controller) and in the Organization schema.
 * ⚠️ Waiting for Mike: the exact registered name, VAT number (ΑΦΜ), tax office (ΔΟΥ) and GEMI number.
 * Until they are filled in, each empty value is simply left out (nothing is invented).
 */
export const company = {
  /** registered name, exactly as in the articles of association, e.g. «… Ο.Ε.» */
  legalName: "",
  /** the trade name (διακριτικός τίτλος) */
  tradeName: "Thynk Digital Agency",
  vat: "",
  taxOffice: "",
  gemi: "",
  address: { el: "Παπάζογλου 14Δ, 454 44 Ιωάννινα", en: "Papazoglou 14D, 454 44 Ioannina, Greece" },
  email: "hello@thynkagency.gr",
  phone: "+30 698 388 7522",
};

const labels = {
  el: { vat: "ΑΦΜ", taxOffice: "ΔΟΥ", gemi: "ΓΕΜΗ", legalName: "Επωνυμία", tradeName: "Διακριτικός τίτλος", address: "Έδρα", email: "Email", phone: "Τηλέφωνο" },
  en: { vat: "VAT no.", taxOffice: "Tax office", gemi: "GEMI no.", legalName: "Registered name", tradeName: "Trade name", address: "Registered office", email: "Email", phone: "Phone" },
} as const;

/** the footer line: «Επωνυμία · ΑΦΜ … · ΔΟΥ … · ΓΕΜΗ …», or "" while the details are missing */
export function companyLine(lang: Lang): string {
  const l = labels[lang];
  const parts = [
    company.legalName,
    company.vat && `${l.vat} ${company.vat}`,
    company.taxOffice && `${l.taxOffice} ${company.taxOffice}`,
    company.gemi && `${l.gemi} ${company.gemi}`,
  ].filter(Boolean);
  return company.legalName ? parts.join(" · ") : "";
}

/** label/value rows for the legal pages (only the ones that are filled in) */
export function companyRows(lang: Lang): { k: string; v: string }[] {
  const l = labels[lang];
  return [
    { k: l.legalName, v: company.legalName },
    { k: l.tradeName, v: company.tradeName },
    { k: l.vat, v: company.vat },
    { k: l.taxOffice, v: company.taxOffice },
    { k: l.gemi, v: company.gemi },
    { k: l.address, v: company.address[lang] },
    { k: l.email, v: company.email },
    { k: l.phone, v: company.phone },
  ].filter((r) => r.v);
}
