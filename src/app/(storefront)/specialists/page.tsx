import SpecialistsPage from "@/views/specialists";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/specialists");

export default function Specialists() {
  return <SpecialistsPage />;
}
