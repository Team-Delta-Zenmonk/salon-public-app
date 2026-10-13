import type { Metadata } from "next";
import type { Salon } from "@/common/salon.type";

const defaultAppName = process.env.NEXT_PUBLIC_APP_NAME || "Veloura";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://salon-public-app.vercel.app";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function fetchSalonBySlug(slug: string): Promise<Salon | null> {
  if (!slug) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${backendUrl}/storefront/${encodeURIComponent(slug)}/profile`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || data || null;
  } catch {
    return null;
  }
}

export function formatSalonSlugTitle(slug: string): string {
  if (!slug) return defaultAppName;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getSalonImage(salon: Salon | null): string | null {
  if (salon?.photos && salon.photos.length > 0) {
    const first = salon.photos[0];
    if (typeof first === "string" && first) return first;
    if (typeof first === "object" && (first?.secure_url || first?.url)) {
      return first.secure_url || first.url;
    }
  }
  if (salon?.logo) return salon.logo;
  return null;
}

interface BuildMetadataParams {
  slug: string;
  salon: Salon | null;
  subTitle?: string;
  descriptionSuffix?: string;
  subPath?: string;
  noIndex?: boolean;
}

export function buildSalonMetadata({
  slug,
  salon,
  subTitle,
  descriptionSuffix,
  subPath = "",
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const salonName = salon?.name || formatSalonSlugTitle(slug);
  const title = subTitle ? `${subTitle} — ${salonName}` : `${salonName} — Luxury Salon & Spa Sanctuary`;

  const defaultDesc =
    salon?.about ||
    `Book luxury haircuts, styling, coloring, and spa treatments online at ${salonName}. View artisan stylists, transparent pricing, and instant slot availability.`;

  const description = descriptionSuffix ? `${descriptionSuffix} at ${salonName}.` : defaultDesc;
  const canonicalUrl = `${siteUrl}/salons/${slug}${subPath}`;
  const imageUrl = getSalonImage(salon);

  return {
    title,
    description,
    keywords: [
      salonName,
      `book appointment at ${salonName}`,
      `${salonName} salon services`,
      `${salonName} reviews`,
      `${salonName} price list`,
      "book salon online",
      "haircut and styling",
      "hair spa and treatments",
      "facial and skin care",
      "bridal makeup",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {
          robots: {
            index: true,
            follow: true,
          },
        }),
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: salonName,
      title,
      description,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `${salonName} Salon & Spa Sanctuary`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

