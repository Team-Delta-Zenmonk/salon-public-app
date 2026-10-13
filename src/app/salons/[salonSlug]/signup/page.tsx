import { Suspense } from "react";
import SignUp from "@/views/signup";
import GuestGuard from "@/components/guards/guest-guard";
import { Box, CircularProgress } from "@mui/material";

export default function SalonSignUpPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
