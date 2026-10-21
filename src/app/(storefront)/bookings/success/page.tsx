import { Suspense } from "react";
import BookingSuccess from "@/views/bookings/success";
import ProtectedGuard from "@/components/guards/protected-guard";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/bookings/success");

export default function BookingSuccessPage() {
  return (
    <ProtectedGuard>
      <Suspense
        fallback={
          <Box className="pageCenterLoading">
            <CircularProgress size={32} />
          </Box>
        }
      >
        <BookingSuccess />
      </Suspense>
    </ProtectedGuard>
  );
}
