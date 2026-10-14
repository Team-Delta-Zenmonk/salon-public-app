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
import styles from "./storefront-hours-about.module.css";

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
    { icon: <WifiIcon className={styles.amenitySvgIcon} />, label: "High-Speed Wi-Fi" },
    { icon: <AcUnitIcon className={styles.amenitySvgIcon} />, label: "Climate Controlled AC" },
    { icon: <LocalParkingIcon className={styles.amenitySvgIcon} />, label: "Client Parking Available" },
    { icon: <LocalCafeIcon className={styles.amenitySvgIcon} />, label: "Complimentary Beverages" },
    { icon: <CreditCardIcon className={styles.amenitySvgIcon} />, label: "Cards & Digital Pay Accepted" },
    { icon: <HealthAndSafetyOutlinedIcon className={styles.amenitySvgIcon} />, label: "Hospital-Grade Sterilization" },
  ];

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.headerRow}>
          <Box className={styles.iconBox}>
            <AccessTimeIcon className={styles.iconLarge} />
          </Box>
          <Box>
            <Typography className={styles.cardTitle}>
              Weekly Operating Schedule
            </Typography>
            <Typography className={styles.cardSubtitle}>
              Regular salon working hours. Last appointment taken 45 minutes prior to close.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.daysList}>
          {DAYS_ORDER.map(({ key, label }) => {
            const isToday = key === currentDayKey;
            const hoursDisplay = formatDayHours(key);
            const isClosed = hoursDisplay.toLowerCase() === "closed";

            return (
              <Box
                key={key}
                className={`${styles.dayRow} ${isToday ? styles.dayRowToday : ""}`}
              >
                <Box className={styles.dayLabelGroup}>
                  <Typography
                    className={`${styles.dayName} ${isToday ? styles.dayNameToday : ""}`}
                  >
                    {label}
                  </Typography>
                  {isToday && (
                    <Chip
                      size="small"
                      label="Today"
                      className={styles.todayChip}
                    />
                  )}
                </Box>

                <Typography
                  className={`${styles.dayHours} ${
                    isClosed
                      ? styles.dayHoursClosed
                      : isToday
                      ? styles.dayHoursToday
                      : ""
                  }`}
                >
                  {hoursDisplay}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box className={styles.gridTwoCol}>
        <Box className={styles.aboutCard}>
          <Box>
            <Typography className={styles.aboutTitle}>
              About {salon?.name}
            </Typography>
            <Typography className={styles.aboutText}>
              {salon?.about ||
                `${salon?.name} is a premier salon destination dedicated to world-class hair artistry, skin rituals, and aesthetic wellness. Our master stylists blend modern technique with personalized care for an unmatched luxury experience.`}
            </Typography>
          </Box>

          {salon?.owner_name && (
            <Box className={styles.ownerRow}>
              <span>Owner & Director</span>
              <span className={styles.ownerName}>{salon.owner_name}</span>
            </Box>
          )}
        </Box>

        <Box className={styles.card}>
          <Typography className={styles.aboutTitle}>
            Venue Amenities
          </Typography>

          <Box className={styles.amenitiesGrid}>
            {amenities.map((item, idx) => (
              <Box
                key={idx}
                className={styles.amenityItem}
              >
                <Box className={styles.amenityIcon}>{item.icon}</Box>
                <Typography className={styles.amenityLabel}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box className={styles.locationCard}>
        <Box className={styles.locationInfo}>
          <Box className={styles.locationIconBox}>
            <LocationOnOutlinedIcon className={styles.iconLarge} />
          </Box>
          <Box>
            <Typography className={styles.cardTitle}>Location & Address</Typography>
            <Typography className={styles.locationAddress}>
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
            className={styles.mapBtn}
          >
            Open in Google Maps
          </Button>
        )}
      </Box>

      <Box className={styles.card}>
        <Box className={styles.policyHeader}>
          <PolicyOutlinedIcon className={styles.policyIcon} />
          <Typography className={styles.cardTitle}>
            Appointment & Booking Policies
          </Typography>
        </Box>

        <Box className={styles.policyList}>
          <Box className={styles.policyItem}>
            <span className={styles.policyBold}>• Payment:</span>
            <span>
              {salon?.payment_policy === "pay_at_venue"
                ? "This salon supports 100% pay at venue. No upfront payment required."
                : salon?.payment_policy === "partial_deposit"
                ? `A ${salon.deposit_percentage || 20}% deposit is collected at checkout to secure your slot. Remaining balance paid at venue.`
                : "Full payment is completed securely online at checkout."}
            </span>
          </Box>
          <Box className={styles.policyItem}>
            <span className={styles.policyBold}>• Cancellation:</span>
            <span>Free cancellation or rescheduling up to 2 hours before your scheduled appointment slot.</span>
          </Box>
          <Box className={styles.policyItem}>
            <span className={styles.policyBold}>• Arrival:</span>
            <span>Please arrive 5-10 minutes early so our specialists can prepare your consultation.</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
