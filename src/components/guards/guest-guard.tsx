"use client";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { useStorefrontNavigate } from "@/common/hooks/useStorefrontNavigate";
import { useSearchParams } from "next/navigation";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const navigate = useStorefrontNavigate();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams?.get("redirectTo") || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  if (isAuthenticated) return null;

  return <>{children}</>;
}

export default GuestGuard;
