import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSalonService } from "../../../../features/salon/get-salon/get-salon.service";
import SalonGallery from "./_components/salon-gallery";
import SalonInfo from "./_components/salon-info";
import SalonServices from "./_components/salon-services";
import SalonStaff from "./_components/salon-staff";

export default function SalonDetailPage() {
  const { salonId } = useParams<{ salonId: string }>();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salonId) return;
    let active = true;

    (async () => {
      try {
        const res = await getSalonService(salonId);
        if (active) setSalon(res);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [salonId]);

  if (loading) {
    return <Box className="p-6 text-(--app-muted)">Loading salon details…</Box>;
  }

  if (!salon) {
    return <Box className="p-6 text-(--app-muted)">Salon not found</Box>;
  }

  return (
    <Box className="overscroll-y-auto px-3 sm:px-4 md:px-5 lg:px-5 pt-4 sm:pt-4 pb-3 sm:pb-4">
      <Box className="w-full xl:max-w-400 2xl:max-w-420 xl:mx-auto flex flex-col gap-4 sm:gap-7 lg:gap-8">
        <SalonInfo salon={salon} />
        <SalonGallery photos={salon.photos} logo={salon.logo} />
        <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface) p-3 sm:p-5 lg:p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <SalonServices services={salon.services || []} salon={salon} />
        </Box>
        <Divider className="border-(--app-border)" />
        <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface) p-3 sm:p-5 lg:p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <SalonStaff staff={salon.staff || []} />
        </Box>
      </Box>
    </Box>
  );
}
