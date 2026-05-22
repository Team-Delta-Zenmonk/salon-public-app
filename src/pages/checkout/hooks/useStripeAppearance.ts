import { useTheme } from "@mui/material";

export function useStripeAppearance() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    theme: isDark ? ("night" as const) : ("flat" as const),
    variables: {
      colorPrimary: theme.palette.primary.main,
      colorBackground: isDark ? theme.palette.background.paper : "#ffffff",
      colorText: isDark ? theme.palette.text.primary : "#1e293b",
      colorDanger: "#ef4444",
      fontFamily: theme.typography.fontFamily,
      spacingUnit: "4px",
      borderRadius: "10px",
    },
    rules: {
      ".Input": {
        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#fcfcfc",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #eef2f6",
        padding: "10px 14px",
        fontSize: "14px",
        color: isDark ? "#ffffff" : "#1e293b",
      },
      ".Label": {
        fontSize: "12px",
        fontWeight: "700",
        color: isDark ? "#94a3b8" : "#475569",
        marginBottom: "6px",
        textTransform: "none",
      },
      ".Tab": {
        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
        padding: "8px 16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #eef2f6",
        fontSize: "13px",
        fontWeight: "700",
        color: isDark ? "#ffffff" : "#1e293b",
      },
    },
  };
}