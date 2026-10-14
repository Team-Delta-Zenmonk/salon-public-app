export const HOME_SECTION_KEYS = ["hero", "pillars", "services", "specialists"] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export const HOME_HERO_VARIANTS = ["split-bento", "centered-minimal", "full-bleed-showcase"] as const;
export type HomeHeroVariant = (typeof HOME_HERO_VARIANTS)[number];

export const HOME_SERVICES_VARIANTS = ["grid", "two-column-list", "compact-accordion"] as const;
export type HomeServicesVariant = (typeof HOME_SERVICES_VARIANTS)[number];

export const NAVBAR_VARIANTS = ["split-center", "unified-right", "left-inline"] as const;
export type NavbarVariant = (typeof NAVBAR_VARIANTS)[number];

export interface HeaderLayoutConfig {
  variant: NavbarVariant;
}

export interface HomeLayoutConfig {
  sectionOrder: readonly HomeSectionKey[];
  heroVariant: HomeHeroVariant;
  servicesVariant: HomeServicesVariant;
}

export interface ThemePageLayouts {
  header: HeaderLayoutConfig;
  home: HomeLayoutConfig;
}

export type PartialThemePageLayouts = {
  [K in keyof ThemePageLayouts]?: Partial<ThemePageLayouts[K]>;
};

export interface AppThemeDefinition {
  id: string;
  label: string;
  mode: "light" | "dark";
  fontFamily: string;
  radius: number;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primarySoft: string;
  textMain: string;
  textMuted: string;
  border: string;
  background: string;
  heroFrom: string;
  heroTo: string;
  ring: string;
  chipTone: string;
  success: string;
  warning: string;
  info: string;
  error: string;
  shadowBase: string;
  layout?: PartialThemePageLayouts;
}
