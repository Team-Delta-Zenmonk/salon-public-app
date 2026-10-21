import { Suspense } from "react";
import SignUp from "@/views/signup";
import GuestGuard from "@/components/guards/guest-guard";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/signup");

export default function SignUpPage() {
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
