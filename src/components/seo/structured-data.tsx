import React from "react";
import type { Salon } from "@/common/salon.type";

const defaultAppName = process.env.NEXT_PUBLIC_APP_NAME || "Veloura";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://salon-public-app.vercel.app";

export interface StructuredDataProps {
  salon?: Salon | null;
  slug?: string;
}

export const buildSalonJsonLd = (salon?: Salon | null, slug?: string) => {
  const salonName = salon?.name || defaultAppName;
  const canonicalUrl = slug ? `${siteUrl}/salons/${slug}` : siteUrl;
  const description =
    salon?.about ||
    "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals.";

  const salonImage =
    salon?.photos && salon.photos.length > 0
      ? typeof salon.photos[0] === "string"
        ? salon.photos[0]
        : salon.photos[0]?.secure_url || salon.photos[0]?.url
      : salon?.logo;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${salonName} — Luxury Salon & Spa Sanctuary`,
        description,
        publisher: { "@id": `${canonicalUrl}/#organization` },
        inLanguage: "en-IN",
      },
      {
        "@type": "BeautySalon",
        "@id": `${canonicalUrl}/#salon`,
        name: `${salonName} Luxury Salon Sanctuary`,
        url: canonicalUrl,
        ...(salonImage ? { image: salonImage } : {}),
        ...(salon?.phone ? { telephone: salon.phone } : {}),
        ...(salon?.email ? { email: salon.email } : {}),
        ...(salon?.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: salon.address,
                addressCountry: "IN",
              },
            }
          : {}),
        ...(salon?.latitude && salon?.longitude
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: salon.latitude,
                longitude: salon.longitude,
              },
            }
          : {}),
        priceRange: "₹₹ - ₹₹₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
        openingHours: "Mo-Su 09:00-21:00",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
  };
};

export default function StructuredData({ salon, slug }: StructuredDataProps) {
  const jsonLd = buildSalonJsonLd(salon, slug);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
