import { Suspense } from "react";
import BookingSuccess from "@/views/bookings/success";
import ProtectedGuard from "@/components/guards/protected-guard";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";
import {
  fetchSalonBySlug,
  buildRouteSalonMetadata,
} from "@/components/seo/salon-seo.utils";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildRouteSalonMetadata("/bookings/success", salonSlug, salon);
}

export default function SalonBookingSuccessPage() {
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
