import Checkout from "@/views/checkout";
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
  return buildRouteSalonMetadata("/checkout", salonSlug, salon);
}

export default function SalonCheckoutPage() {
  return (
    <ProtectedGuard state={{ redirectTo: "/cart", resumeBooking: true }}>
      <Checkout />
    </ProtectedGuard>
  );
}
