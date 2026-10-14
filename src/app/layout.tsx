import type { Metadata, Viewport } from "next";
import Providers from "@/providers";
import { defaultAppTheme } from "@/theme/theme";
import "../index.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Veloura";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://salon-public-app.vercel.app";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export const viewport: Viewport = {
  themeColor: defaultAppTheme.primary,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${appName} — Luxury Salon & Spa Sanctuary`,
    template: `%s | ${appName}`,
  },

  description:
    "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals. Effortless online appointments, premium spa services, and curated hair care.",

  applicationName: `${appName} Salon`,

  keywords: [
    "salon booking",
    "book salon appointment online",
    "hair salon near me",
    "beauty parlour booking",
    "luxury salon online booking",
    "haircut and styling appointment",
    "hair coloring and highlights",
    "keratin hair treatment",
    "hair spa rituals",
    "bridal makeup artist",
    "pre bridal packages",
    "facial rituals and skincare",
    "nail art and manicure pedicure",
    "men grooming salon",
    "women beauty parlour",
    "unisex salon near me",
    "spa and wellness sanctuary",
    "massage and relaxation therapy",
    "verified hair stylists",
    "salon service price list",
    "instant salon slot booking",
    appName,
    `${appName} Salon`,
  ],

  authors: [{ name: `${appName} Salon & Spa` }],
  creator: `${appName} Salon & Spa`,
  publisher: `${appName} Salon & Spa`,

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: `${appName} Luxury Salon`,
    title: `${appName} — Luxury Salon & Spa Sanctuary`,
    description:
      "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals. Effortless online appointments with premium stylists.",
  },
  twitter: {
    card: "summary",
    title: `${appName} — Luxury Salon & Spa Sanctuary`,
    description:
      "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals.",
  },

  icons: {
    icon: "/favicon.ico",
  },

  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),

  category: "Beauty & Personal Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var stored = localStorage.getItem('salon-user-app-theme');
    if (stored) {
      document.documentElement.dataset.theme = stored;
    }
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
