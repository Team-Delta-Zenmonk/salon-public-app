import { Suspense } from "react";
import SignUp from "@/views/signup";
import GuestGuard from "@/components/guards/guest-guard";
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
  return buildRouteSalonMetadata("/signup", salonSlug, salon);
}

export default function SalonSignUpPage() {
  return (
    <Suspense
      fallback={
        <Box className="pageCenterLoading">
          <CircularProgress size={32} />
        </Box>
      }
    >
      <GuestGuard>
        <SignUp />
      </GuestGuard>
    </Suspense>
  );
}
