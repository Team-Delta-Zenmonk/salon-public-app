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
  console.log("salonId: ", salonId);

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
    return <Box className="p-6">Loading salon details…</Box>;
  }

  if (!salon) {
    return <Box className="p-6">Salon not found</Box>;
  }

  return (
    <Box className="flex flex-col gap-6 p-4 sm:p-6 overscroll-y-auto ">
      <SalonInfo salon={salon} />
      <SalonGallery photos={salon.photos} logo={salon.logo} />
      <Divider />
      <SalonServices services={salon.services || []} />
      <Divider />
      <SalonStaff staff={salon.staff || []} />
    </Box>
  );
}
