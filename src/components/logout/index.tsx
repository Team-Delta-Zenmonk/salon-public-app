import { Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../store/store";
import { callSnack } from "../snackbar";
import { GoogleResponse } from "../../auth/get-google-response";
import { useAppDispatch } from "../../store/hook";
import { logout as logoutAction } from "../../features/auth/auth.slice";
interface LogoutButtonProps {
  collapsed?: boolean;
}

export default function LogoutButton({ collapsed = false }: Readonly<LogoutButtonProps>) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { logout } = GoogleResponse();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      dispatch(logoutAction());
      await persistor.purge();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
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
      disabled={loading}
    >
      {!collapsed && "Logout"}
    </Button>
  );
}
