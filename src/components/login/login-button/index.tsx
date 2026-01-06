import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { GoogleResponse } from "../../../auth/get-google-response";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { getSignInWithPopup } = GoogleResponse();
  const navigate = useNavigate();

  const logInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleResponse = await getSignInWithPopup();
      console.log("googleResponse:", googleResponse);
      navigate("/discovery", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>
    </Box>
  );
}
