"use client";
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
      className="!bg-(--app-surface)/95 backdrop-blur-md top-0 sticky z-50 !border-b !border-(--app-border) shadow-xs"
    >
      <Toolbar className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1440px] mx-auto py-4 min-h-20">
        <Box className="flex items-center gap-4">
          <IconButton
            size="small"
            className="md:hidden text-(--app-text) -ml-2"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Box
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <Box className="w-10 h-10 rounded-[2px] overflow-hidden p-0.5 border border-(--app-border) bg-(--app-surface-alt) flex items-center justify-center transition-all duration-300 group-hover:border-(--app-primary) shrink-0 relative">
              {salon?.logo ? (
                <Image
                  src={salon.logo}
                  alt={salonName}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="font-serif text-(--app-text) font-medium text-lg">
                  {salonName[0]}
                </span>
              )}
            </Box>

            <Box className="flex flex-col">
              <EllipsisCell value={salonName} className="font-serif text-xl tracking-tight text-(--app-text) font-medium leading-none group-hover:text-(--app-champagne) transition-colors" maxChars={20} />
              <span className="font-sans text-[9px] tracking-[0.18em] text-(--app-muted) uppercase mt-1 font-semibold">
                {salonSub}
              </span>
            </Box>
          </Box>
        </Box>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {STOREFRONT_NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                type="button"
                className={`font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer bg-transparent border-0 py-1 ${active
                  ? "text-(--app-text) border-b-2 border-(--app-primary) pb-1"
                  : "text-(--app-muted) hover:text-(--app-text)"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <Box className="hidden md:flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={() => navigate("/cart")}
            type="button"
            aria-label="Shopping Cart"
            className="relative p-2 text-(--app-text) hover:text-(--app-champagne) transition-colors duration-200 cursor-pointer bg-transparent border-0 flex items-center justify-center"
          >
            <ShoppingBagOutlinedIcon className="text-[22px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[9px] font-semibold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center bg-(--app-primary) text-(--app-surface)">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/services" : "/signup")}
            className="hidden lg:inline-flex px-5 py-2.5 rounded-[2px] bg-(--app-primary) text-(--app-surface) font-sans text-xs font-semibold uppercase tracking-[0.1em] hover:bg-(--app-text)/90 transition-all cursor-pointer border-0"
          >
            {isAuthenticated ? "RESERVE RITUAL" : "CLIENT SIGN IN"}
          </button>

          {isAuthenticated && (
            <>
              <IconButton
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                className="p-0 border border-(--app-border) rounded-full"
                aria-label="User account menu"
              >
                <Avatar className="w-8 h-8 bg-(--app-surface-alt) text-(--app-text) font-serif font-medium text-sm border border-(--app-border)">
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
                    className: "mt-2 rounded-[2px] border border-(--app-border) bg-(--app-surface) min-w-56 shadow-md p-1 text-(--app-text)",
                  },
                }}
              >
                <Box className="px-3 py-2 border-b border-(--app-border) mb-1">
                  <Typography className="text-xs font-semibold text-(--app-text)">
                    {customer?.first_name || customer?.name || "Client"}
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
                  className="text-xs rounded-[2px] flex items-center gap-2 hover:bg-(--app-surface-alt)"
                >
                  <CalendarMonthOutlinedIcon className="text-[16px] text-(--app-muted)" />
                  My Bookings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                  className="text-xs rounded-[2px] flex items-center gap-2 hover:bg-(--app-surface-alt)"
                >
                  <PersonOutlineIcon className="text-[16px] text-(--app-muted)" />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className="text-xs rounded-[2px] text-[#8F4D47] hover:bg-(--app-surface-alt) flex items-center gap-2"
                >
                  <LogoutOutlinedIcon className="text-[16px]" />
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
          className: "w-72 h-full bg-(--app-surface) border-r border-(--app-border) p-6 flex flex-col justify-between overflow-hidden text-(--app-text)",
        }}
      >
        <Box>
          <Box className="flex items-center justify-between pb-4 border-b border-(--app-border) mb-6">
            <Box className="flex items-center gap-3 min-w-0">
              <Box className="w-8 h-8 rounded-[2px] border border-(--app-border) bg-(--app-surface-alt) flex items-center justify-center font-serif text-sm">
                {salonName[0]}
              </Box>
              <Typography className="font-serif font-medium text-base text-(--app-text) truncate">
                {salonName}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)} className="text-(--app-muted)">
              <CloseIcon className="text-[18px]" />
            </IconButton>
          </Box>

          <Box className="space-y-3">
            {STOREFRONT_NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-all cursor-pointer border-0 ${active
                    ? "bg-(--app-surface-alt) text-(--app-text) border-l-2 border-(--app-primary)"
                    : "text-(--app-muted) bg-transparent hover:text-(--app-text)"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </Box>
        </Box>

        <Box className="pt-3 border-t border-(--app-border)">
          {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-[#8F4D47] bg-transparent font-sans text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer border-0"
              >
                SIGN OUT
              </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                navigate("/signup");
                setMobileDrawerOpen(false);
              }}
              className="w-full bg-(--app-primary) text-(--app-surface) rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer border-0"
            >
              CLIENT SIGN IN / RESERVE
            </button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
