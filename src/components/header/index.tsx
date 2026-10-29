"use client";
import { AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CartIcon from "./_components/cart-button";
import { useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppThemeMode } from "../../theme/theme-provider";
import { themeOptions, type AppThemeId } from "../../theme/theme";
import { useState } from "react";
import EllipsisCell from "../ellipse-cell";

import styles from "./header.module.css";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Readonly<HeaderProps>) {
  const cartCount = useAppSelector((state: RootState) => state.cart.items.length);
  const navigate = useStorefrontNavigate();
  const { themeId, setThemeId } = useAppThemeMode();
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const themeMenuOpen = Boolean(themeMenuAnchor);

  const onThemeChange = (nextTheme: AppThemeId) => {
    setThemeId(nextTheme);
    setThemeMenuAnchor(null);
  };

  const { salon } = useStorefront();
  const activeSalonName = salon?.name || "Glow Salon";

  return (
    <AppBar position="sticky" elevation={0} color="transparent" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftSection}>
          <IconButton size="small" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Box
            className={styles.salonBrand}
            onClick={() => navigate("/")}
          >
            <EllipsisCell
              value={activeSalonName}
              className={styles.salonTitle}
            />
            <Box className={styles.salonSubtitle}>Discover & Book</Box>
          </Box>
        </Box>

        <Box className={styles.rightSection}>
          <IconButton
            onClick={(event) => setThemeMenuAnchor(event.currentTarget)}
            className={styles.themeToggleBtn}
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
                  onClick={() => onThemeChange(option.id)}
                  className={styles.menuItemRow}
                >
                  <Box component="span" className={styles.menuItemLabel}>
                    {option.label}
                  </Box>
                  {selected && <CheckIcon className={styles.checkIcon} />}
                </MenuItem>
              );
            })}
          </Menu>
          <Box className={styles.cartButtonWrapper}>
            <CartIcon count={cartCount} onClick={() => navigate("/cart")} />
          </Box>
          <Avatar className={styles.avatar}>U</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
