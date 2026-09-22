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
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useStorefrontNavigate } from "../../../common/hooks/useStorefrontNavigate";
import { getNormalizedStorefrontPath } from "../../../common/storefront-slug.utils";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useAppThemeMode } from "../../../theme/theme-provider";
import { themeOptions } from "../../../theme/theme";
import { logout } from "../../../features/auth/auth.slice";
import { useStorefront } from "../../../providers/storefront-provider";
import { STOREFRONT_NAV_ITEMS } from "../../navigation";
import { calculateTotals } from "../../../common/cart.utils";
import EllipsisCell from "../../../components/ellipse-cell";

export default function StorefrontHeader() {
  const navigate = useStorefrontNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  const { totalPrice } = calculateTotals(cartItems);

  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);
  const { themeId, setThemeId } = useAppThemeMode();

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const themeMenuOpen = Boolean(themeMenuAnchor);
  const userMenuOpen = Boolean(userMenuAnchor);

  const salonName = salon?.name || "Salon";

  const handleLogout = () => {
    setUserMenuAnchor(null);
    dispatch(logout());
    navigate("/");
  };

  const normalizedPath = getNormalizedStorefrontPath(location.pathname);
  const isActive = (path: string) => {
    if (path === "/") return normalizedPath === "/";
    return normalizedPath.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="border-b border-(--app-border) bg-(--app-surface)/90 backdrop-blur-md z-30"
    >
      <Toolbar className="h-16 px-2.5 sm:px-8 flex items-center justify-between gap-1.5 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Salon Brand (Editorial Stitch Style) */}
        <Box className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <IconButton
            size="small"
            className="md:hidden text-(--app-text) -ml-1"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Box
            className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 group"
            onClick={() => navigate("/")}
          >
            <Box className="relative flex items-center justify-center shrink-0">
              {salon?.logo ? (
                <Avatar
                  src={salon.logo}
                  alt={salonName}
                  variant="rounded"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-(--app-border) object-cover"
                />
              ) : (
                <Avatar
                  variant="rounded"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-(--app-primary) text-(--app-primary-contrast) font-bold text-xs sm:text-sm font-editorial"
                >
                  {salonName[0] || "S"}
                </Avatar>
              )}
              <Box
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-(--app-primary) text-(--app-primary-contrast) flex items-center justify-center ring-2 ring-(--app-surface)"
                title="Verified ZenMonk Venue"
              >
                <VerifiedOutlinedIcon className="text-[9px] sm:text-[11px]" />
              </Box>
            </Box>

            <Box className="min-w-0 max-w-[100px] xs:max-w-[130px] sm:max-w-[220px]">
              <EllipsisCell
                value={salonName}
                className="font-editorial text-xs sm:text-lg font-bold text-(--app-text) block leading-tight tracking-tight group-hover:text-(--app-primary) transition-colors"
              />
              <Box className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-(--app-surface-alt) text-(--app-muted) text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
                  {salon?.type || "Boutique"} Atelier
                </span>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Center Desktop Navigation with Editorial Underline Indicator */}
        <nav className="hidden md:flex items-center gap-8">
          {STOREFRONT_NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                type="button"
                className={`text-sm font-semibold transition-all duration-150 relative py-1 cursor-pointer bg-transparent border-0 ${
                  active
                    ? "text-(--app-primary) font-bold after:absolute after:-bottom-[19px] after:inset-x-0 after:h-0.5 after:bg-(--app-primary)"
                    : "text-(--app-muted) hover:text-(--app-text)"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <Box className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Palette Switcher */}
          <IconButton
            onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
            className="border border-(--app-border) bg-(--app-surface) rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-(--app-surface-alt) transition-all"
            aria-label="Appearance Theme"
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

          {/* Stitch-style Capsule Cart Pill */}
          <button
            onClick={() => navigate("/cart")}
            type="button"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110 transition-all shadow-[0_2px_10px_rgba(15,23,42,0.15)] cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBagOutlinedIcon className="text-[17px] text-amber-300" />
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center bg-black/20 text-white h-4.5 min-w-4.5 px-1 rounded-full text-[10px] font-black">
                {cartCount}
              </span>
              {cartCount > 0 && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="tracking-tight">₹{totalPrice}</span>
                </>
              )}
            </span>
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className="p-0 border border-(--app-border) rounded-full ring-2 ring-(--app-primary)/20"
                aria-label="User account menu"
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
              className="rounded-full font-bold px-4 py-1.5 text-xs bg-(--app-surface) text-(--app-text) border border-(--app-border) hover:bg-(--app-surface-alt) shadow-xs normal-case"
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          className: "w-60 h-full bg-(--app-surface) border-r border-(--app-border) p-4 flex flex-col justify-between overflow-hidden",
        }}
      >
        <Box>
          <Box className="flex items-center justify-between pb-3 border-b border-(--app-border) mb-4">
            <Box className="flex items-center gap-2 min-w-0">
              <Avatar
                src={salon?.logo}
                variant="rounded"
                className="w-9 h-9 rounded-xl bg-(--app-primary) text-(--app-primary-contrast) font-bold text-xs font-editorial"
              >
                {salonName[0]}
              </Avatar>
              <Typography className="font-editorial font-bold text-sm text-(--app-text) truncate">{salonName}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon className="text-[18px]" />
            </IconButton>
          </Box>

          <Box className="space-y-1.5">
            {STOREFRONT_NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <Button
                  key={item.to}
                  fullWidth
                  onClick={() => {
                    navigate(item.to);
                    setMobileDrawerOpen(false);
                  }}
                  className={`justify-start px-3.5 py-2.5 rounded-xl font-bold text-xs capitalize ${
                    active
                      ? "bg-(--app-primary-soft) text-(--app-primary)"
                      : "text-(--app-text) hover:bg-(--app-surface-alt)"
                  }`}
                >
                  {item.label}
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
