import Profile from "@/views/profile";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/profile");

export default function ProfilePage() {
  return (
    <ProtectedGuard>
      <Profile />
    </ProtectedGuard>
  );
}
