import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import StorefrontHeader from "./_components/storefront-header";
import StorefrontFooter from "./_components/storefront-footer";
import MobileBottomNav from "./_components/mobile-bottom-nav";
import { StorefrontProvider } from "../providers/storefront-provider";

export default function AppLayout() {
  return (
    <Box className="min-h-screen bg-(--app-bg) flex flex-col">
      <StorefrontHeader />

      <Box component="main" className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-4 md:pb-8">
        <Outlet />
      </Box>

      <StorefrontFooter />

      <Box className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <MobileBottomNav />
      </Box>
    </Box>
  );
}
