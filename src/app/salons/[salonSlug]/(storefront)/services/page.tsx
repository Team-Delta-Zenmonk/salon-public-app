import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";
import {
  fetchSalonBySlug,
  buildSalonMetadata,
} from "@/components/seo/salon-seo.utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildSalonMetadata({
    slug: salonSlug,
    salon,
    subTitle: "Bespoke Services & Treatments",
    descriptionSuffix:
      "Explore luxury hair therapies, bespoke cuts, styling rituals, coloring, facials, and grooming therapies",
    subPath: "/services",
  });
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
