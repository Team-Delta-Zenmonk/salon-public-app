import { Suspense } from "react";
import BookingSuccess from "@/views/bookings/success";
import ProtectedGuard from "@/components/guards/protected-guard";
import { Box, CircularProgress } from "@mui/material";

export default function BookingSuccessPage() {
  return (
    <ProtectedGuard>
      <Suspense
        fallback={
          <Box style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={32} />
          </Box>
        }
      >
        <BookingSuccess />
      </Suspense>
    </ProtectedGuard>
  );
}
