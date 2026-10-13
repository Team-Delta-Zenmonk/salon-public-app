import { Suspense } from "react";
import Cart from "@/views/cart";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concierge Bag",
  description: "Review your selected luxury salon treatments and reserve your appointment slot.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
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
