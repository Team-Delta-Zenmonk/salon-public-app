import { Box, Typography, Button, Divider } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useStorefront } from "../../../providers/storefront-provider";

export default function StorefrontFooter() {
  const { salon } = useStorefront();

  const currentDayIndex = new Date().getDay();
  const currentDayKey = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][currentDayIndex];

  const getTodayHours = () => {
    const raw = salon?.business_hours?.[currentDayKey] ?? salon?.business_hours?.[currentDayKey.slice(0, 3)];
    if (!raw) return "09:00 AM - 08:00 PM";
    if (typeof raw === "string") return raw;
    if (raw.is_closed) return "Closed Today";
    const start = raw.start_time || raw.open || "09:00 AM";
    const end = raw.end_time || raw.close || "08:00 PM";
    return `${start} - ${end}`;
  };

  const paymentPolicies = salon?.allowed_payment_policies || ["pay_at_venue"];
  const formatPolicy = (p: string) => {
    if (p === "pay_at_venue") return "Pay at Venue";
    if (p === "pay_in_advance") return "Online Payment";
    if (p === "deposit") return `${salon?.deposit_percentage || 20}% Deposit`;
    return p.replace(/_/g, " ");
  };

  return (
    <Box component="footer" className="border-t border-(--app-border) bg-(--app-surface) mt-auto pb-36 md:mb-0">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Narrative */}
          <Box className="space-y-3">
            <Box className="flex items-center gap-2">
              <Typography className="font-extrabold text-base sm:text-lg text-(--app-text)">
                {salon?.name}
              </Typography>
              <VerifiedOutlinedIcon className="text-emerald-500 text-[18px]" />
            </Box>
            {salon?.about && (
              <Typography className="text-xs text-(--app-muted) leading-relaxed line-clamp-3">
                {salon.about}
              </Typography>
            )}
            <Typography className="text-[11px] text-(--app-muted) capitalize">
              {salon?.type || "Unisex Salon"} • Certified Salon Partner
            </Typography>
          </Box>

          {/* Operating Hours & Payment */}
          <Box className="space-y-3">
            <Typography className="font-bold text-xs uppercase tracking-wider text-(--app-text)">
              Working Hours & Policies
            </Typography>
            <Box className="flex items-center gap-2 text-xs text-(--app-muted)">
              <AccessTimeOutlinedIcon className="text-[16px] text-(--app-primary)" />
              <span>Today: {getTodayHours()}</span>
            </Box>
            <Box className="flex items-center gap-2 text-xs text-(--app-muted)">
              <CreditCardOutlinedIcon className="text-[16px] text-(--app-primary)" />
              <span>Accepted: {paymentPolicies.map(formatPolicy).join(", ")}</span>
            </Box>
          </Box>

          {/* Address & Navigation */}
          <Box className="space-y-3">
            <Typography className="font-bold text-xs uppercase tracking-wider text-(--app-text)">
              Location & Contact
            </Typography>
            {salon?.address && (
              <Box className="flex items-start gap-2 text-xs text-(--app-muted)">
                <LocationOnOutlinedIcon className="text-[16px] text-(--app-primary) shrink-0 mt-0.5" />
                <span>{salon.address}</span>
              </Box>
            )}
            {salon?.map_link && (
              <Button
                component="a"
                href={salon.map_link}
                target="_blank"
                rel="noreferrer"
                size="small"
                variant="outlined"
                startIcon={<MapOutlinedIcon className="text-[14px]" />}
                className="rounded-xl text-xs font-semibold normal-case border-(--app-border) text-(--app-text) hover:bg-(--app-surface-alt)"
              >
                Open in Google Maps
              </Button>
            )}
          </Box>
        </Box>

        <Divider className="border-(--app-border)" />

        <Box className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--app-muted)">
          <Typography className="text-[11px]">
            © {new Date().getFullYear()} {salon?.name}. All rights reserved.
          </Typography>
          <Typography className="text-[11px] text-(--app-muted)">
            Powered by ZenMonk Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
