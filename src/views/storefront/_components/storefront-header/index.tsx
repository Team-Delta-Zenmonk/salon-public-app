import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Chip,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
"use client";
import CloseIcon from "@mui/icons-material/Close";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useStorefrontNavigate } from "../../../../common/hooks/useStorefrontNavigate";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useAppThemeMode } from "../../../../theme/theme-provider";
import { themeOptions } from "../../../../theme/theme";
import CartIcon from "../../../../components/header/_components/cart-button";
import { logout } from "../../../../features/auth/auth.slice";
import styles from "./storefront-header.module.css";

export type StorefrontTab = "overview" | "services" | "specialists" | "hours";

interface StorefrontHeaderProps {
  salon: any;
  activeTab: StorefrontTab;
  onTabChange: (tab: StorefrontTab) => void;
}

export default function StorefrontHeader({
  salon,
  activeTab,
  onTabChange,
}: Readonly<StorefrontHeaderProps>) {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);
  const { themeId, setThemeId } = useAppThemeMode();

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const themeMenuOpen = Boolean(themeMenuAnchor);
  const userMenuOpen = Boolean(userMenuAnchor);

  const salonName = salon?.name || "Luxury Salon";
  const ratingText = String(salon?.rating ?? "4.9");

  const tabs: { id: StorefrontTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services & Menu" },
    { id: "specialists", label: "Our Specialists" },
    { id: "hours", label: "About & Hours" },
  ];

  const handleLogout = () => {
    setUserMenuAnchor(null);
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={styles.appBar}
    >
      <Toolbar className={styles.toolbar}>
        <Box className={styles.brandContainer}>
          <IconButton
            size="small"
            className={styles.menuButton}
            onClick={() => setMobileDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            className={styles.brandLink}
            onClick={() => onTabChange("overview")}
          >
            {salon?.logo ? (
              <Avatar
                src={salon.logo}
                alt={salonName}
                variant="rounded"
                className={styles.logoAvatar}
              />
            ) : (
              <Avatar
                variant="rounded"
                className={styles.fallbackAvatar}
              >
                {salonName[0]}
              </Avatar>
            )}

            <Box className={styles.brandInfo}>
              <Box className={styles.titleRow}>
                <Typography className={styles.salonTitle}>
                  {salonName}
                </Typography>
                <Chip
                  size="small"
                  icon={<StarRoundedIcon className={styles.starIcon} />}
                  label={ratingText}
                  className={styles.ratingChip}
                />
              </Box>
              <Typography className={styles.salonMeta}>
                {salon?.type || "Unisex Salon"} • Verified Storefront
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className={styles.navTabsWrapper}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${styles.navTabBtn} ${isActive ? styles.navTabBtnActive : ""}`}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>

        <Box className={styles.actionsGroup}>
          <IconButton
            onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
            className={styles.iconButton}
            aria-label="Change theme"
          >
            <PaletteOutlinedIcon className={styles.paletteIcon} />
          </IconButton>

          <Menu
            anchorEl={themeMenuAnchor}
            open={themeMenuOpen}
            onClose={() => setThemeMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                className: styles.themeMenuPaper,
              },
            }}
          >
            {themeOptions.map((option) => {
              const selected = themeId === option.id;
              return (
                <MenuItem
                  key={option.id}
                  onClick={() => {
                    setThemeId(option.id);
                    setThemeMenuAnchor(null);
                  }}
                  className={styles.themeMenuItem}
                >
                  <span style={{ color: "var(--app-text)" }}>{option.label}</span>
                  {selected && <CheckIcon sx={{ color: "var(--app-primary)", fontSize: "15px" }} />}
                </MenuItem>
              );
            })}
          </Menu>

          <CartIcon count={cartCount} onClick={() => navigate("/cart")} />

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className={styles.userAvatarBtn}
              >
                <Avatar className={styles.userAvatar}>
                  {customer?.first_name?.[0] || customer?.name?.[0] || "U"}
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
                    className: styles.userMenuPaper,
                  },
                }}
              >
                <Box className={styles.userMenuHeader}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "var(--app-text)" }}>
                    {customer?.first_name || customer?.name || "Customer"}
                  </Typography>
                  <Typography sx={{ fontSize: "10px", color: "var(--app-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {customer?.email || ""}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/bookings");
                  }}
                  className={styles.userMenuItem}
                >
                  <CalendarMonthOutlinedIcon sx={{ fontSize: "16px", color: "var(--app-muted)" }} />
                  My Bookings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                  className={styles.userMenuItem}
                >
                  <PersonOutlineIcon sx={{ fontSize: "16px", color: "var(--app-muted)" }} />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className={`${styles.userMenuItem} ${styles.userMenuItemDanger}`}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: "16px" }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/signup")}
              className={styles.signInBtn}
            >
              Sign In
            </Button>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
              <Avatar
                src={salon?.logo}
                variant="rounded"
                sx={{ width: 36, height: 36, borderRadius: "0.75rem", bgcolor: "var(--app-primary)", color: "var(--app-primary-contrast)", fontWeight: 700, fontSize: "0.75rem" }}
              >
                {salonName[0]}
              </Avatar>
              <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--app-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{salonName}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Box>

          <Box className={styles.drawerTabsList}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  fullWidth
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`${styles.drawerTabBtn} ${isActive ? styles.drawerTabBtnActive : ""}`}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box className={styles.drawerFooter}>
          {isAuthenticated ? (
            <Box className={styles.drawerActions}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate("/bookings");
                  setMobileDrawerOpen(false);
                }}
                sx={{ borderRadius: "0.75rem", fontSize: "0.75rem", fontWeight: 700 }}
              >
                My Bookings
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleLogout}
                sx={{ borderRadius: "0.75rem", color: "#ef4444", fontWeight: 700 }}
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                navigate("/signup");
                setMobileDrawerOpen(false);
              }}
              className={styles.signInBtn}
            >
              Sign In / Register
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
