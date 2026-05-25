"use client";

import { createTheme, responsiveFontSizes, type PaletteMode } from "@mui/material/styles";

export type AppThemeId =
  | "luxuryBw"
  | "elegantLight"
  | "premiumDark"
  | "softGold"
  | "neonPop"
  | "midnightPurple"
  | "peachyCoral"
  | "cyberMint"
  | "obsidian"
  | "midnightNeon"
  | "carbon"
  | "bloodMoon"
  | "eclipseHorror";

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
    id: "luxuryBw",
    label: "Luxury B&W",
    mode: "light",
    fontFamily: '"DM Sans", "Inter", "sans-serif"',
    radius: 16,
    surface: "#ffffff",
    surfaceAlt: "#f7f7f7",
    primary: "#111111",
    primarySoft: "#ececec",
    textMain: "#121212",
    textMuted: "#5f5f5f",
    border: "#dfdfdf",
    background: "#f3f3f3",
    heroFrom: "#101010",
    heroTo: "#404040",
    ring: "#262626",
    chipTone: "#f5f5f5",
  },
  {
    id: "softGold",
    label: "Soft Gold",
    mode: "light",
    fontFamily: '"Manrope", "Inter", "sans-serif"',
    radius: 18,
    surface: "#fffdfa",
    surfaceAlt: "#f8f3e9",
    primary: "#8a6a2f",
    primarySoft: "#efe3c8",
    textMain: "#2f2417",
    textMuted: "#7c6a4f",
    border: "#e8dbc0",
    background: "#f7f0e3",
    heroFrom: "#8a6a2f",
    heroTo: "#c9ab74",
    ring: "#a37a34",
    chipTone: "#f7edd6",
  },
  {
    id: "neonPop",
    label: "Neon Pop",
    mode: "light",
    fontFamily: '"Space Grotesk", "Inter", "sans-serif"',
    radius: 16,
    surface: "#ffffff",
    surfaceAlt: "#f6f8ff",
    primary: "#ff2e93",
    primarySoft: "#ffd6ea",
    textMain: "#17122e",
    textMuted: "#675d8a",
    border: "#e4dcff",
    background: "#f3f1ff",
    heroFrom: "#ff2e93",
    heroTo: "#6d4aff",
    ring: "#8b5cf6",
    chipTone: "#efe9ff",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    mode: "dark",
    fontFamily: '"Sora", "Inter", "sans-serif"',
    radius: 18,
    surface: "#0d0b14",
    surfaceAlt: "#090710",
    primary: "#b392ff",
    primarySoft: "#2b1f45",
    textMain: "#f6f2ff",
    textMuted: "#b6a8d4",
    border: "#2a2140",
    background: "#040308",
    heroFrom: "#120a22",
    heroTo: "#4c1d95",
    ring: "#c4b5fd",
    chipTone: "#171025",
  },
  {
    id: "carbon",
    label: "Carbon",
    mode: "dark",
    fontFamily: '"Manrope", "Inter", "sans-serif"',
    radius: 16,
    surface: "#1b1b1d",
    surfaceAlt: "#141416",
    primary: "#f59e0b",
    primarySoft: "#3a2a14",
    textMain: "#f7f4ef",
    textMuted: "#b8aea1",
    border: "#3a3330",
    background: "#101012",
    heroFrom: "#1c1b1b",
    heroTo: "#6b3d16",
    ring: "#fbbf24",
    chipTone: "#262221",
  },
];

export const themeOptions = appThemes;
export const defaultThemeId: AppThemeId = "softGold";

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
            overflow: "hidden",
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
            minHeight: "40px",
            borderRadius: `${Math.max(10, selected.radius - 4)}px`,
            textTransform: "none",
            fontWeight: 700,
            transition: "all 180ms ease",
          },
          contained: {
            boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 12px 24px rgba(15,23,42,0.16)",
          },
        },
        variants: [
          {
            props: { variant: "contained" },
            style: {
              backgroundColor: selected.primary,
              color: isDark ? "#0b1220" : "#ffffff",
              "&:hover": {
                backgroundColor: selected.primary,
                filter: "brightness(0.95)",
                transform: "translateY(-1px)",
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              borderColor: selected.border,
              color: selected.textMain,
              "&:hover": {
                borderColor: selected.primary,
                backgroundColor: selected.primarySoft,
              },
            },
          },
        ],
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "999px",
            border: `1px solid ${selected.border}`,
            fontWeight: 600,
            backgroundColor: selected.chipTone,
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
