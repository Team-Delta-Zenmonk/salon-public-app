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

import styles from "./mobile-bottom-nav.module.css";

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
      className={styles.bottomNav}
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
        icon={<HomeOutlinedIcon className={styles.actionIcon} />}
        className={styles.actionItem}
        classes={{ selected: styles.actionItemSelected }}
      />
      <BottomNavigationAction
        label="Services"
        value="/services"
        icon={<ContentCutOutlinedIcon className={styles.actionIcon} />}
        className={styles.actionItem}
        classes={{ selected: styles.actionItemSelected }}
      />
      <BottomNavigationAction
        label="Cart"
        value="/cart"
        icon={
          <Badge
            badgeContent={cartCount}
            color="primary"
            max={9}
            className={styles.badge}
          >
            <ShoppingBagOutlinedIcon className={styles.actionIcon} />
          </Badge>
        }
        className={styles.actionItem}
        classes={{ selected: styles.actionItemSelected }}
      />
      <BottomNavigationAction
        label="Bookings"
        value="/bookings"
        icon={<CalendarMonthOutlinedIcon className={styles.actionIcon} />}
        className={styles.actionItem}
        classes={{ selected: styles.actionItemSelected }}
      />
      <BottomNavigationAction
        label="Account"
        value="/profile"
        icon={<PersonOutlineOutlinedIcon className={styles.actionIcon} />}
        className={styles.actionItem}
        classes={{ selected: styles.actionItemSelected }}
      />
    </BottomNavigation>
  );
}
