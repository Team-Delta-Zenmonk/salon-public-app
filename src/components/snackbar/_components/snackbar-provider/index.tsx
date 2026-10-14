"use client";
import { SnackbarProvider } from "notistack";

const SnackbarProviderWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SnackbarProvider
      maxSnack={2}
      hideIconVariant
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      className="snackbarContainer"
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarProviderWrapper;
