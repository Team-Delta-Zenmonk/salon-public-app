export const getSnackBarStyles = (state: string) => {
  return {
    backgroundColor: "var(--app-surface)",
    color: "var(--app-text)",
    border: "1px solid var(--app-border)",
    boxShadow: "0px 12px 30px rgba(15, 23, 42, 0.08)",
    borderRadius: "16px",
    width: "max-content",
    maxWidth: "calc(100vw - 32px)",
  };
};
