import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";
import {
  fetchSalonBySlug,
  buildRouteSalonMetadata,
} from "@/components/seo/salon-seo.utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildRouteSalonMetadata("/services", salonSlug, salon);
}

export default function SalonServicesPage() {
  return (
    <Suspense
      fallback={
        <Box className="pageCenterLoading">
          <CircularProgress size={32} />
        </Box>
      }
    >
      <ServicesPage />
    </Suspense>
  );
}
