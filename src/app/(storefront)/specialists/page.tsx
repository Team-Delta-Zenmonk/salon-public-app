import SpecialistsPage from "@/views/specialists";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisans & Master Stylists",
  description:
    "Meet our master scissorsmiths, colorists, and dermal therapy artisans dedicated to your personal transformation.",
};

export default function Specialists() {
  return <SpecialistsPage />;
}
