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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Fallback if resolvedSlug is a direct UUID
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
      <Box className="min-h-screen bg-(--app-bg)">
        <Box className="h-16 border-b border-(--app-border) bg-(--app-surface) px-6 flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Skeleton variant="rounded" width={38} height={38} className="rounded-xl" />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
          <Box className="flex items-center gap-3">
            <Skeleton variant="rounded" width={80} height={36} className="rounded-xl" />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>

        <Box className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <Skeleton variant="rounded" height={220} className="rounded-xl" />
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box className="min-h-screen bg-(--app-bg) flex flex-col items-center justify-center p-6 text-center">
        <Box className="w-18 h-18 rounded-xl bg-(--app-surface) border border-(--app-border) flex items-center justify-center mb-4 shadow-md">
          <StorefrontIcon className="text-[36px] text-(--app-muted)" />
        </Box>
        <Typography className="text-xl sm:text-2xl font-black text-(--app-text)">
          Salon Not Found
        </Typography>
        <Typography className="text-xs sm:text-sm text-(--app-muted) max-w-md mt-2 mb-6">
          {error || "The salon you are looking for is inactive or does not exist."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            clearActiveSalonSlug();
            window.location.href = "/?salon=glow";
          }}
          startIcon={<ArrowBackIcon className="text-[16px]" />}
          className="rounded-2xl px-6 py-2.5 font-bold text-xs bg-(--app-primary) text-(--app-primary-contrast)"
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
