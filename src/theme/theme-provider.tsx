"use client";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createAppTheme, defaultThemeId, themeOptions } from "./theme";
import type { AppThemeId } from "./theme";

interface ThemeContextValue {
  themeId: AppThemeId;
  setThemeId: (themeId: AppThemeId) => void;
}

const AppThemeContext = createContext<ThemeContextValue>({
  themeId: defaultThemeId,
  setThemeId: () => undefined,
});

const STORAGE_KEY = "salon-user-app-theme";

export const useAppThemeMode = () => useContext(AppThemeContext);

export default function ThemeProviderWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [themeId, setThemeId] = useState<AppThemeId>(() => {
    if (typeof window === "undefined") return defaultThemeId;
    try {
      const cached = localStorage.getItem(STORAGE_KEY) as AppThemeId | null;
      return themeOptions.some((option) => option.id === cached) ? cached! : defaultThemeId;
    } catch {
      return defaultThemeId;
    }
  });

  const theme = useMemo(() => createAppTheme(themeId), [themeId]);

  const themeContextValue = useMemo(() => ({ themeId, setThemeId }), [themeId, setThemeId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const selected = themeOptions.find((t) => t.id === themeId) ?? themeOptions[0];
      localStorage.setItem(STORAGE_KEY, themeId);
      const root = document.documentElement;
      root.dataset.theme = themeId;
      root.style.setProperty("--app-bg", selected.background);
      root.style.setProperty("--app-surface", selected.surface);
      root.style.setProperty("--app-surface-alt", selected.surfaceAlt);
      root.style.setProperty("--app-border", selected.border);
      root.style.setProperty("--app-primary", selected.primary);
      root.style.setProperty("--app-primary-soft", selected.primarySoft);
      root.style.setProperty("--app-text", selected.textMain);
      root.style.setProperty("--app-muted", selected.textMuted);
      root.style.setProperty("--app-hero-from", selected.heroFrom);
      root.style.setProperty("--app-hero-to", selected.heroTo);
      root.style.setProperty("--app-ring", selected.ring);
      root.style.setProperty("--app-chip-tone", selected.chipTone);
      root.style.setProperty(
        "--app-primary-contrast",
        theme.palette.getContrastText(selected.primary)
      );
    } catch {}
  }, [themeId, theme]);

  return (
    <AppRouterCacheProvider options={{ key: "css", prepend: true, enableCssLayer: false }}>
      <StyledEngineProvider injectFirst>
        <AppThemeContext.Provider value={themeContextValue}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppThemeContext.Provider>
      </StyledEngineProvider>
    </AppRouterCacheProvider>
  );
}
