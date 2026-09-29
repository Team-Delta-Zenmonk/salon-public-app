import AppLayout from "@/layouts";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
