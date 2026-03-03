import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { navigation } from "../../layouts/navigation";
import LogoutButton from "../logout";
import { useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import LoginButton from "../login/login-button";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Box className="h-full p-3 space-y-5 flex flex-col">
      <Box className="p-3 rounded-2xl bg-(--app-surface-alt) border border-(--app-border) shrink-0">
        <Box className="font-semibold text-(--app-text) text-sm">{collapsed ? "Quick" : "Quick actions"}</Box>
        {!collapsed && <Box className="text-xs text-(--app-muted) mt-1">Find salons fast using filters.</Box>}
      </Box>
      <Box className="flex flex-col gap-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined}>
              {({ isActive }) => (
                <Box
                  className={clsx(
                    "group flex items-center gap-4 px-3 py-2 rounded-xl font-medium transition-all duration-200",
                    collapsed && "justify-center py-3",
                    isActive
                      ? "bg-(--app-primary) text-(--app-primary-contrast) shadow-[0_10px_24px_rgba(15,23,42,0.22)]"
                      : "text-(--app-muted) hover:bg-(--app-surface-alt) hover:text-(--app-text)"
                  )}
                >
                  <Icon
                    fontSize="small"
                    className={clsx(
                      "transition-colors duration-200 shrink-0",
                      isActive ? "text-(--app-primary-contrast)" : "text-(--app-muted) group-hover:text-(--app-text)"
                    )}
                  />
                  {!collapsed && <Box component="span">{item.label}</Box>}
                </Box>
              )}
            </NavLink>
          );
        })}
      </Box>
      {isAuthenticated ? <LogoutButton collapsed={collapsed} /> : <LoginButton collapsed={collapsed}/>}
    </Box>
  );
}
