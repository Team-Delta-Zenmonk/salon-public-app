import { useTheme } from "@mui/material";

export function useStripeAppearance() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    theme: isDark ? ("night" as const) : ("stripe" as const),
    variables: {
      colorPrimary: "var(--app-primary)",
      colorBackground: "var(--app-surface)",
      colorText: "var(--app-text)",
      colorDanger: "#ef4444",
      colorTextSecondary: "var(--app-muted)",
      colorBorder: "var(--app-border)",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      spacingUnit: "4px",
      borderRadius: "12px",
    },
    rules: {
      ".Input": {
        backgroundColor: "var(--app-surface-alt)",
        borderColor: "var(--app-border)",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: "12px 14px",
        fontSize: "14px",
        color: "var(--app-text)",
        boxShadow: "none",
      },
      ".Input:focus": {
        borderColor: "var(--app-primary)",
        boxShadow: "0 0 0 1px var(--app-primary)",
      },
      ".Label": {
        fontSize: "11px",
        fontWeight: "700",
        color: "var(--app-text)",
        marginBottom: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
      ".Tab": {
        backgroundColor: "var(--app-surface-alt)",
        padding: "12px 16px",
        borderColor: "var(--app-border)",
        borderWidth: "1px",
        borderStyle: "solid",
        fontSize: "13px",
        fontWeight: "700",
        color: "var(--app-muted)",
        boxShadow: "none",
        outline: "none",
      },
      ".Tab--selected": {
        backgroundColor: "var(--app-primary-soft)",
        borderColor: "var(--app-primary)",
        color: "var(--app-text)",
        boxShadow: "0 0 0 1px var(--app-primary)",
        outline: "none",
      },
      ".Tab:focus": {
        borderColor: "var(--app-primary)",
        boxShadow: "0 0 0 1px var(--app-primary)",
        outline: "none",
      },
      ".Tab:focus-visible": {
        borderColor: "var(--app-primary)",
        boxShadow: "0 0 0 1px var(--app-primary)",
        outline: "none",
      },
      ".Tab:hover": {
        color: "var(--app-text)",
        borderColor: "var(--app-primary)",
      },
    },
  };
}