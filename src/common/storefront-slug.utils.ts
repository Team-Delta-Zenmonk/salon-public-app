export const getSalonSlug = (): string => {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_DEFAULT_SALON_SLUG || "glow";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const paramSlug = searchParams.get("salon");
  if (paramSlug && paramSlug.trim().length > 0) {
    return paramSlug.trim().toLowerCase();
  }

  const hostname = window.location.hostname.toLowerCase();

  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (!isIp && hostname !== "localhost") {
    const parts = hostname.split(".");

    if (parts.length === 2 && parts[1] === "localhost") {
      return parts[0];
    }

    const ignoredSubdomains = new Set(["www", "api", "admin", "staging", "app"]);
    if (parts.length >= 3 && !ignoredSubdomains.has(parts[0])) {
      return parts[0];
    }
  }

  return (import.meta.env.VITE_DEFAULT_SALON_SLUG as string) || "glow";
};
