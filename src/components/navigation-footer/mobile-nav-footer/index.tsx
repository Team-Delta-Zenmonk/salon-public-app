import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation } from "../../../layouts/navigation";

export default function MobileNavFooter() {
  const location = useLocation();
  const navigate = useNavigate();

  const current = navigation.find((i) => location.pathname.startsWith(i.to))?.to || "/discovery";

  return (
    <BottomNavigation
      value={current}
      onChange={(_, next) => navigate(next)}
      showLabels
      className="h-16 bg-(--app-surface) border-t border-(--app-border)"
    >
      {navigation.map((i) => {
        const Icon = i.icon;
        return <BottomNavigationAction key={i.to} label={i.label} value={i.to} icon={<Icon />} />;
      })}
    </BottomNavigation>
  );
}
