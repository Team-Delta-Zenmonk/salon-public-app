import Profile from "@/views/profile";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Profile",
  description: "Manage your client account, preferences, and personal details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <ProtectedGuard>
      <Profile />
    </ProtectedGuard>
  );
}
