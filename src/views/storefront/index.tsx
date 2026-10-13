"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontHeader, { type StorefrontTab } from "./_components/storefront-header";
import StorefrontOverview from "./_components/storefront-overview";
import StorefrontServices from "./_components/storefront-services";
import StorefrontHoursAbout from "./_components/storefront-hours-about";
import StorefrontStaff from "./_components/storefront-staff";
import { getSalonSlug } from "../../common/storefront-slug.utils";
import { getStorefrontProfileService } from "../../features/salon/get-storefront-profile/get-storefront-profile.service";
import { getSalonService } from "../../features/salon/get-salon/get-salon.service";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";

import styles from "./storefront.module.css";

export default function StorefrontPage() {
  const params = useParams();
  const salonId = (params?.salonSlug as string) || (params?.salonId as string);
  const searchParams = useSearchParams();
  const navigate = useStorefrontNavigate();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlTab = searchParams?.get("tab") as StorefrontTab | null;
  const [activeTab, setActiveTab] = useState<StorefrontTab>(
    urlTab && ["overview", "services", "specialists", "hours"].includes(urlTab) ? urlTab : "overview"
  );

  const handleTabChange = (nextTab: StorefrontTab) => {
    setActiveTab(nextTab);
    const nextParams = new URLSearchParams(searchParams?.toString() || "");
    nextParams.set("tab", nextTab);
    navigate(`?${nextParams.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);

      const resolvedSlug = salonId || getSalonSlug();

      try {
        let salonData: any = null;

        try {
          const res = await getStorefrontProfileService(resolvedSlug);
          salonData = res.salon;
        } catch {
          if (salonId) {
            salonData = await getSalonService(salonId);
          } else {
            throw new Error(`Salon '${resolvedSlug}' was not found or is currently inactive.`);
          }
        }

        if (active) {
          setSalon(salonData);
          if (salonData?.name) {
            document.title = `${salonData.name} | Book Online`;
          }
        }
      } catch (err: any) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              `Unable to load salon. Please check the URL and try again.`
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [salonId, searchParams]);

  if (loading) {
    return (
      <Box className={styles.pageContainer}>
        <Box className={styles.loadingHeader}>
          <Box style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Skeleton variant="rounded" width={40} height={40} style={{ borderRadius: "0.75rem" }} />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
          <Box style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Skeleton variant="rounded" width={80} height={36} style={{ borderRadius: "0.75rem" }} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>

        <Box className={styles.loadingMain}>
          <Skeleton variant="rounded" height={220} style={{ borderRadius: "0.75rem" }} />
          <Box className={styles.loadingCardsGrid}>
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
            <Skeleton variant="rounded" height={140} style={{ borderRadius: "1rem" }} />
          </Box>
          <Skeleton variant="rounded" height={360} style={{ borderRadius: "0.75rem" }} />
        </Box>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box className={styles.errorContainer}>
        <Box className={styles.errorIconBox}>
          <StorefrontIcon style={{ fontSize: "36px", color: "var(--app-muted)" }} />
        </Box>
        <Typography className={styles.errorTitle}>
          Salon Not Found
        </Typography>
        <Typography className={styles.errorDesc}>
          {error || "The salon you are looking for is inactive or does not exist."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            window.location.href = "/?salon=glow";
          }}
          startIcon={<ArrowBackIcon style={{ fontSize: "16px" }} />}
          className={styles.errorBtn}
        >
          Go to Glow Salon
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      <StorefrontHeader salon={salon} activeTab={activeTab} onTabChange={handleTabChange} />

      <Box className={styles.contentWrapper}>
        {activeTab === "overview" && (
          <StorefrontOverview salon={salon} onNavigateTab={handleTabChange} />
        )}

        {activeTab === "services" && (
          <StorefrontServices
            salon={salon}
            onProceedToBook={() => navigate("/cart")}
          />
        )}

        {activeTab === "specialists" && (
          <Box style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Box className={styles.specialistsCard}>
              <StorefrontStaff staff={salon?.staff || []} salonId={salon?.uuid} />
            </Box>
          </Box>
        )}

        {activeTab === "hours" && <StorefrontHoursAbout salon={salon} />}
      </Box>
    </Box>
  );
}
