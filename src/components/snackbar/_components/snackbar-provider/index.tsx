"use client";
import { SnackbarProvider } from "notistack";

const SnackbarProviderWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SnackbarProvider
      maxSnack={2}
      hideIconVariant
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      style={{ zIndex: 9999 }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarProviderWrapper;
