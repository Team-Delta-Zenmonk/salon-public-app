const SESSION_SLUG_KEY = "zenmonk_active_salon_slug";

export const getSalonSlug = (): string => {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_DEFAULT_SALON_SLUG || "glow";
  }

  // 1. Check URL query param ?salon=...
  const searchParams = new URLSearchParams(window.location.search);
  const paramSlug = searchParams.get("salon");
  if (paramSlug && paramSlug.trim().length > 0) {
    const slug = paramSlug.trim().toLowerCase();
    try {
      sessionStorage.setItem(SESSION_SLUG_KEY, slug);
    } catch {
      // Ignore storage errors in private browsing
    }
    return slug;
  }

  // 2. Check path /salons/:salonSlug
  const pathMatch = window.location.pathname.match(/^\/salons\/([^/]+)/);
  if (pathMatch && pathMatch[1] && pathMatch[1].trim().length > 0) {
    const slug = pathMatch[1].trim().toLowerCase();
    try {
      sessionStorage.setItem(SESSION_SLUG_KEY, slug);
    } catch {
      // Ignore storage errors
    }
    return slug;
  }

  // 3. Check Subdomain (e.g. deswal.salon.com or deswal.localhost)
  const hostname = window.location.hostname.toLowerCase();
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (!isIp && hostname !== "localhost") {
    const parts = hostname.split(".");

    if (parts.length === 2 && parts[1] === "localhost") {
      const slug = parts[0];
      try {
        sessionStorage.setItem(SESSION_SLUG_KEY, slug);
      } catch {}
      return slug;
    }

    const ignoredSubdomains = new Set(["www", "api", "admin", "staging", "app"]);
    if (parts.length >= 3 && !ignoredSubdomains.has(parts[0])) {
      const slug = parts[0];
      try {
        sessionStorage.setItem(SESSION_SLUG_KEY, slug);
      } catch {}
      return slug;
    }
  }

  // 4. Check sessionStorage cache to keep the active salon sticky across route transitions
  try {
    const cachedSlug = sessionStorage.getItem(SESSION_SLUG_KEY);
    if (cachedSlug && cachedSlug.trim().length > 0) {
      return cachedSlug.trim().toLowerCase();
    }
  } catch {
    // Ignore storage errors
  }

  return (import.meta.env.VITE_DEFAULT_SALON_SLUG as string) || "glow";
};

export const buildStorefrontUrl = (to: string): string => {
  if (typeof window === "undefined" || !to) return to;

  // External URLs or protocols should not be altered
  if (
    to.startsWith("http://") ||
    to.startsWith("https://") ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:") ||
    to.startsWith("//")
  ) {
    return to;
  }

  const [pathAndQuery, hash] = to.split("#");
  const hashPart = hash ? `#${hash}` : "";

  // 1. If current path uses /salons/:salonSlug prefix, preserve the prefix
  const pathMatch = window.location.pathname.match(/^\/salons\/([^/]+)/);
  if (pathMatch && pathMatch[1]) {
    const prefix = `/salons/${pathMatch[1]}`;
    if (pathAndQuery.startsWith("/salons/")) {
      return `${pathAndQuery}${hashPart}`;
    }
    const cleanTo =
      pathAndQuery === "/" || pathAndQuery === ""
        ? ""
        : pathAndQuery.startsWith("/")
        ? pathAndQuery
        : `/${pathAndQuery}`;
    return `${prefix}${cleanTo}${hashPart}`;
  }

  // 2. If testing on localhost or using ?salon= query param, preserve it in the URL
  const searchParams = new URLSearchParams(window.location.search);
  const activeSlug =
    searchParams.get("salon") ||
    (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(SESSION_SLUG_KEY) : null);

  if (activeSlug) {
    const [path, existingQuery] = pathAndQuery.split("?");
    const params = new URLSearchParams(existingQuery || "");
    if (!params.has("salon")) {
      params.set("salon", activeSlug);
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return `${path}${queryString}${hashPart}`;
  }

  return to;
};

export const getNormalizedStorefrontPath = (pathname: string): string => {
  if (!pathname) return "/";
  const stripped = pathname.replace(/^\/salons\/[^/]+/, "");
  return stripped === "" ? "/" : stripped;
};

export const clearActiveSalonSlug = (): void => {
  try {
    sessionStorage.removeItem(SESSION_SLUG_KEY);
  } catch {}
};

