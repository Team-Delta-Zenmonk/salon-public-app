import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
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
    if (typeof globalThis === "undefined") return defaultThemeId;
    const cached = localStorage.getItem(STORAGE_KEY) as AppThemeId | null;
    return themeOptions.some((option) => option.id === cached) ? cached! : defaultThemeId;
  });

  const theme = useMemo(() => createAppTheme(themeId), [themeId]);

  const themeContextValue = useMemo(() => ({ themeId, setThemeId }), [themeId, setThemeId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
    document.documentElement.dataset.theme = themeId;
    document.documentElement.style.setProperty(
      "--app-primary-contrast",
      theme.palette.getContrastText(theme.palette.primary.main),
    );
  }, [themeId, theme]);

  return (
    <StyledEngineProvider>
      <AppThemeContext.Provider value={themeContextValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppThemeContext.Provider>
    </StyledEngineProvider>
  );
}
