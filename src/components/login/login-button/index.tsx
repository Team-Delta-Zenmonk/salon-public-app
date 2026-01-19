import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleResponse } from "../../../auth/get-google-response";
import { useAppDispatch } from "../../../store/hook";
import { loginCustomerAction } from "../../../features/auth/login/login.action";
import { callSnack } from "../../snackbar";
interface LoginButtonProps {
  collapsed?: boolean;
}

export default function LoginButton({ collapsed = false }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { getSignInWithPopup } = GoogleResponse();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleResponse = await getSignInWithPopup();
      const res = await dispatch(loginCustomerAction({ token: googleResponse?.token })).unwrap();
      navigate("/salons", { replace: true });
    } catch (err) {
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
            <Box component="img" src="/assets/google.svg" alt="Google" className="w-4.5 h-4.5" />
          )
        }
      >
        {loading ? "Signing in..." : !collapsed && "Sign in"}
      </Button>
    </Box>
  );
}
