import type { AppThemeDefinition } from "./layout.types";

const GLOBAL_FONT_FAMILY = "var(--app-font-family, 'Plus Jakarta Sans', sans-serif)";

export const appThemes = [
  {
    id: "crimsonShear",
    label: "Atelier Solstice (Warm Alabaster Luxury)",
    mode: "light",
    fontFamily: GLOBAL_FONT_FAMILY,
    radius: 4,
    surface: "#FCFAF7",
    surfaceAlt: "#F6F3ED",
    primary: "#1C1A17",
    primarySoft: "rgba(168, 139, 100, 0.12)",
    textMain: "#1C1C18",
    textMuted: "#766A5E",
    border: "#E5DFD5",
    background: "#FCF9F3",
    heroFrom: "#FCF9F3",
    heroTo: "#F6F3ED",
    ring: "#A88B64",
    chipTone: "rgba(168, 139, 100, 0.08)",
    success: "#10b981",
    warning: "#fbbf24",
    info: "#3b82f6",
    error: "#f472b6",
    shadowBase: "rgba(0,0,0,0.18)",
    layout: {
      header: {
        variant: "split-center",
      },
      home: {
        sectionOrder: ["hero", "pillars", "services", "specialists"],
        heroVariant: "split-bento",
        servicesVariant: "grid",
      },
    },
  },
  {
    id: "obsidianFlame",
    label: "Obsidian Flame (Ultra Dark Gold)",
    mode: "dark",
    fontFamily: GLOBAL_FONT_FAMILY,
    radius: 12,
    surface: "#0c0a0d",
    surfaceAlt: "#151218",
    primary: "#f3c677",
    primarySoft: "rgba(243, 198, 119, 0.15)",
    textMain: "#f7f5f0",
    textMuted: "#c4bcae",
    border: "#3d3224",
    background: "#09080b",
    heroFrom: "#09080b",
    heroTo: "#16131c",
    ring: "#f3c677",
    chipTone: "rgba(243, 198, 119, 0.1)",
    success: "#10b981",
    warning: "#fbbf24",
    info: "#3b82f6",
    error: "#f472b6",
    shadowBase: "rgba(0,0,0,0.18)",
    layout: {
      header: {
        variant: "left-inline",
      },
      home: {
        sectionOrder: ["hero", "specialists", "services", "pillars"],
        heroVariant: "centered-minimal",
        servicesVariant: "two-column-list",
      },
    },
  },
  {
    id: "lightGothic",
    label: "Light Gothic (Luxury Light)",
    mode: "light",
    fontFamily: "'Outfit', sans-serif",
    radius: 8,
    surface: "#FFFFFF",
    surfaceAlt: "#ECE7DE",
    primary: "#7A1C28",
    primarySoft: "#EFE6E8",
    textMain: "#1A1518",
    textMuted: "#665E62",
    border: "rgba(122, 28, 40, 0.18)",
    background: "#F5F2EB",
    heroFrom: "#F5F2EB",
    heroTo: "#ECE7DE",
    ring: "#C5A059",
    chipTone: "#EFE6E8",
    success: "#10b981",
    warning: "#fbbf24",
    info: "#3b82f6",
    error: "#7A1C28",
    shadowBase: "rgba(26, 21, 24, 0.06)",
    layout: {
      header: {
        variant: "split-center",
      },
      home: {
        sectionOrder: ["hero", "services", "specialists", "pillars"],
        heroVariant: "full-bleed-showcase",
        servicesVariant: "compact-accordion",
      },
    },
  },
] as const satisfies readonly AppThemeDefinition[];

export type AppThemeId = (typeof appThemes)[number]["id"];
export type AppThemeOption = (typeof appThemes)[number];

export const themeOptions = appThemes;
export const defaultThemeId: AppThemeId = "crimsonShear";
export const defaultAppTheme: AppThemeOption = appThemes[0];

export const getThemeOption = (themeId?: string): AppThemeOption => {
  if (!themeId) return defaultAppTheme;
  return appThemes.find((theme) => theme.id === themeId) ?? defaultAppTheme;
};
