export const salonType = (type?: string) => {
  if (!type) return "—";
  const t = String(type).toLowerCase();
  if (t === "male") return "Men";
  if (t === "female") return "Women";
  if (t === "unisex") return "Unisex";
  return type;
};

export const formatCategories = (categories?: Array<{ name?: string }>, max = 2) => {
  const cats = (categories || []).map((c) => c?.name).filter(Boolean) as string[];
  if (!cats.length) return "—";

  const first = cats.slice(0, max);
  const remaining = cats.length - first.length;

  return remaining > 0 ? `${first.join(" • ")} +${remaining}` : first.join(" • ");
};

export const formatAddress = (address?: string) => (address?.trim() ? address : "—");

export const getSalonLogo = (logo?: string) => logo || "";
