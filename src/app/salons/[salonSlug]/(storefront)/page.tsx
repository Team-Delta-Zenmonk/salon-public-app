import HomePage from "@/views/home";
import StructuredData from "@/components/seo/structured-data";
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
  return buildRouteSalonMetadata("/", salonSlug, salon);
}

export default async function SalonHomePage({ params }: Props) {
  const { salonSlug } = await params;
  const salon = await fetchSalonBySlug(salonSlug);

  return (
    <>
      <StructuredData salon={salon} slug={salonSlug} />
      <HomePage />
    </>
  );
}
