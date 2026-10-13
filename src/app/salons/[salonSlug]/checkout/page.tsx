import Checkout from "@/views/checkout";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your appointment booking with secure payment processing.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SalonCheckoutPage() {
  return (
    <ProtectedGuard state={{ redirectTo: "/cart", resumeBooking: true }}>
      <Checkout />
    </ProtectedGuard>
  );
}
