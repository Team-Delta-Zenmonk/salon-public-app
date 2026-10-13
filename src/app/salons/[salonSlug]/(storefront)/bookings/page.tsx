import Bookings from "@/views/bookings";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Appointments & Bookings",
  description: "View and manage your upcoming and past luxury salon appointments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SalonBookingsPage() {
  return (
    <ProtectedGuard>
      <Bookings />
    </ProtectedGuard>
  );
}
