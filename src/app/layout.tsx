import type { Metadata, Viewport } from "next";
import Providers from "@/providers";
import "../index.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Veloura | Luxury Salon & Spa Sanctuary",
  description: "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-screen bg-(--app-bg) text-(--app-text) antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
