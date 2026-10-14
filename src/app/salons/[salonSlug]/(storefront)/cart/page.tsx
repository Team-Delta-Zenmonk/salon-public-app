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

export default function SalonCartPage() {
  return (
    <Suspense
      fallback={
        <Box className="pageCenterLoading">
          <CircularProgress size={32} />
        </Box>
      }
    >
      <Cart />
    </Suspense>
  );
}
