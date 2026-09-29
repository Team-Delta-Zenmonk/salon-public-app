import Bookings from "@/views/bookings";
import ProtectedGuard from "@/components/guards/protected-guard";

export default function SalonBookingsPage() {
  return (
    <ProtectedGuard>
      <Bookings />
    </ProtectedGuard>
  );
}
