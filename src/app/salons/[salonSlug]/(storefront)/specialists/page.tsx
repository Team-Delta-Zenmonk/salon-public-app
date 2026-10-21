import SpecialistsPage from "@/views/specialists";
import {
  fetchSalonBySlug,
  buildRouteSalonMetadata,
} from "@/components/seo/salon-seo.utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildRouteSalonMetadata("/specialists", salonSlug, salon);
}

export default function SalonSpecialistsPage() {
  return <SpecialistsPage />;
}
