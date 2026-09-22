import { Box, Typography, Avatar, Button, Divider, Paper } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logout } from "../../features/auth/auth.slice";

export default function Profile() {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector((state) => state.auth);

  const fullName = `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() || customer?.name || "Client";
  const initials = customer?.first_name?.[0] || customer?.name?.[0] || "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-12">
      <Box>
        <Typography className="text-xl sm:text-2xl font-black text-(--app-text) tracking-tight">
          My Account
        </Typography>
        <Typography className="text-xs sm:text-sm text-(--app-muted) mt-0.5">
          Manage your contact details and view appointment history
        </Typography>
      </Box>

      {/* Profile Card */}
      <Paper
        elevation={0}
        className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <Box className="flex items-center gap-4">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 bg-(--app-primary) text-(--app-primary-contrast) font-black text-xl sm:text-2xl">
            {initials}
          </Avatar>
          <Box className="min-w-0">
            <Typography className="font-black text-lg sm:text-xl text-(--app-text) truncate">
              {fullName}
            </Typography>
            <Typography className="text-xs text-(--app-muted) truncate">
              Registered Client
            </Typography>
          </Box>
        </Box>

        <Divider className="border-(--app-border)" />

        {/* Contact Info */}
        <Box className="space-y-3">
          <Typography className="text-xs font-bold uppercase tracking-wider text-(--app-muted)">
            Contact Information
          </Typography>

          <Box className="flex items-center gap-3 text-xs sm:text-sm text-(--app-text) p-3 rounded-2xl bg-(--app-surface-alt)">
            <EmailOutlinedIcon className="text-(--app-primary) text-[18px]" />
            <span className="font-medium">{customer?.email || "No email provided"}</span>
          </Box>

          {customer?.phone && (
            <Box className="flex items-center gap-3 text-xs sm:text-sm text-(--app-text) p-3 rounded-2xl bg-(--app-surface-alt)">
              <PhoneOutlinedIcon className="text-(--app-primary) text-[18px]" />
              <span className="font-medium">{customer.phone}</span>
            </Box>
          )}
        </Box>

        <Divider className="border-(--app-border)" />

        {/* Quick Links */}
        <Box className="space-y-3">
          <Typography className="text-xs font-bold uppercase tracking-wider text-(--app-muted)">
            Quick Actions
          </Typography>

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/bookings")}
              startIcon={<CalendarMonthOutlinedIcon />}
              className="justify-start rounded-2xl py-3 px-4 font-bold text-xs normal-case border-(--app-border) text-(--app-text) hover:bg-(--app-surface-alt)"
            >
              My Appointments
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/services")}
              startIcon={<ContentCutOutlinedIcon />}
              className="justify-start rounded-2xl py-3 px-4 font-bold text-xs normal-case border-(--app-border) text-(--app-text) hover:bg-(--app-surface-alt)"
            >
              Book New Treatment
            </Button>
          </Box>
        </Box>

        <Divider className="border-(--app-border)" />

        {/* Sign Out */}
        <Button
          fullWidth
          variant="text"
          onClick={handleLogout}
          startIcon={<LogoutOutlinedIcon />}
          className="rounded-2xl py-2.5 font-bold text-xs text-red-500 hover:bg-red-500/10 normal-case"
        >
          Sign Out of Account
        </Button>
      </Paper>
    </Box>
  );
}
