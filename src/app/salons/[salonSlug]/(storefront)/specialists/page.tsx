import SpecialistsPage from "@/views/specialists";
import {
  fetchSalonBySlug,
  buildSalonMetadata,
} from "@/components/seo/salon-seo.utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);
  return buildSalonMetadata({
    slug: salonSlug,
    salon,
    subTitle: "Master Artisans & Stylists",
    descriptionSuffix:
      "Meet master scissorsmiths, colorists, and dermal therapy artisans dedicated to your personal transformation",
    subPath: "/specialists",
  });
}

export default function SalonSpecialistsPage() {
  return <SpecialistsPage />;
}
