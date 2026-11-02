export const getSnackBarStyles = (state: string) => {
  return {
    backgroundColor: "var(--app-surface)",
    color: "var(--app-text)",
    border: "1px solid var(--app-border)",
    boxShadow: "0px 12px 30px rgba(15, 23, 42, 0.08)",
    borderRadius: "16px",
    width: "fit-content",
    maxWidth: "min(480px, calc(100vw - 32px))",
  };
};
