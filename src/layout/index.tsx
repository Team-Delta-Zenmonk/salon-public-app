import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import MobileNavFooter from "../components/navigation-footer/mobile-nav-footer";

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidthClass = useMemo(() => (sidebarCollapsed ? "w-[88px]" : "w-[280px]"), [sidebarCollapsed]);

  const handleMenuClick = () => {
    if (isDesktop) setSidebarCollapsed((v) => !v);
    else setMobileDrawerOpen((v) => !v);
  };

  return (
    <Box className="min-h-screen bg-slate-50 flex">
      <Box className={`${sidebarWidthClass} shrink-0 hidden md:block transition-all duration-200 ease-in-out`}>
        <Box className="h-screen sticky top-0 border-r border-slate-200 bg-white">
          <Sidebar collapsed={sidebarCollapsed} />
        </Box>
      </Box>

      <Box className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={handleMenuClick} />

        <Box className="px-4 sm:px-6 py-6 flex-1">
          <Box className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 md:p-8">
            <Outlet />
          </Box>
          <Box className="h-16 md:hidden" />
        </Box>
      </Box>

      <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} className="md:hidden">
        <Box className="w-72">
          <Sidebar collapsed={false} />
        </Box>
      </Drawer>

      <Box className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
        <MobileNavFooter />
      </Box>
    </Box>
  );
}
