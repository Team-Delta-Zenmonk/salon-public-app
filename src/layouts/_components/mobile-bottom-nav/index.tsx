"use client";
import { BottomNavigation, BottomNavigationAction, Badge } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { usePathname } from "next/navigation";
import { useStorefrontNavigate } from "../../../common/hooks/useStorefrontNavigate";
import { getNormalizedStorefrontPath } from "../../../common/storefront-slug.utils";
import { useAppSelector } from "../../../store/hook";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const navigate = useStorefrontNavigate();
  const cartCount = useAppSelector((state) => state.cart.items.length);

  const getActiveTab = () => {
    const p = getNormalizedStorefrontPath(pathname || "");
    if (p === "/") return "/";
    if (p.startsWith("/services")) return "/services";
    if (p.startsWith("/cart")) return "/cart";
    if (p.startsWith("/bookings")) return "/bookings";
    if (p.startsWith("/profile")) return "/profile";
    return "/";
  };

  return (
    <BottomNavigation
      value={getActiveTab()}
      onChange={(_, next) => navigate(next)}
      showLabels
      className="h-16 w-full max-w-full bg-(--app-surface)/95 backdrop-blur-md border-t border-(--app-border) px-0 justify-between items-center"
      sx={{
        "& .MuiBottomNavigationAction-root": {
          minWidth: 0,
          maxWidth: "none",
          flex: 1,
          padding: "6px 0",
        },
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="/"
        icon={<HomeOutlinedIcon className="text-[20px]" />}
        className="text-(--app-muted) [&.Mui-selected]:text-(--app-primary) text-[10px]"
      />
      <BottomNavigationAction
        label="Services"
        value="/services"
        icon={<ContentCutOutlinedIcon className="text-[20px]" />}
        className="text-(--app-muted) [&.Mui-selected]:text-(--app-primary) text-[10px]"
      />
      <BottomNavigationAction
        label="Cart"
        value="/cart"
        icon={
          <Badge
            badgeContent={cartCount}
            color="primary"
            max={9}
            className="[&_.MuiBadge-badge]:font-bold [&_.MuiBadge-badge]:bg-(--app-primary) [&_.MuiBadge-badge]:text-white"
          >
            <ShoppingBagOutlinedIcon className="text-[20px]" />
          </Badge>
        }
        className="text-(--app-muted) [&.Mui-selected]:text-(--app-primary) text-[10px]"
      />
      <BottomNavigationAction
        label="Bookings"
        value="/bookings"
        icon={<CalendarMonthOutlinedIcon className="text-[20px]" />}
        className="text-(--app-muted) [&.Mui-selected]:text-(--app-primary) text-[10px]"
      />
      <BottomNavigationAction
        label="Account"
        value="/profile"
        icon={<PersonOutlineOutlinedIcon className="text-[20px]" />}
        className="text-(--app-muted) [&.Mui-selected]:text-(--app-primary) text-[10px]"
      />
    </BottomNavigation>
  );
}
