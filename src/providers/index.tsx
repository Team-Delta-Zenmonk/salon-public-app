"use client";
import React, { Suspense } from "react";
import { StyledEngineProvider } from "@mui/material";
import ThemeProviderWrapper from "@/theme/theme-provider";
import StoreProvider from "@/app/store-provider";
import SnackbarProviderWrapper from "@/components/snackbar/_components/snackbar-provider";
import StorefrontProvider from "@/providers/storefront-provider";
import AuthSync from "@/providers/auth-sync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProviderWrapper>
        <StoreProvider>
          <SnackbarProviderWrapper>
            <Suspense fallback={null}>
              <StorefrontProvider>
                <AuthSync />
                {children}
              </StorefrontProvider>
            </Suspense>
          </SnackbarProviderWrapper>
        </StoreProvider>
      </ThemeProviderWrapper>
    </StyledEngineProvider>
  );
}
