import AboutPage from "@/views/about";
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
    subTitle: "About Our Sanctuary",
    descriptionSuffix:
      "Discover our sanctuary heritage, ethos of intentional care, and commitment to luxury coiffure",
    subPath: "/about",
  });
}

export default function SalonAboutPage() {
  return <AboutPage />;
}
