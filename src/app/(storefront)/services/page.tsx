import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Services & Treatments",
  description:
    "Explore our luxury salon treatments, styling rituals, hair coloring, facials, and grooming therapies.",
};

export default function Services() {
  return (
    <Suspense
      fallback={
        <Box style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={32} />
        </Box>
      }
    >
      <ServicesPage />
    </Suspense>
  );
}
