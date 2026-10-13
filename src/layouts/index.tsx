import React from "react";
import { Box } from "@mui/material";
import StorefrontHeader from "./_components/storefront-header";
import StorefrontFooter from "./_components/storefront-footer";
import MobileBottomNav from "./_components/mobile-bottom-nav";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <Box className={styles.layout}>
      <StorefrontHeader />

      <Box component="main" className={styles.mainContent}>
        {children}
      </Box>

      <StorefrontFooter />

      <Box className={styles.mobileNavWrapper}>
        <MobileBottomNav />
      </Box>
    </Box>
  );
}

