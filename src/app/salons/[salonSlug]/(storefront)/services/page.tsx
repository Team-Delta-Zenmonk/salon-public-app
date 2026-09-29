import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";

export default function SalonServicesPage() {
  return (
    <Suspense
      fallback={
        <Box className="min-h-[50vh] flex items-center justify-center">
          <CircularProgress size={32} />
        </Box>
      }
    >
      <ServicesPage />
    </Suspense>
  );
}
