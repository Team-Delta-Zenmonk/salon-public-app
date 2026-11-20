"use client";
import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Salon } from "../common/salon.type";
import { getSalonSlug, clearActiveSalonSlug, getNormalizedStorefrontPath } from "../common/storefront-slug.utils";
import { STOREFRONT_ROUTE_METADATA, formatTitleCase } from "../components/seo/salon-seo.utils";
import { getStorefrontProfileService } from "../features/salon/get-storefront-profile/get-storefront-profile.service";
import { getSalonService } from "../features/salon/get-salon/get-salon.service";
import { useAppDispatch } from "../store/hook";
import { setCartSalon } from "../features/salon/cart/cart.slice";
import { useAppThemeMode } from "../theme/theme-provider";
import { getThemeOption } from "../theme/theme";
import { formatAddress } from "../common/address.utils";
import styles from "./storefront-provider.module.css";

const SALON_PROFILE_CACHE_KEY = "zenmonk_salon_profile_";
export const SALON_FAVICON_CACHE_KEY = "zenmonk_active_salon_favicon";


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

  const searchString = searchParams ? searchParams.toString() : "";
  const resolvedSlug = useMemo(
    () => getSalonSlug(pathname || "", searchString),
    [pathname, searchString]
  );

  const [salon, setSalon] = useState<Salon | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const initialSlug = getSalonSlug();
      const cached = sessionStorage.getItem(`${SALON_PROFILE_CACHE_KEY}${initialSlug}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const initialSlug = getSalonSlug();
      const cached = sessionStorage.getItem(`${SALON_PROFILE_CACHE_KEY}${initialSlug}`);
      return !cached;
    } catch {
      return true;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const salonRef = useRef<Salon | null>(salon);
  useEffect(() => {
    salonRef.current = salon;
  }, [salon]);

  useEffect(() => {
    if (!salon) return;
    const themeCode =
      salon.theme?.code ||
      salon.storefront_theme?.code ||
      (salon as any)?.storefrontTheme?.code;

    const matched = getThemeOption(themeCode);
    setThemeId(matched.id);
  }, [salon, setThemeId]);

  const fetchProfile = useCallback(async () => {
    const currentSalon = salonRef.current;
    if (!currentSalon || currentSalon.slug !== resolvedSlug) {
      setLoading(true);
    }
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

      const normalizedSalon: Salon = {
        ...salonData,
        address: formatAddress(salonData.address),
      };

      setSalon(normalizedSalon);
      dispatch(setCartSalon(normalizedSalon));

      try {
        sessionStorage.setItem(`${SALON_PROFILE_CACHE_KEY}${resolvedSlug}`, JSON.stringify(normalizedSalon));
        if (normalizedSalon.logo) {
          sessionStorage.setItem(SALON_FAVICON_CACHE_KEY, normalizedSalon.logo);
        }
      } catch {}
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

  useEffect(() => {
    if (typeof document === "undefined") return;

    const normalizedPath = getNormalizedStorefrontPath(pathname || "");
    const pageSubTitle = STOREFRONT_ROUTE_METADATA[normalizedPath]?.title || "";
    const formattedSalonName = formatTitleCase(salon?.name || "");
    const expectedTitle = pageSubTitle && normalizedPath !== "/"
      ? `${pageSubTitle} | ${formattedSalonName}`
      : `${formattedSalonName} | Book Online`;

    const applyBranding = () => {
      if (formattedSalonName && document.title !== expectedTitle) {
        document.title = expectedTitle;
      }

      const targetFavicon = salon?.logo || (typeof window !== "undefined" ? sessionStorage.getItem(SALON_FAVICON_CACHE_KEY) : null);
      if (targetFavicon) {
        const iconSelectors = [
          "link[rel='icon']",
          "link[rel='shortcut icon']",
          "link[rel='apple-touch-icon']",
        ];

        let foundAny = false;
        iconSelectors.forEach((selector) => {
          const links = document.querySelectorAll<HTMLLinkElement>(selector);
          if (links.length > 0) {
            links.forEach((link) => {
              if (link.href !== targetFavicon) {
                link.href = targetFavicon;
              }
            });
            foundAny = true;
          }
        });

        if (!foundAny) {
          const iconLink = document.createElement("link");
          iconLink.rel = "icon";
          iconLink.href = targetFavicon;
          document.head.appendChild(iconLink);
        }
      }
    };

    applyBranding();

    const observer = new MutationObserver(() => {
      applyBranding();
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    return () => {
      observer.disconnect();
    };
  }, [salon, pathname]);

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
