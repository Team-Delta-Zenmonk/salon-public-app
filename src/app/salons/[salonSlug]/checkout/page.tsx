import Checkout from "@/views/checkout";
import ProtectedGuard from "@/components/guards/protected-guard";

export default function SalonCheckoutPage() {
  return (
    <ProtectedGuard state={{ redirectTo: "/cart", resumeBooking: true }}>
      <Checkout />
    </ProtectedGuard>
  );
}
