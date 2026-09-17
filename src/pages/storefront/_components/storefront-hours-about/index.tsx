import { Box, Typography, Button, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";

interface StorefrontHoursAboutProps {
  salon: any;
}

const DAYS_ORDER = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function StorefrontHoursAbout({ salon }: Readonly<StorefrontHoursAboutProps>) {
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

  const formatDayHours = (dayKey: string) => {
    const raw = salon?.business_hours?.[dayKey] ?? salon?.business_hours?.[dayKey.slice(0, 3)];
    if (!raw) return "09:00 AM - 08:00 PM";

    if (typeof raw === "string") {
      if (raw.toLowerCase() === "closed") return "Closed";
      return raw.replace("-", " - ");
    }

    if (raw.is_closed) return "Closed";

    const start = raw.start_time || raw.open || "09:00";
    const end = raw.end_time || raw.close || "20:00";
    return `${start} - ${end}`;
  };

  const amenities = [
    { icon: <WifiIcon className="text-[18px]" />, label: "High-Speed Wi-Fi" },
    { icon: <AcUnitIcon className="text-[18px]" />, label: "Climate Controlled AC" },
    { icon: <LocalParkingIcon className="text-[18px]" />, label: "Client Parking Available" },
    { icon: <LocalCafeIcon className="text-[18px]" />, label: "Complimentary Beverages" },
    { icon: <CreditCardIcon className="text-[18px]" />, label: "Cards & Digital Pay Accepted" },
    { icon: <HealthAndSafetyOutlinedIcon className="text-[18px]" />, label: "Hospital-Grade Sterilization" },
  ];

  return (
    <Box className="space-y-6 sm:space-y-8 pb-16">
      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <Box className="flex items-center gap-3 mb-5 pb-4 border-b border-(--app-border)">
          <Box className="w-10 h-10 rounded-2xl bg-(--app-primary-soft) text-(--app-primary) flex items-center justify-center">
            <AccessTimeIcon className="text-[22px]" />
          </Box>
          <Box>
            <Typography className="font-extrabold text-base sm:text-lg text-(--app-text)">
              Weekly Operating Schedule
            </Typography>
            <Typography className="text-xs text-(--app-muted)">
              Regular salon working hours. Last appointment taken 45 minutes prior to close.
            </Typography>
          </Box>
        </Box>

        <Box className="divide-y divide-(--app-border)/60">
          {DAYS_ORDER.map(({ key, label }) => {
            const isToday = key === currentDayKey;
            const hoursDisplay = formatDayHours(key);
            const isClosed = hoursDisplay.toLowerCase() === "closed";

            return (
              <Box
                key={key}
                className={`py-3.5 px-3 sm:px-4 rounded-xl flex items-center justify-between transition-colors ${
                  isToday ? "bg-(--app-primary-soft)/60 border border-(--app-primary)/30" : "hover:bg-(--app-surface-alt)/40"
                }`}
              >
                <Box className="flex items-center gap-2.5">
                  <Typography
                    className={`text-xs sm:text-sm font-bold ${
                      isToday ? "text-(--app-primary)" : "text-(--app-text)"
                    }`}
                  >
                    {label}
                  </Typography>
                  {isToday && (
                    <Chip
                      size="small"
                      label="Today"
                      className="bg-(--app-primary) text-(--app-primary-contrast) font-black text-[9px] h-5 px-1 uppercase tracking-wider"
                    />
                  )}
                </Box>

                <Typography
                  className={`text-xs sm:text-sm font-semibold ${
                    isClosed
                      ? "text-red-500 font-bold"
                      : isToday
                      ? "text-(--app-primary) font-bold"
                      : "text-(--app-muted)"
                  }`}
                >
                  {hoursDisplay}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <Box>
            <Typography className="font-extrabold text-base sm:text-lg text-(--app-text) mb-2">
              About {salon?.name}
            </Typography>
            <Typography className="text-xs sm:text-sm text-(--app-muted) leading-relaxed">
              {salon?.about ||
                `${salon?.name} is a premier salon destination dedicated to world-class hair artistry, skin rituals, and aesthetic wellness. Our master stylists blend modern technique with personalized care for an unmatched luxury experience.`}
            </Typography>
          </Box>

          {salon?.owner_name && (
            <Box className="mt-6 pt-4 border-t border-(--app-border) flex items-center justify-between text-xs text-(--app-muted)">
              <span>Owner & Director</span>
              <span className="font-bold text-(--app-text)">{salon.owner_name}</span>
            </Box>
          )}
        </Box>

        <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <Typography className="font-extrabold text-base sm:text-lg text-(--app-text) mb-4">
            Venue Amenities
          </Typography>

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenities.map((item, idx) => (
              <Box
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-(--app-surface-alt) border border-(--app-border) text-(--app-text)"
              >
                <Box className="text-(--app-primary) shrink-0">{item.icon}</Box>
                <Typography className="text-xs font-semibold">{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Box className="flex items-start gap-3.5 max-w-2xl">
          <Box className="w-10 h-10 rounded-2xl bg-(--app-primary-soft) text-(--app-primary) flex items-center justify-center shrink-0 mt-0.5">
            <LocationOnOutlinedIcon className="text-[22px]" />
          </Box>
          <Box>
            <Typography className="font-extrabold text-base text-(--app-text)">Location & Address</Typography>
            <Typography className="text-xs text-(--app-muted) mt-1 leading-snug break-words">
              {salon?.address || "Address available upon booking"}
            </Typography>
          </Box>
        </Box>

        {salon?.map_link && (
          <Button
            component="a"
            href={salon.map_link}
            target="_blank"
            rel="noreferrer"
            variant="contained"
            startIcon={<MapOutlinedIcon />}
            className="rounded-2xl px-5 py-2.5 text-xs font-bold bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110 shrink-0"
          >
            Open in Google Maps
          </Button>
        )}
      </Box>

      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <Box className="flex items-center gap-2.5 mb-3">
          <PolicyOutlinedIcon className="text-(--app-primary) text-[22px]" />
          <Typography className="font-extrabold text-base text-(--app-text)">
            Appointment & Booking Policies
          </Typography>
        </Box>

        <Box className="space-y-2.5 text-xs text-(--app-muted) leading-relaxed">
          <Box className="flex items-start gap-2">
            <span className="font-bold text-(--app-text)">• Payment:</span>
            <span>
              {salon?.payment_policy === "pay_at_venue"
                ? "This salon supports 100% pay at venue. No upfront payment required."
                : salon?.payment_policy === "partial_deposit"
                ? `A ${salon.deposit_percentage || 20}% deposit is collected at checkout to secure your slot. Remaining balance paid at venue.`
                : "Full payment is completed securely online at checkout."}
            </span>
          </Box>
          <Box className="flex items-start gap-2">
            <span className="font-bold text-(--app-text)">• Cancellation:</span>
            <span>Free cancellation or rescheduling up to 2 hours before your scheduled appointment slot.</span>
          </Box>
          <Box className="flex items-start gap-2">
            <span className="font-bold text-(--app-text)">• Arrival:</span>
            <span>Please arrive 5-10 minutes early so our specialists can prepare your consultation.</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
