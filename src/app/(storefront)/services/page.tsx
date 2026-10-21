import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/services");

export default function Services() {
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
