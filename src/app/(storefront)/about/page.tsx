import AboutPage from "@/views/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Flagship Sanctuary",
  description:
    "Discover our heritage, philosophy of intentional care, and commitment to luxury coiffure and bespoke dermal therapies.",
};

export default function About() {
  return <AboutPage />;
}
