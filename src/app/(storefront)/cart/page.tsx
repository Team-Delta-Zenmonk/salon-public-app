import { Suspense } from "react";
import Cart from "@/views/cart";
import { Box, CircularProgress } from "@mui/material";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/cart");

export default function CartPage() {
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
