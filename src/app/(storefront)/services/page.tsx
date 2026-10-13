import { Suspense } from "react";
import ServicesPage from "@/views/services";
import { Box, CircularProgress } from "@mui/material";

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
