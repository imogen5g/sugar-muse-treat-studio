import vanillaPoster from "@/assets/vanilla.jpg.asset.json";

export const SITE_URL = "https://sugar-muse-treat-studio.lovable.app";
export const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": `${SITE_URL}/#bakery`,
  name: "Sugar Muse Treat Studio",
  url: `${SITE_URL}/`,
  description: "Custom cakes, bento cakes and treats in Dar es Salaam, Tanzania. Pre-orders and local delivery available across Dar es Salaam.",
  image: `${SITE_URL}${vanillaPoster.url}`,
  address: { "@type": "PostalAddress", addressLocality: "Dar es Salaam", addressCountry: "TZ" },
  areaServed: { "@type": "City", name: "Dar es Salaam, Tanzania" },
  currenciesAccepted: "TZS",
};