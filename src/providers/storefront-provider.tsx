"use client";
import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Salon } from "../common/salon.type";
import { getSalonSlug, clearActiveSalonSlug } from "../common/storefront-slug.utils";
import { getStorefrontProfileService } from "../features/salon/get-storefront-profile/get-storefront-profile.service";
import { getSalonService } from "../features/salon/get-salon/get-salon.service";
import { useAppDispatch } from "../store/hook";
import { setCartSalon } from "../features/salon/cart/cart.slice";
import { useAppThemeMode } from "../theme/theme-provider";
import { themeOptions, defaultThemeId } from "../theme/theme";

interface StorefrontContextType {
  salon: Salon | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  slug: string;
}

const StorefrontContext = createContext<StorefrontContextType | null>(null);

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}

export function StorefrontProvider({ children }: Readonly<{ children: ReactNode }>) {
  const dispatch = useAppDispatch();
  const { setThemeId } = useAppThemeMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!salon) return;
    const themeCode =
      salon.theme?.code ||
      salon.storefront_theme?.code ||
      (salon as any)?.storefrontTheme?.code;

    const matchedTheme = themeOptions.find((t) => t.id === themeCode);
    if (matchedTheme) {
      setThemeId(matchedTheme.id);
    } else {
      setThemeId(defaultThemeId);
    }
  }, [salon, setThemeId]);

  const searchString = searchParams ? searchParams.toString() : "";
  const resolvedSlug = useMemo(
    () => getSalonSlug(pathname || "", searchString),
    [pathname, searchString]
  );

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let salonData: Salon | null = null;
      try {
        const res = await getStorefrontProfileService(resolvedSlug);
        salonData = res.salon;
      } catch {
        salonData = await getSalonService(resolvedSlug);
      }

      if (!salonData) {
        throw new Error(`Salon '${resolvedSlug}' was not found or is currently inactive.`);
      }

      setSalon(salonData);
      dispatch(setCartSalon(salonData));

      if (typeof document !== "undefined" && salonData?.name) {
        document.title = `${salonData.name} | Book Online`;
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Unable to load salon. Please check the address or handle.`
      );
    } finally {
      setLoading(false);
    }
  }, [resolvedSlug, dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--app-bg)" }}>
        <Box
          style={{
            height: "4rem",
            borderBottom: "1px solid var(--app-border)",
            backgroundColor: "var(--app-surface)",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Skeleton variant="rounded" width={38} height={38} style={{ borderRadius: "0.75rem" }} />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
          <Box style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Skeleton variant="rounded" width={80} height={36} style={{ borderRadius: "0.75rem" }} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>

        <Box style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Skeleton variant="rounded" height={220} style={{ borderRadius: "0.75rem" }} />
          <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--app-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <Box
          style={{
            width: "4.5rem",
            height: "4.5rem",
            borderRadius: "0.75rem",
            backgroundColor: "var(--app-surface)",
            border: "1px solid var(--app-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <StorefrontIcon style={{ fontSize: "36px", color: "var(--app-muted)" }} />
        </Box>
        <Typography
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "var(--app-text)",
          }}
        >
          Salon Not Found
        </Typography>
        <Typography
          style={{
            fontSize: "0.875rem",
            color: "var(--app-muted)",
            maxWidth: "28rem",
            marginTop: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {error || "The salon you are looking for is inactive or does not exist."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            clearActiveSalonSlug();
            window.location.href = "/?salon=glow";
          }}
          startIcon={<ArrowBackIcon style={{ fontSize: "16px" }} />}
          style={{
            borderRadius: "1rem",
            padding: "0.625rem 1.5rem",
            fontWeight: 700,
            fontSize: "0.75rem",
            backgroundColor: "var(--app-primary)",
            color: "var(--app-surface)",
          }}
        >
          Go to Glow Salon
        </Button>
      </Box>
    );
  }

  return (
    <StorefrontContext.Provider
      value={{
        salon,
        loading,
        error,
        refetch: fetchProfile,
        slug: resolvedSlug,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export default StorefrontProvider;
