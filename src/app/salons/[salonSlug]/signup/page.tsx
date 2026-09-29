import { Suspense } from "react";
import SignUp from "@/views/signup";
import GuestGuard from "@/components/guards/guest-guard";
import { Box, CircularProgress } from "@mui/material";

export default function SalonSignUpPage() {
  return (
    <Suspense
      fallback={
        <Box className="min-h-[50vh] flex items-center justify-center">
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
