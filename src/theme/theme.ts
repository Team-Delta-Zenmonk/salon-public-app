"use client";

import { createTheme, responsiveFontSizes, type PaletteMode } from "@mui/material/styles";

export type AppThemeId =
  | "crimsonShear"
  | "obsidianFlame"
  | "vintageBlush"
  | "midnightSapphire"
  | "softRosePearl";

export interface AppThemeOption {
  id: AppThemeId;
  label: string;
  mode: PaletteMode;
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
}

const mediumPalette = {
  50: "#fffde7",
  100: "#fff9c4",
  200: "#fff59d",
  300: "#fff176",
  400: "#ffee58",
  500: "#ffeb3b",
  600: "#fdd835",
  700: "#fbc02d",
  800: "#f9a825",
  900: "#f57f17",
};

const appThemes: AppThemeOption[] = [
  {
    id: "crimsonShear",
    label: "Crimson & Shear (Dark)",
    mode: "dark",
    fontFamily: '"Plus Jakarta Sans", "Playfair Display", sans-serif',
    radius: 8,
    surface: "#141318",
    surfaceAlt: "#1c1b20",
    primary: "#ffb3b4",
    primarySoft: "rgba(255, 82, 98, 0.15)",
    textMain: "#e5e1e8",
    textMuted: "#e6bcbc",
    border: "#5d3f3f",
    background: "#141318",
    heroFrom: "#141318",
    heroTo: "#201f24",
    ring: "#ffb3b4",
    chipTone: "rgba(255, 82, 98, 0.08)",
  },
  {
    id: "obsidianFlame",
    label: "Obsidian Flame (Ultra Dark Gold)",
    mode: "dark",
    fontFamily: '"Plus Jakarta Sans", "Playfair Display", sans-serif',
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
  },
  {
    id: "vintageBlush",
    label: "Vintage Blush (Haute Warm Light)",
    mode: "light",
    fontFamily: '"Plus Jakarta Sans", "Playfair Display", sans-serif',
    radius: 10,
    surface: "#fffaf7",
    surfaceAlt: "#f9efea",
    primary: "#b84252",
    primarySoft: "rgba(184, 66, 82, 0.1)",
    textMain: "#2d2325",
    textMuted: "#7a6367",
    border: "#e8d3cb",
    background: "#fdf6f2",
    heroFrom: "#fdf6f2",
    heroTo: "#f5e8e2",
    ring: "#b84252",
    chipTone: "rgba(184, 66, 82, 0.06)",
  },
  {
    id: "midnightSapphire",
    label: "Midnight Sapphire (Royal Blue)",
    mode: "dark",
    fontFamily: '"Plus Jakarta Sans", "Playfair Display", sans-serif',
    radius: 10,
    surface: "#0b1329",
    surfaceAlt: "#131d3b",
    primary: "#7da8ff",
    primarySoft: "rgba(125, 168, 255, 0.15)",
    textMain: "#e8efff",
    textMuted: "#9eb5e6",
    border: "#233766",
    background: "#060c1c",
    heroFrom: "#060c1c",
    heroTo: "#101a36",
    ring: "#7da8ff",
    chipTone: "rgba(125, 168, 255, 0.08)",
  },
  {
    id: "softRosePearl",
    label: "Soft Rose Pearl (Luxury Light)",
    mode: "light",
    fontFamily: '"Plus Jakarta Sans", "Playfair Display", sans-serif',
    radius: 12,
    surface: "#ffffff",
    surfaceAlt: "#fcf4f6",
    primary: "#d6536b",
    primarySoft: "rgba(214, 83, 107, 0.12)",
    textMain: "#1f1719",
    textMuted: "#6b595c",
    border: "#f0d8de",
    background: "#faf4f6",
    heroFrom: "#faf4f6",
    heroTo: "#f5e4e8",
    ring: "#d6536b",
    chipTone: "rgba(214, 83, 107, 0.08)",
  },
];

export const themeOptions = appThemes;
export const defaultThemeId: AppThemeId = "crimsonShear";

const getThemeOption = (themeId: AppThemeId) => appThemes.find((theme) => theme.id === themeId) ?? appThemes[0];

