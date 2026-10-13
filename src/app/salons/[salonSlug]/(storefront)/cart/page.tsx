import { Suspense } from "react";
import Cart from "@/views/cart";
import { Box, CircularProgress } from "@mui/material";

export default function SalonCartPage() {
  return (
    <Suspense
      fallback={
        <Box style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={32} />
        </Box>
      }
    >
      <Cart />
    </Suspense>
  );
}
