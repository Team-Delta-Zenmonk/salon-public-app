import { Suspense } from "react";
import Cart from "@/views/cart";
import { Box, CircularProgress } from "@mui/material";

export default function SalonCartPage() {
  return (
    <Suspense
      fallback={
        <Box className="min-h-[50vh] flex items-center justify-center">
          <CircularProgress size={32} />
        </Box>
      }
    >
      <Cart />
    </Suspense>
  );
}
