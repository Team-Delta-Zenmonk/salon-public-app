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
      <Box className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
        <Box className="font-semibold text-slate-900 text-sm">{collapsed ? "Quick" : "Quick actions"}</Box>
        {!collapsed && <Box className="text-xs text-slate-500 mt-1">Find salons fast using filters.</Box>}
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
                      ? "bg-slate-900 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon
                    fontSize="small"
                    className={clsx(
                      "transition-colors duration-200 shrink-0",
                      isActive ? "text-white!" : "text-slate-600 group-hover:text-slate-900"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
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
