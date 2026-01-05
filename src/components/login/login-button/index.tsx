import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { GoogleResponse } from "../../../auth/get-google-response";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { getSignInWithPopup } = GoogleResponse();

  const logInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleResponse = await getSignInWithPopup();

      console.log("googleResponse:", googleResponse);
      localStorage.setItem("token", googleResponse.token);
      localStorage.setItem("email", googleResponse.email ?? "");

      alert(`Logged in as ${googleResponse.email}`);
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
