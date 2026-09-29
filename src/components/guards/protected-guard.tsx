"use client";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { useStorefrontNavigate } from "@/common/hooks/useStorefrontNavigate";
import { usePathname } from "next/navigation";

interface ProtectedGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  state?: any;
}

export function ProtectedGuard({
  children,
  redirectTo = "/signup",
  state,
}: ProtectedGuardProps) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const pathname = usePathname();
  const navigate = useStorefrontNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo, {
        replace: true,
        state: state || { redirectTo: pathname },
      });
    }
  }, [isAuthenticated, navigate, redirectTo, state, pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedGuard;
