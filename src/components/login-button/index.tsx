import { useState } from "react";
import { GoogleResponse } from "../../auth/get-google-response";
import { Box, Button } from "@mui/material";

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
      <Button onClick={logInWithGoogle} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </Box>
  );
}