export const createAppTheme = (themeId: AppThemeId = defaultThemeId) => {
  const selected = getThemeOption(themeId);
  const isDark = selected.mode === "dark";
  const breakpoints = createTheme().breakpoints;

  const theme = createTheme({
    colors: {
      medium: mediumPalette,
    },
    general: {
      borderColor: selected.border,
      placeholderColor: selected.textMuted,
    },
    fontWeight: {
      bold: 700,
      semiBold: 600,
      regular: 400,
    },
    breakpoints: {
      values: { xs: 0, sm: 640, md: 900, lg: 1200, xl: 1536 },
    },
    shape: {
      borderRadius: selected.radius,
    },
    palette: {
      mode: selected.mode,
      primary: {
        main: selected.primary,
        light: selected.primarySoft,
        dark: selected.primary,
      },
      secondary: {
        main: selected.textMuted,
        light: selected.surfaceAlt,
        dark: selected.textMain,
      },
      text: {
        primary: selected.textMain,
        secondary: selected.textMuted,
      },
      background: {
        default: selected.background,
        paper: selected.surface,
      },
      divider: selected.border,
    },
    typography: {
      fontFamily: selected.fontFamily,
      fontWeightBold: 700,
      fontWeightMedium: 600,
      fontWeightLight: 400,
      h1: { fontSize: "2.1rem", lineHeight: 1.2, letterSpacing: "-0.03em" },
      h2: { fontSize: "1.8rem", lineHeight: 1.25, letterSpacing: "-0.02em" },
      h3: { fontSize: "1.55rem", lineHeight: 1.32, letterSpacing: "-0.01em" },
      h4: { fontSize: "1.3rem", lineHeight: 1.35 },
      h5: { fontSize: "1.1rem", lineHeight: 1.4 },
      h6: { fontSize: "1rem", lineHeight: 1.45 },
      paragraphLg: { fontSize: "1rem", lineHeight: 1.7 },
      paragraphMd: { fontSize: "0.9rem", lineHeight: 1.55 },
      paragraphSm: { fontSize: "0.8rem", lineHeight: 1.5 },
      paragraphXs: { fontSize: "0.72rem", lineHeight: 1.4 },
      paragraphButton: { fontSize: "0.9rem", lineHeight: 1.5, fontWeight: 700 },
      paragraphTable: { fontSize: "0.8rem", lineHeight: 1.4 },
      titleLg: { fontSize: "1.4rem", lineHeight: 1.45, fontWeight: 700 },
      titleMd: { fontSize: "1.2rem", lineHeight: 1.45, fontWeight: 700 },
      titleSm: { fontSize: "1rem", lineHeight: 1.5, fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { scrollBehavior: "smooth" },
          body: {
            margin: 0,
            padding: 0,
            overflowX: "hidden",
            overflowY: "auto",
            minHeight: "100%",
            color: selected.textMain,
            backgroundColor: selected.background,
          },
          ":root": {
            "--app-bg": selected.background,
            "--app-surface": selected.surface,
            "--app-surface-alt": selected.surfaceAlt,
            "--app-border": selected.border,
            "--app-primary": selected.primary,
            "--app-primary-soft": selected.primarySoft,
            "--app-text": selected.textMain,
            "--app-muted": selected.textMuted,
            "--app-hero-from": selected.heroFrom,
            "--app-hero-to": selected.heroTo,
            "--app-ring": selected.ring,
            "--app-chip-tone": selected.chipTone,
          },
          "::-webkit-scrollbar": {
            height: "8px",
            width: "8px",
            backgroundColor: "transparent",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            borderRadius: "999px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
            "&:hover": {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: `${selected.radius}px`,
            border: `1px solid ${selected.border}`,
            boxShadow: isDark ? "0 14px 36px rgba(2,6,23,0.45)" : "0 14px 36px rgba(15,23,42,0.08)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: `${selected.radius + 4}px`,
            border: `1px solid ${selected.border}`,
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: `${selected.radius}px`,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: "42px",
            paddingLeft: "20px",
            paddingRight: "20px",
            borderRadius: `${Math.max(10, selected.radius - 2)}px`,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.02em",
            transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
          contained: {
            backgroundColor: selected.primary,
            color: isDark ? "#0c0a0d" : "#ffffff",
            boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.35)" : "0 8px 20px rgba(0,0,0,0.12)",
            "&:hover": {
              backgroundColor: selected.primary,
              filter: "brightness(1.08)",
              boxShadow: isDark ? "0 12px 28px rgba(0,0,0,0.45)" : "0 12px 28px rgba(0,0,0,0.18)",
              transform: "translateY(-1.5px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          outlined: {
            borderColor: selected.border,
            color: selected.textMain,
            backgroundColor: "transparent",
            "&:hover": {
              borderColor: selected.primary,
              backgroundColor: selected.primarySoft,
              color: selected.textMain,
            },
          },
          text: {
            color: selected.primary,
            "&:hover": {
              backgroundColor: selected.primarySoft,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.02em",
            border: `1px solid ${selected.border}`,
            backgroundColor: selected.surfaceAlt,
            color: selected.textMain,
          },
          filled: {
            backgroundColor: selected.chipTone,
            color: selected.textMain,
            borderColor: selected.border,
          },
          outlined: {
            backgroundColor: "transparent",
            borderColor: selected.border,
            color: selected.textMain,
          },
          label: {
            paddingLeft: "10px",
            paddingRight: "10px",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${selected.border}`,
            backgroundColor: isDark ? "rgba(11,18,32,0.78)" : "rgba(255,255,255,0.78)",
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 700,
            minWidth: "18px",
            height: "18px",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            border: `1px solid ${selected.border}`,
            backgroundColor: selected.surfaceAlt,
            color: selected.textMain,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: selected.textMuted,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: `${Math.max(12, selected.radius - 2)}px`,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: selected.border,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: selected.textMuted,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: selected.primary,
              borderWidth: "1.5px",
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef4444",
            },
          },
          input: {
            color: selected.textMain,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: selected.textMuted,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: selected.textMuted,
            top: "-2.5px",
          },
          shrink: {
            top: "1px",
            backgroundColor: selected.surface,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: {
            [breakpoints.down("sm")]: { fontSize: "1.8rem" },
          },
          h2: {
            [breakpoints.down("sm")]: { fontSize: "1.55rem" },
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
