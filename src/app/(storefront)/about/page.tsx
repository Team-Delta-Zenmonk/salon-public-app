import AboutPage from "@/views/about";
import type { Metadata } from "next";
import { getRouteStaticMetadata } from "@/components/seo/salon-seo.utils";

export const metadata: Metadata = getRouteStaticMetadata("/about");

export default function About() {
  return <AboutPage />;
}
