import Profile from "@/views/profile";
import ProtectedGuard from "@/components/guards/protected-guard";

export default function SalonProfilePage() {
  return (
    <ProtectedGuard>
      <Profile />
    </ProtectedGuard>
  );
}
