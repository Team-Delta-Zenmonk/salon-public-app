import Bookings from "@/views/bookings";
import ProtectedGuard from "@/components/guards/protected-guard";
import type { Metadata } from "next";
import {
  fetchSalonBySlug,
  buildRouteSalonMetadata,
} from "@/components/seo/salon-seo.utils";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildRouteSalonMetadata("/bookings", salonSlug, salon);
}

export default function SalonBookingsPage() {
  return (
    <ProtectedGuard>
      <Bookings />
    </ProtectedGuard>
  );
}
