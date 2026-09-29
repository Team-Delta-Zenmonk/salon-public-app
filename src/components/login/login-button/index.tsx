"use client";
import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useStorefrontNavigate } from "../../../common/hooks/useStorefrontNavigate";
import { GoogleResponse } from "../../../auth/get-google-response";
import { useAppDispatch } from "../../../store/hook";
import { loginCustomerAction } from "../../../features/auth/login/login.action";
import { callSnack } from "../../snackbar";

interface LoginButtonProps {
  collapsed?: boolean;
}

interface AuthRedirectState {
  redirectTo?: string;
  resumeBooking?: boolean;
}

export default function LoginButton({ collapsed = false }: Readonly<LoginButtonProps>) {
  const [loading, setLoading] = useState(false);
  const { getSignInWithPopup } = GoogleResponse();
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const searchParams = useSearchParams();

  const searchRedirect = searchParams?.get("redirectTo") || undefined;
  const searchResume = searchParams?.get("resumeBooking") === "true";

  const logInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleResponse = await getSignInWithPopup();
      await dispatch(loginCustomerAction({ token: googleResponse?.token })).unwrap();

      if (searchRedirect) {
        navigate(searchRedirect, {
          replace: true,
          state: {
            resumeBooking: searchResume,
          } satisfies AuthRedirectState,
        });
        return;
      }

      navigate("/", { replace: true });
    } catch {
      callSnack("Failed to sign in with Google. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={logInWithGoogle}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={18} />
          ) : (
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
          )
        }
        className="!border-(--app-border) !text-(--app-text) hover:!bg-(--app-primary-soft) hover:!border-(--app-primary) !py-3 !rounded-xl !normal-case !font-semibold !text-sm transition-all shadow-sm"
      >
        {!collapsed && (loading ? "Signing in..." : "Continue with Google")}
      </Button>
    </Box>
  );
}
