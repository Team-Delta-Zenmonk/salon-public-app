"use client";
import { useAppThemeMode } from "../../../theme/theme-provider";
import { getThemeOption } from "../../../theme/themes";

export function useStripeAppearance() {
  const { themeId } = useAppThemeMode();
  const theme = getThemeOption(themeId);
  const isDark = theme.mode === "dark";
  const iconColor = theme.textMain;

  return {
    theme: isDark ? ("night" as const) : ("stripe" as const),
    variables: {
      colorPrimary: theme.primary,
      colorBackground: theme.surface,
      colorText: theme.textMain,
      colorDanger: theme.error,
      colorTextSecondary: theme.textMuted,
      colorBorder: theme.border,
      colorIcon: iconColor,
      colorIconTab: iconColor,
      colorIconTabSelected: iconColor,
      colorIconTabHover: iconColor,
      colorIconCard: iconColor,
      colorBackgroundTab: theme.surfaceAlt,
      colorBackgroundTabSelected: theme.primarySoft,
      colorBorderTab: theme.border,
      colorBorderTabSelected: theme.primary,
      colorTextTab: theme.textMain,
      colorTextTabSelected: theme.textMain,
      fontFamily: "Plus Jakarta Sans, sans-serif",
      spacingUnit: "4px",
      borderRadius: `${theme.radius}px`,
    },
    rules: {
      ".Input": {
        backgroundColor: theme.surfaceAlt,
        borderColor: theme.border,
        borderWidth: "1px",
        borderStyle: "solid",
        padding: "12px 14px",
        fontSize: "14px",
        color: theme.textMain,
        boxShadow: "none",
      },
      ".Input:focus": {
        borderColor: theme.primary,
        boxShadow: `0 0 0 1px ${theme.primary}`,
      },
      ".Label": {
        fontSize: "11px",
        fontWeight: "700",
        color: theme.textMain,
        marginBottom: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
      ".Tab": {
        backgroundColor: theme.surfaceAlt,
        padding: "12px 16px",
        borderColor: theme.border,
        borderWidth: "1px",
        borderStyle: "solid",
        fontSize: "13px",
        fontWeight: "700",
        color: theme.textMain,
        boxShadow: "none",
        outline: "none",
        transition: "none",
      },
      ".Tab:hover": {
        backgroundColor: theme.surfaceAlt,
        borderColor: theme.border,
        color: theme.textMain,
        boxShadow: "none",
        outline: "none",
        transform: "none",
      },
      ".Tab--selected": {
        backgroundColor: theme.primarySoft,
        borderColor: theme.primary,
        borderWidth: "1px",
        borderStyle: "solid",
        color: theme.textMain,
        boxShadow: `0 0 0 1px ${theme.primary}`,
        outline: "none",
        transition: "none",
      },
      ".Tab--selected:hover": {
        backgroundColor: theme.primarySoft,
        borderColor: theme.primary,
        color: theme.textMain,
        boxShadow: `0 0 0 1px ${theme.primary}`,
        outline: "none",
        transform: "none",
      },
      ".Tab:focus": {
        borderColor: theme.primary,
        boxShadow: `0 0 0 1px ${theme.primary}`,
        outline: "none",
      },
      ".Tab:focus-visible": {
        borderColor: theme.primary,
        boxShadow: `0 0 0 1px ${theme.primary}`,
        outline: "none",
      },
      ".TabIcon": {
        color: iconColor,
        fill: iconColor,
        opacity: "1",
        transition: "none",
      },
      ".TabIcon--selected": {
        color: iconColor,
        fill: iconColor,
        opacity: "1",
      },
      ".TabIcon:hover": {
        color: iconColor,
        fill: iconColor,
        opacity: "1",
      },
      ".TabLabel": {
        color: theme.textMain,
        fontWeight: "700",
        transition: "none",
      },
      ".TabLabel--selected": {
        color: theme.textMain,
        fontWeight: "700",
      },
      ".TabLabel:hover": {
        color: theme.textMain,
      },
    },
  };
}