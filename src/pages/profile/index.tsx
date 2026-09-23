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

import { useStorefront } from "../../providers/storefront-provider";

export default function Profile() {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector((state) => state.auth);
  const { salon } = useStorefront();

  const salonName = salon?.name || "Sanctuary";
  const fullName = `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() || customer?.name || "Client";
  const initials = customer?.first_name?.[0] || customer?.name?.[0] || "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-10 px-4">
      <Box className="max-w-2xl mx-auto space-y-8">
        <Box>
          <Typography className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--app-text)] tracking-tight">
            Client Dossier & {salonName} Profile
          </Typography>
          <Typography className="text-xs text-[var(--app-muted)]/70 mt-1 font-mono uppercase tracking-wider">
            Manage your personal sanctuary membership & credentials
          </Typography>
        </Box>

        {/* Profile Card */}
        <Paper
          elevation={0}
          className="rounded-2xl border border-[var(--app-primary)]/15 bg-[var(--app-surface)] p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <Box className="flex items-center gap-5">
            <Avatar className="w-18 h-18 sm:w-22 sm:h-22 bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary)] text-[var(--app-bg)] font-editorial font-bold text-2xl border-2 border-[var(--app-primary)]/30 shadow-lg">
              {initials}
            </Avatar>
            <Box className="min-w-0">
              <Typography className="font-editorial text-xl sm:text-2xl font-bold text-[var(--app-text)] truncate">
                {fullName}
              </Typography>
              <Box className="mt-1 px-3 py-0.5 /10 border border-[var(--app-primary)]/30 rounded-full w-fit">
                <Typography className="text-[10px] font-mono font-semibold text-[var(--app-primary)] uppercase tracking-widest">
                  VIP Patron Member
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider className="border-[var(--app-primary)]/10" />

          {/* Contact Info */}
          <Box className="space-y-3">
            <Typography className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--app-primary)]/70">
              Credentials & Contact
            </Typography>

            <Box className="flex items-center gap-3 text-xs sm:text-sm text-[var(--app-text)] p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-primary)]/10">
              <EmailOutlinedIcon className="text-[var(--app-primary)] text-lg" />
              <span className="font-medium">{customer?.email || "No email provided"}</span>
            </Box>

            {customer?.phone && (
              <Box className="flex items-center gap-3 text-xs sm:text-sm text-[var(--app-text)] p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-primary)]/10">
                <PhoneOutlinedIcon className="text-[var(--app-primary)] text-lg" />
                <span className="font-medium">{customer.phone}</span>
              </Box>
            )}
          </Box>

          <Divider className="border-[var(--app-primary)]/10" />

          {/* Quick Links */}
          <Box className="space-y-3">
            <Typography className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--app-primary)]/70">
              Sanctuary Actions
            </Typography>

            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/bookings")}
                startIcon={<CalendarMonthOutlinedIcon className="text-[var(--app-primary)]" />}
                className="justify-start rounded-xl py-3.5 px-4 font-bold text-xs uppercase tracking-wider border border-[var(--app-primary)]/20 hover:/10 hover:border-[var(--app-primary)]"
              >
                My Reservations
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/services")}
                startIcon={<ContentCutOutlinedIcon className="text-[var(--app-primary)]" />}
                className="justify-start rounded-xl py-3.5 px-4 font-bold text-xs uppercase tracking-wider border border-[var(--app-primary)]/20 hover:/10 hover:border-[var(--app-primary)]"
              >
                Reserve Ceremony
              </Button>
            </Box>
          </Box>

          <Divider className="border-[var(--app-primary)]/10" />

          {/* Sign Out */}
          <Button
            fullWidth
            variant="text"
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon />}
            className="rounded-xl py-3 font-bold text-xs uppercase tracking-wider hover:/10"
          >
            Sign Out of Sanctuary Account
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
