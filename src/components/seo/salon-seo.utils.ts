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

export function formatTitleCase(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

export interface RouteMetadataConfig {
  title: string;
  description: string;
  noIndex?: boolean;
}

export const STOREFRONT_ROUTE_METADATA: Record<string, RouteMetadataConfig> = {
  "/": {
    title: "Book Online",
    description: "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals.",
  },
  "/services": {
    title: "Bespoke Services & Treatments",
    description: "Explore our luxury salon treatments, styling rituals, hair coloring, facials, and grooming therapies.",
  },
  "/specialists": {
    title: "Artisans & Master Stylists",
    description: "Meet our master scissorsmiths, colorists, and dermal therapy artisans dedicated to your personal transformation.",
  },
  "/about": {
    title: "About Our Sanctuary",
    description: "Discover our heritage, philosophy of intentional care, and commitment to luxury coiffure and bespoke dermal therapies.",
  },
  "/cart": {
    title: "Concierge Bag",
    description: "Review your selected luxury salon treatments and reserve your appointment slot.",
    noIndex: true,
  },
  "/checkout": {
    title: "Secure Checkout",
    description: "Complete your appointment booking with secure payment processing.",
    noIndex: true,
  },
  "/bookings": {
    title: "My Appointments & Bookings",
    description: "View and manage your upcoming and past luxury salon appointments.",
    noIndex: true,
  },
  "/bookings/success": {
    title: "Booking Confirmed",
    description: "Your appointment has been successfully booked.",
    noIndex: true,
  },
  "/profile": {
    title: "Client Profile",
    description: "Manage your client account, preferences, and personal details.",
    noIndex: true,
  },
  "/signup": {
    title: "Client Sign In & Registration",
    description: "Sign in or create an account to book your luxury salon appointments seamlessly.",
  },
};

export function getRouteStaticMetadata(pathname: string): Metadata {
  const config = STOREFRONT_ROUTE_METADATA[pathname] || {
    title: defaultAppName,
    description: "Discover and book bespoke luxury salon treatments and services.",
  };

  return {
    title: config.title,
    description: config.description,
    ...(config.noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function buildRouteSalonMetadata(pathname: string, slug: string, salon: Salon | null): Metadata {
  const config = STOREFRONT_ROUTE_METADATA[pathname];
  const subTitle = pathname === "/" ? undefined : config?.title;
  return buildSalonMetadata({
    slug,
    salon,
    subTitle,
    descriptionSuffix: config?.description,
    subPath: pathname === "/" ? "" : pathname,
    noIndex: config?.noIndex,
  });
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
  const rawSalonName = salon?.name || formatSalonSlugTitle(slug);
  const salonName = formatTitleCase(rawSalonName);
  const title = subTitle ? `${subTitle} — ${salonName}` : `${salonName} — Luxury Salon & Spa Sanctuary`;

  const defaultDesc =
    salon?.about ||
    `Book luxury haircuts, styling, coloring, and spa treatments online at ${salonName}. View artisan stylists, transparent pricing, and instant slot availability.`;

  const description = descriptionSuffix ? `${descriptionSuffix} at ${salonName}.` : defaultDesc;
  const canonicalUrl = `${siteUrl}/salons/${slug}${subPath}`;
  const imageUrl = getSalonImage(salon);
  const faviconUrl = salon?.logo || "/favicon.ico";

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
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

