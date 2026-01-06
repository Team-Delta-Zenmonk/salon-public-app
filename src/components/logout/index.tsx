import { Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../store/store";
import { callSnack } from "../snackbar";
import { GoogleResponse } from "../../auth/get-google-response";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export default function LogoutButton({ collapsed = false }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = GoogleResponse();

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log("Logging out...");
      persistor.purge();
      await logout();
      navigate("/", { replace: true });
    } catch {
      callSnack("Error during logout", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      startIcon={<LogoutOutlinedIcon sx={{ color: "error.main" }} />}
      onClick={handleLogout}
      variant="outlined"
      color="error"
    >
      {!collapsed && "Logout"}
    </Button>
  );
}
