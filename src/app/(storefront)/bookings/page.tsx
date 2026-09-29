import Bookings from "@/views/bookings";
import ProtectedGuard from "@/components/guards/protected-guard";

export default function BookingsPage() {
  return (
    <ProtectedGuard>
      <Bookings />
    </ProtectedGuard>
  );
}
