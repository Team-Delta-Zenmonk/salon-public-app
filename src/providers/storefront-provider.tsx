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
import { getThemeOption } from "../theme/theme";
import styles from "./storefront-provider.module.css";

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

    const matched = getThemeOption(themeCode);
    setThemeId(matched.id);
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
      <Box className={styles.loadingContainer}>
        <Box className={styles.loadingHeader}>
          <Box className={styles.loadingHeaderLeft}>
            <Skeleton variant="rounded" width={38} height={38} className={styles.skeletonRoundedSm} />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
          <Box className={styles.loadingHeaderRight}>
            <Skeleton variant="rounded" width={80} height={36} className={styles.skeletonRoundedSm} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>

        <Box className={styles.loadingBody}>
          <Skeleton variant="rounded" height={220} className={styles.skeletonRoundedSm} />
          <Box className={styles.loadingGrid}>
            <Skeleton variant="rounded" height={140} className={styles.skeletonRoundedLg} />
            <Skeleton variant="rounded" height={140} className={styles.skeletonRoundedLg} />
            <Skeleton variant="rounded" height={140} className={styles.skeletonRoundedLg} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box className={styles.errorContainer}>
        <Box className={styles.errorIconBox}>
          <StorefrontIcon />
        </Box>
        <Typography className={styles.errorTitle}>
          Salon Not Found
        </Typography>
        <Typography className={styles.errorDescription}>
          {error || "The salon you are looking for is inactive or does not exist."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            clearActiveSalonSlug();
            window.location.href = "/?salon=glow";
          }}
          startIcon={<ArrowBackIcon />}
          className={styles.errorBackButton}
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
