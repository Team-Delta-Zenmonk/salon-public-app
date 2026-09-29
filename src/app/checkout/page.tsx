import Checkout from "@/views/checkout";
import ProtectedGuard from "@/components/guards/protected-guard";

export default function CheckoutPage() {
  return (
    <ProtectedGuard state={{ redirectTo: "/cart", resumeBooking: true }}>
      <Checkout />
    </ProtectedGuard>
  );
}
