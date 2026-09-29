"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { buildStorefrontUrl } from "../storefront-slug.utils";

export interface NavigateOptions {
  replace?: boolean;
  scroll?: boolean;
  state?: any;
}

export type To = string | { pathname: string; search?: string; hash?: string };

export function useStorefrontNavigate() {
  const router = useRouter();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (to === -1) {
          router.back();
        } else if (to === 1) {
          router.forward();
        }
        return;
      }

      let rawPath = "";
      if (typeof to === "string") {
        rawPath = to;
      } else if (typeof to === "object" && to && to.pathname) {
        rawPath = `${to.pathname}${to.search || ""}${to.hash || ""}`;
      }

      let targetUrl = buildStorefrontUrl(rawPath);

      // Preserve navigation state (e.g. redirectTo, resumeBooking, bookingUuid)
      if (options?.state) {
        try {
          const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
          const parsed = new URL(targetUrl, origin);

          if (options.state.redirectTo) {
            parsed.searchParams.set("redirectTo", options.state.redirectTo);
          }
          if (options.state.resumeBooking) {
            parsed.searchParams.set("resumeBooking", "true");
          }
          if (options.state.bookingUuid) {
            parsed.searchParams.set("bookingUuid", options.state.bookingUuid);
          }

          targetUrl = parsed.pathname + parsed.search + parsed.hash;
        } catch {}
      }

      if (options?.replace) {
        router.replace(targetUrl, { scroll: options?.scroll ?? true });
      } else {
        router.push(targetUrl, { scroll: options?.scroll ?? true });
      }
    },
    [router]
  );
}

export default useStorefrontNavigate;
