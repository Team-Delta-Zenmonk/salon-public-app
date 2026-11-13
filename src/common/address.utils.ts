export const formatAddress = (address: any): string => {
  if (!address) return "";
  if (typeof address === "string") {
    try {
      const parsed = JSON.parse(address);
      if (parsed && typeof parsed === "object") {
        return formatAddress(parsed);
      }
    } catch {
      return address.trim();
    }
    return address.trim();
  }
  if (typeof address === "object") {
    const compiled = [address.street, address.city, address.state, address.pincode]
      .filter((v) => typeof v === "string" && v.trim())
      .join(", ");
    if (compiled) return compiled;
    if (address.formatted_address && typeof address.formatted_address === "string" && address.formatted_address.trim()) {
      return address.formatted_address.trim();
    }
    return "";
  }
  return String(address);
};

