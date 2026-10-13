import type { MetadataRoute } from "next";
import { defaultAppTheme } from "@/theme/theme";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Veloura";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${appName} — Luxury Salon & Spa Sanctuary`,
    short_name: appName,
    description:
      "Discover and book bespoke luxury salon treatments, master scissorsmiths, and clinical rituals.",
    start_url: "/",
    display: "standalone",
    background_color: defaultAppTheme.background,
    theme_color: defaultAppTheme.primary,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
