import {
  HOME_SECTION_KEYS,
  type HeaderLayoutConfig,
  type HomeLayoutConfig,
  type ThemePageLayouts,
} from "./layout.types";

export const defaultHeaderLayout: HeaderLayoutConfig = {
  variant: "split-center",
};

export const defaultHomeLayout: HomeLayoutConfig = {
  sectionOrder: ["hero", "pillars", "services", "specialists"],
  heroVariant: "split-bento",
  servicesVariant: "grid",
};

export const defaultLayouts: ThemePageLayouts = {
  header: defaultHeaderLayout,
  home: defaultHomeLayout,
};

export const PAGE_LAYOUTS = {
  header: {
    defaults: defaultHeaderLayout,
    sectionKeys: [] as readonly string[],
  },
  home: {
    defaults: defaultHomeLayout,
    sectionKeys: HOME_SECTION_KEYS,
  },
} as const;
