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
import CloseIcon from "@mui/icons-material/Close";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useAppThemeMode } from "../../../../theme/theme-provider";
import { themeOptions } from "../../../../theme/theme";
import CartIcon from "../../../../components/header/_components/cart-button";
import { logout } from "../../../../features/auth/auth.slice";

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
  const navigate = useNavigate();
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
      className="border-b border-(--app-border) bg-(--app-surface)/95 backdrop-blur-md z-30"
    >
      <Toolbar className="min-h-16 px-3 sm:px-6 flex items-center justify-between gap-3">
        <Box className="flex items-center gap-3 min-w-0">
          <IconButton
            size="small"
            className="md:hidden text-(--app-text) -ml-1.5"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            onClick={() => onTabChange("overview")}
          >
            {salon?.logo ? (
              <Avatar
                src={salon.logo}
                alt={salonName}
                variant="rounded"
                className="w-10 h-10 rounded-xl border border-(--app-border) object-cover shrink-0"
              />
            ) : (
              <Avatar
                variant="rounded"
                className="w-10 h-10 rounded-xl bg-(--app-primary) text-(--app-primary-contrast) font-black text-sm shrink-0"
              >
                {salonName[0]}
              </Avatar>
            )}

            <Box className="min-w-0">
              <Box className="flex items-center gap-1.5">
                <Typography className="font-extrabold text-sm sm:text-base text-(--app-text) truncate leading-tight">
                  {salonName}
                </Typography>
                <Chip
                  size="small"
                  icon={<StarRoundedIcon className="text-amber-400 !text-[13px]" />}
                  label={ratingText}
                  className="hidden sm:inline-flex h-5 px-1 bg-(--app-surface-alt) text-(--app-text) font-bold text-[10px] border border-(--app-border)"
                />
              </Box>
              <Typography className="text-[11px] text-(--app-muted) truncate capitalize leading-tight mt-0.5">
                {salon?.type || "Unisex Salon"} • Verified Storefront
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="hidden md:flex items-center gap-1 bg-(--app-surface-alt) p-1 rounded-2xl border border-(--app-border)">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs capitalize transition-all duration-200 ${
                  isActive
                    ? "bg-(--app-surface) text-(--app-primary) shadow-sm"
                    : "text-(--app-muted) hover:text-(--app-text)"
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>

        <Box className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <IconButton
            onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
            className="border border-(--app-border) bg-(--app-surface) rounded-xl w-9 h-9 sm:w-10 sm:h-10 shadow-xs hover:bg-(--app-surface-alt)"
            aria-label="Change theme"
          >
            <PaletteOutlinedIcon className="text-(--app-muted) text-[18px]" />
          </IconButton>

          <Menu
            anchorEl={themeMenuAnchor}
            open={themeMenuOpen}
            onClose={() => setThemeMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                className: "mt-2 rounded-2xl border border-(--app-border) bg-(--app-surface) min-w-48 shadow-xl",
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
                  className="flex items-center justify-between py-2 text-xs font-semibold"
                >
                  <span className="text-(--app-text)">{option.label}</span>
                  {selected && <CheckIcon className="text-(--app-primary) text-[15px]" />}
                </MenuItem>
              );
            })}
          </Menu>

          <CartIcon count={cartCount} onClick={() => navigate("/cart")} />

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className="p-0 border border-(--app-border) rounded-full ring-2 ring-(--app-primary)/20"
              >
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 bg-(--app-primary-soft) text-(--app-primary) font-bold text-xs">
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
                    className: "mt-2 rounded-2xl border border-(--app-border) bg-(--app-surface) min-w-52 shadow-xl p-1",
                  },
                }}
              >
                <Box className="px-3 py-2 border-b border-(--app-border) mb-1">
                  <Typography className="text-xs font-bold text-(--app-text)">
                    {customer?.first_name || customer?.name || "Customer"}
                  </Typography>
                  <Typography className="text-[10px] text-(--app-muted) truncate">
                    {customer?.email || ""}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/bookings");
                  }}
                  className="text-xs rounded-xl flex items-center gap-2"
                >
                  <CalendarMonthOutlinedIcon className="text-[16px] text-(--app-muted)" />
                  My Bookings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                  className="text-xs rounded-xl flex items-center gap-2"
                >
                  <PersonOutlineIcon className="text-[16px] text-(--app-muted)" />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className="text-xs rounded-xl text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogoutOutlinedIcon className="text-[16px]" />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/signup")}
              className="rounded-xl font-bold px-3 py-1.5 text-xs bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110"
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
          className: "w-72 bg-(--app-surface) border-r border-(--app-border) p-4 flex flex-col justify-between",
        }}
      >
        <Box>
          <Box className="flex items-center justify-between pb-3 border-b border-(--app-border) mb-4">
            <Box className="flex items-center gap-2 min-w-0">
              <Avatar
                src={salon?.logo}
                variant="rounded"
                className="w-9 h-9 rounded-xl bg-(--app-primary) text-(--app-primary-contrast) font-bold text-xs"
              >
                {salonName[0]}
              </Avatar>
              <Typography className="font-bold text-sm text-(--app-text) truncate">{salonName}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon className="text-[18px]" />
            </IconButton>
          </Box>

          <Box className="space-y-1.5">
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
                  className={`justify-start px-3.5 py-2 rounded-xl font-bold text-xs capitalize ${
                    isActive
                      ? "bg-(--app-primary-soft) text-(--app-primary)"
                      : "text-(--app-text) hover:bg-(--app-surface-alt)"
                  }`}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box className="pt-4 border-t border-(--app-border)">
          {isAuthenticated ? (
            <Box className="space-y-2">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate("/bookings");
                  setMobileDrawerOpen(false);
                }}
                className="rounded-xl text-xs font-bold"
              >
                My Bookings
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleLogout}
                className="rounded-xl text-xs text-red-500 font-bold"
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
              className="rounded-xl text-xs font-bold bg-(--app-primary) text-(--app-primary-contrast)"
            >
              Sign In / Register
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
