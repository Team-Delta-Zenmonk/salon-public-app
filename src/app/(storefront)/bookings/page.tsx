import Bookings from "@/views/bookings";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/bookings");

export default function BookingsPage() {
  return (
    <ProtectedGuard>
      <Bookings />
    </ProtectedGuard>
  );
}
