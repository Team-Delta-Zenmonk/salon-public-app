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
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckIcon from "@mui/icons-material/Check";
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

export default function StorefrontHeader() {
  const navigate = useStorefrontNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);
  const { themeId, setThemeId } = useAppThemeMode();

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const themeMenuOpen = Boolean(themeMenuAnchor);
  const userMenuOpen = Boolean(userMenuAnchor);

  const salonName = salon?.name?.toUpperCase() || "CRIMSON & SHEAR";
  const salonSub = salon?.type ? `${salon.type.toUpperCase()} ATELIER` : "HAUTE COIFFURE ATELIER";

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
      className="bg-[var(--app-surface)]/90 backdrop-blur-md top-0 sticky z-50 border-b border-[var(--app-border)] shadow-2xl"
    >
      <Toolbar className="flex justify-between items-center w-full px-4 md:px-12 max-w-[1440px] mx-auto py-3 min-h-20">
        {/* Brand Logo & Sparkle Motif (Stitch 1:1 Spec) */}
        <Box className="flex items-center gap-3">
          <IconButton
            size="small"
            className="md:hidden text-[var(--app-text)] -ml-2"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Box
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <Box className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-[var(--app-primary)] to-[var(--app-muted)] shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
              {salon?.logo ? (
                <img
                  src={salon.logo}
                  alt={salonName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <img
                  alt="Scissors & Comb Sparkle Brand Icon"
                  className="w-full h-full object-cover rounded-[10px]"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XYBNkbZmqEwkR3adhjz9QTOyWbaMxUk-gfuu_Mge1ZI579t29IMLyeogxRK2lexlZXOkzRqxVeSVLaaGoLBAe9cRHHB9JMnXg9N0hIqs_TGliGBA4Yfpq7vXPs9LsvA_EY0trF4-zxLyEM8Z-R_Ns_Z7QtVvmTVwqR8x54ElH1DUCaGNI5ufS5JuyYytDDZQ8UXnNQpj4jWA1XwMCvOb_CIzGfbxU9apPJ2Yf2dx3sbB9Gj2A2Lt3-8UY"
                />
              )}
            </Box>

            <Box className="flex flex-col">
              <span className="font-editorial text-lg tracking-wider text-[var(--app-text)] font-semibold leading-tight group-hover:text-[var(--app-primary)] transition-colors">
                {salonName}
              </span>
              <span className="text-[11px] tracking-[0.2em] text-[var(--app-primary)] font-bold uppercase -mt-1 opacity-90">
                {salonSub}
              </span>
            </Box>
          </Box>
        </Box>

        {/* Desktop Navigation Links (Stitch Spec) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {STOREFRONT_NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                type="button"
                className={`text-sm font-semibold transition-all duration-200 cursor-pointer bg-transparent border-0 py-1 ${
                  active
                    ? "text-[var(--app-primary)] border-b-2 border-[var(--app-primary)] pb-1"
                    : "text-[var(--app-muted)] hover:text-[var(--app-primary)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Trailing Actions (Shopping Bag, Theme Switcher, Book Treatment Button & User Profile) */}
        <Box className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Theme Palette Switcher Button */}
          <IconButton
            onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
            className="p-2 text-[var(--app-muted)] hover:text-[var(--app-primary)] transition-colors"
            aria-label="Appearance Theme"
            title="Switch Visual Theme"
          >
            <PaletteOutlinedIcon className="text-[22px]" />
          </IconButton>

          <Menu
            anchorEl={themeMenuAnchor}
            open={themeMenuOpen}
            onClose={() => setThemeMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                className: "mt-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] min-w-52 shadow-xl p-1 text-[var(--app-text)]",
              },
            }}
          >
            <Box className="px-3 py-2 border-b border-[var(--app-border)] mb-1">
              <Typography className="text-xs font-bold text-[var(--app-primary)] uppercase tracking-wider">
                Theme Presets
              </Typography>
            </Box>
            {themeOptions.map((option) => {
              const selected = themeId === option.id;
              return (
                <MenuItem
                  key={option.id}
                  onClick={() => {
                    setThemeId(option.id);
                    setThemeMenuAnchor(null);
                  }}
                  className="flex items-center justify-between py-2 text-xs font-semibold rounded-xl hover:bg-[var(--app-surface-alt)]"
                >
                  <span className={selected ? "text-[var(--app-primary)] font-bold" : "text-[var(--app-text)]"}>
                    {option.label}
                  </span>
                  {selected && <CheckIcon className="text-[var(--app-primary)] text-[16px]" />}
                </MenuItem>
              );
            })}
          </Menu>

          {/* Shopping Bag Icon Button with Counter Badge */}
          <button
            onClick={() => navigate("/cart")}
            type="button"
            aria-label="Shopping Bag"
            className="relative p-2 text-[var(--app-muted)] hover:text-[var(--app-primary)] transition-colors duration-200 cursor-pointer bg-transparent border-0 flex items-center justify-center"
          >
            <ShoppingBagOutlinedIcon className="text-[24px]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[var(--app-surface)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Treatment CTA */}
          <Button
            variant="contained"
            onClick={() => navigate(isAuthenticated ? "/services" : "/signup")}
            startIcon={<CalendarTodayOutlinedIcon className="text-[18px]" />}
            className="px-5 py-2.5 rounded-lg text-xs font-bold crimson-glow hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg normal-case border-0"
          >
            {isAuthenticated ? "Book Treatment" : "Sign In / Book"}
          </Button>

          {/* User Profile Avatar */}
          {isAuthenticated && (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className="p-0 border border-[var(--app-border)] rounded-full ring-2 ring-[var(--app-primary)]/20"
                aria-label="User account menu"
              >
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--app-surface-alt)] text-[var(--app-primary)] font-bold text-xs border border-[var(--app-border)]">
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
                    className: "mt-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] min-w-52 shadow-xl p-1 text-[var(--app-text)]",
                  },
                }}
              >
                <Box className="px-3 py-2 border-b border-[var(--app-border)] mb-1">
                  <Typography className="text-xs font-bold text-[var(--app-text)]">
                    {customer?.first_name || customer?.name || "Customer"}
                  </Typography>
                  <Typography className="text-[10px] text-[var(--app-muted)] truncate">
                    {customer?.email || ""}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/bookings");
                  }}
                  className="text-xs rounded-xl flex items-center gap-2 hover:bg-[var(--app-surface-alt)]"
                >
                  <CalendarMonthOutlinedIcon className="text-[16px] text-[var(--app-muted)]" />
                  My Bookings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                  className="text-xs rounded-xl flex items-center gap-2 hover:bg-[var(--app-surface-alt)]"
                >
                  <PersonOutlineIcon className="text-[16px] text-[var(--app-muted)]" />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className="text-xs rounded-xl text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                >
                  <LogoutOutlinedIcon className="text-[16px]" />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          className: "w-64 h-full bg-[var(--app-surface)] border-r border-[var(--app-border)] p-5 flex flex-col justify-between overflow-hidden text-[var(--app-text)]",
        }}
      >
        <Box>
          <Box className="flex items-center justify-between pb-4 border-b border-[var(--app-border)] mb-5">
            <Box className="flex items-center gap-2.5 min-w-0">
              <Box className="w-8 h-8 rounded-lg flex items-center justify-center font-editorial font-bold text-sm shrink-0">
                {salonName[0]}
              </Box>
              <Typography className="font-editorial font-bold text-sm text-[var(--app-text)] truncate">
                {salonName}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)} className="text-[var(--app-muted)]">
              <CloseIcon className="text-[18px]" />
            </IconButton>
          </Box>

          <Box className="space-y-2">
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
                  className={`justify-start px-4 py-3 rounded-xl font-bold text-xs capitalize ${
                    active
                      ? "bg-[var(--app-surface-alt)] text-[var(--app-primary)] border border-[var(--app-primary)]/30"
                      : "text-[var(--app-muted)] hover:bg-[var(--app-surface-alt)] hover:text-[var(--app-text)]"
                  }`}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box className="pt-4 border-t border-[var(--app-border)]">
          {isAuthenticated ? (
            <Box className="space-y-2">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigate("/bookings");
                  setMobileDrawerOpen(false);
                }}
                className="rounded-xl text-xs font-bold border-[var(--app-border)] text-[var(--app-text)]"
              >
                My Bookings
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleLogout}
                className="rounded-xl -400 font-bold"
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
              className="rounded-xl text-xs font-bold hover:bg-[var(--app-primary)]/90"
            >
              Sign In / Reserve
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
