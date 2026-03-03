import { AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CartIcon from "./_components/cart-button";
import { useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useAppThemeMode } from "../../theme/theme-provider";
import { themeOptions, type AppThemeId } from "../../theme/theme";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const cartCount = useAppSelector((state: RootState) => state.cart.items.length);
  const navigate = useNavigate();
  const { themeId, setThemeId } = useAppThemeMode();
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const themeMenuOpen = Boolean(themeMenuAnchor);

  const onThemeChange = (nextTheme: AppThemeId) => {
    setThemeId(nextTheme);
    setThemeMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" elevation={0} color="transparent" className="bg-transparent">
      <Toolbar className="min-h-14 sm:min-h-16 px-3 sm:px-5">
        <Box className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <IconButton size="small" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Box className="leading-tight min-w-0">
            <Box className="font-semibold text-sm sm:text-base text-(--app-text) truncate">Salon App</Box>
            <Box className="text-xs sm:text-sm text-(--app-muted) truncate">Discover & Book</Box>
          </Box>
        </Box>

        <Box className="flex items-center gap-2 sm:gap-3">
          <IconButton
            onClick={(event) => setThemeMenuAnchor(event.currentTarget)}
            className="border border-(--app-border) bg-(--app-surface) rounded-xl w-10 h-10 shadow-sm hover:bg-(--app-surface-alt)"
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
                className: "mt-2 rounded-xl border border-(--app-border) bg-(--app-surface) min-w-44",
              },
            }}
          >
            {themeOptions.map((option) => {
              const selected = themeId === option.id;
              return (
                <MenuItem key={option.id} onClick={() => onThemeChange(option.id)} className="flex items-center justify-between gap-4">
                  <Box component="span" className="text-sm text-(--app-text)">
                    {option.label}
                  </Box>
                  {selected && <CheckIcon className="text-(--app-primary) text-[16px]" />}
                </MenuItem>
              );
            })}
          </Menu>
          <CartIcon count={cartCount} onClick={() => navigate("/cart")} />
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-(--app-primary-soft) text-(--app-text)">
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
