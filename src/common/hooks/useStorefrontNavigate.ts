import { useNavigate, type NavigateOptions, type To } from "react-router-dom";
import { useCallback } from "react";
import { buildStorefrontUrl } from "../storefront-slug.utils";

export function useStorefrontNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        navigate(to);
        return;
      }

      if (typeof to === "string") {
        navigate(buildStorefrontUrl(to), options);
        return;
      }

      if (typeof to === "object" && to.pathname) {
        const fullPath = `${to.pathname}${to.search || ""}${to.hash || ""}`;
        navigate(buildStorefrontUrl(fullPath), options);
        return;
      }

      navigate(to, options);
    },
    [navigate]
  );
}

export default useStorefrontNavigate;
