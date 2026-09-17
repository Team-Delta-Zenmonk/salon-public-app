import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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

export default function StorefrontPage() {
  const { salonId } = useParams<{ salonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlTab = searchParams.get("tab") as StorefrontTab | null;
  const [activeTab, setActiveTab] = useState<StorefrontTab>(
    urlTab && ["overview", "services", "specialists", "hours"].includes(urlTab) ? urlTab : "overview"
  );

  const handleTabChange = (nextTab: StorefrontTab) => {
    setActiveTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", nextTab);
    setSearchParams(nextParams, { replace: true });
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
      <Box className="min-h-screen bg-(--app-bg)">
        <Box className="h-16 border-b border-(--app-border) bg-(--app-surface) px-6 flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Skeleton variant="rounded" width={40} height={40} className="rounded-xl" />
            <Skeleton variant="text" width={140} height={24} />
          </Box>
          <Box className="flex items-center gap-3">
            <Skeleton variant="rounded" width={80} height={36} className="rounded-xl" />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>

        <Box className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <Skeleton variant="rounded" height={220} className="rounded-3xl" />
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
            <Skeleton variant="rounded" height={140} className="rounded-2xl" />
          </Box>
          <Skeleton variant="rounded" height={360} className="rounded-3xl" />
        </Box>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box className="min-h-screen bg-(--app-bg) flex flex-col items-center justify-center p-6 text-center">
        <Box className="w-18 h-18 rounded-3xl bg-(--app-surface) border border-(--app-border) flex items-center justify-center mb-4 shadow-md">
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
    <Box className="min-h-screen bg-(--app-bg) flex flex-col">
      <StorefrontHeader salon={salon} activeTab={activeTab} onTabChange={handleTabChange} />

      <Box className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7">
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
          <Box className="space-y-6 pb-16">
            <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
              <StorefrontStaff staff={salon?.staff || []} salonId={salon?.uuid} />
            </Box>
          </Box>
        )}

        {activeTab === "hours" && <StorefrontHoursAbout salon={salon} />}
      </Box>
    </Box>
  );
}
