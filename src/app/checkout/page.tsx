import Checkout from "@/views/checkout";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/checkout");

export default function CheckoutPage() {
  return (
    <ProtectedGuard state={{ redirectTo: "/cart", resumeBooking: true }}>
      <Checkout />
    </ProtectedGuard>
  );
}
