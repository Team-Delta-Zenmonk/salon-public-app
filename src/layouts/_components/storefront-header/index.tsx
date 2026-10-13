"use client";
import styles from "./header.module.css";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStorefrontNavigate } from "../../../common/hooks/useStorefrontNavigate";
import { getNormalizedStorefrontPath } from "../../../common/storefront-slug.utils";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { logout } from "../../../features/auth/auth.slice";
import { useStorefront } from "../../../providers/storefront-provider";
import { STOREFRONT_NAV_ITEMS } from "../../navigation";
import EllipsisCell from "@/components/ellipse-cell";
import Image from "next/image";

export default function StorefrontHeader() {
  const navigate = useStorefrontNavigate();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const userMenuOpen = Boolean(userMenuAnchor);

  const salonName = salon?.name || "ATELIER SOLSTICE";
  const salonSub = salon?.type ? `${salon.type.toUpperCase()} SANCTUARY` : "HAUTE COIFFURE & SPA";

  const handleLogout = () => {
    setUserMenuAnchor(null);
    dispatch(logout());
    navigate("/");
  };

  const normalizedPath = getNormalizedStorefrontPath(pathname || "");
  const isActive = (path: string) => {
    if (path === "/") return normalizedPath === "/";
    return normalizedPath.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={styles.appBar}
    >
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoBox}>
          <IconButton
            size="small"
            className={styles.mobileMenuButton}
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Box
            className={styles.logoLink}
            onClick={() => navigate("/")}
          >
            <Box className={styles.logoWrapper}>
              {salon?.logo ? (
                <Image
                  src={salon.logo}
                  alt={salonName}
                  fill
                  sizes="40px"
                  className={styles.objectCover}
                  unoptimized
                />
              ) : (
                <span className={styles.logoInitial}>
                  {salonName[0]}
                </span>
              )}
            </Box>

            <Box className={styles.flexCol}>
              <EllipsisCell value={salonName} className={styles.salonName} maxChars={20} />
              <span className={styles.salonSub}>
                {salonSub}
              </span>
            </Box>
          </Box>
        </Box>

        <nav className={styles.navContainer}>
          {STOREFRONT_NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                type="button"
                className={`${styles.navButton} ${active ? styles.navButtonActive : styles.navButtonInactive}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <Box className={styles.rightContainer}>
          <button
            onClick={() => navigate("/cart")}
            type="button"
            aria-label="Shopping Cart"
            className={styles.cartButton}
          >
            <ShoppingBagOutlinedIcon style={{ fontSize: "18px" }} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/services" : "/signup")}
            className={styles.reserveButton}
          >
            {isAuthenticated ? "RESERVE RITUAL" : "CLIENT SIGN IN"}
          </button>

          {isAuthenticated && (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className={styles.userAvatarButton}
                aria-label="User account menu"
              >
                <Avatar className={styles.avatar}>
                  {customer?.first_name?.[0] || customer?.name?.[0] || "C"}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={userMenuOpen}
                onClose={() => setUserMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    className: styles.menuPaper,
                  },
                }}
              >
                <Box className={styles.menuItemHeader}>
                  <Typography className={styles.menuItemTitle}>
                    {customer?.first_name || customer?.name || "Client"}
                  </Typography>
                  <Typography className={styles.menuItemSubtitle}>
                    {customer?.email || ""}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/bookings");
                  }}
                  className={styles.menuItem}
                >
                  <CalendarMonthOutlinedIcon style={{ fontSize: "16px", color: "var(--app-muted)" }} />
                  My Bookings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                  className={styles.menuItem}
                >
                  <PersonOutlineIcon style={{ fontSize: "16px", color: "var(--app-muted)" }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className={styles.menuItem}
                  style={{ color: "var(--app-hex-8f4d47, #8F4D47)" }}
                >
                  <LogoutOutlinedIcon style={{ fontSize: "16px" }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          className: styles.drawerPaper,
        }}
      >
        <Box>
          <Box className={styles.drawerHeader}>
            <Box className={styles.drawerUserBox}>
              <Box className={styles.drawerHeaderIcon}>
                {salonName[0]}
              </Box>
              <Typography className={styles.drawerHeaderTitle}>
                {salonName}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)} className={styles.closeButton}>
              <CloseIcon style={{ fontSize: "18px" }} />
            </IconButton>
          </Box>

          <Box className={styles.drawerNavList}>
            {STOREFRONT_NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setMobileDrawerOpen(false);
                  }}
                  className={`${styles.drawerNavButton} ${active ? styles.drawerNavButtonActive : styles.drawerNavButtonInactive}`}
                >
                  {ItemIcon && <ItemIcon className={styles.drawerNavIcon} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </Box>
        </Box>

        <Box className={styles.drawerFooter}>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className={styles.signOutButton}
            >
              <LogoutOutlinedIcon style={{ fontSize: "16px" }} />
              <span>SIGN OUT</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                navigate("/signup");
                setMobileDrawerOpen(false);
              }}
              className={styles.signInButton}
            >
              <PersonOutlineIcon style={{ fontSize: "16px" }} />
              <span>CLIENT SIGN IN / RESERVE</span>
            </button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
