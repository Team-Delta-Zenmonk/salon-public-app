import { Box, Typography, Button } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useStorefront } from "../../providers/storefront-provider";

export default function AboutPage() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "CRIMSON & SHEAR";

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <Box className="space-y-12 pb-24 text-[var(--app-text)]">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 md:px-12 bg-gradient-to-b from-[var(--app-bg)] via-[var(--app-bg)] to-[var(--app-bg)] border-b border-[var(--app-border)]/20 rounded-3xl">
        <Box className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Box className="space-y-3">
            <Box className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--app-primary-soft)] border border-[var(--app-primary)]/40 text-[var(--app-primary)] text-[10px] font-bold uppercase tracking-widest">
                <AutoAwesomeOutlinedIcon className="text-[14px]" />
                FLAGSHIP SANCTUARY & CHARTER
              </span>
            </Box>
            <Typography className="font-editorial text-3xl sm:text-6xl font-bold text-[var(--app-text)] tracking-tight">
              About <span className="italic font-normal text-[var(--app-primary)]">{salonName}</span>
            </Typography>
            <Typography className="text-xs sm:text-base text-[var(--app-muted)] max-w-2xl leading-relaxed">
              {salon?.about ||
                "An intimate, sanctuary-level atelier where master scissorsmiths and clinical facialists transform the sensory ritual of luxury grooming into contemporary art."}
            </Typography>
          </Box>
        </Box>
      </section>

      {/* Main About & Location Content */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sanctuary Philosophy & Etiquette Charter */}
        <Box className="lg:col-span-7 space-y-8">
          <Box className="p-6 sm:p-8 rounded-3xl bg-[var(--app-surface-alt)] panel-rim space-y-4 shadow-xl">
            <Typography className="font-editorial text-2xl font-bold text-[var(--app-text)]">
              The {salonName} Philosophy
            </Typography>
            <Typography className="text-xs sm:text-sm text-[var(--app-muted)] leading-relaxed">
              Founded on the principles of quiet luxury and high-fashion precision, {salonName} operates as a sanctuary for hair sculpture, scalp restoration, and dermal vitality. Every service begins with a private consultation under polarized light to analyze strand porosity and cranial symmetry before formulate selection.
            </Typography>
          </Box>

          <Box className="p-6 sm:p-8 rounded-3xl bg-[var(--app-surface-alt)] panel-rim space-y-4 shadow-xl">
            <Box className="flex items-center gap-2 text-[var(--app-primary)]">
              <ShieldOutlinedIcon className="text-[22px]" />
              <Typography className="font-editorial text-xl font-bold text-[var(--app-text)]">
                Etiquette Charter & VIP Protocol
              </Typography>
            </Box>
            <Typography className="text-xs sm:text-sm text-[var(--app-muted)] leading-relaxed">
              To preserve a serene, restorative atmosphere for all guests, mobile devices must remain on silent mode within private treatment suites. We request a 24-hour advance notification for schedule adjustments or private VIP suite reservations.
            </Typography>
          </Box>
        </Box>

        {/* Right Column: Location, Concierge & Working Hours */}
        <Box className="lg:col-span-5 space-y-6">
          {/* Working Hours Card */}
          <Box className="p-6 sm:p-8 rounded-3xl bg-[var(--app-surface-alt)] panel-rim space-y-4 shadow-xl">
            <Box className="flex items-center gap-2 text-[var(--app-primary)]">
              <AccessTimeOutlinedIcon className="text-[22px]" />
              <Typography className="font-editorial text-xl font-bold text-[var(--app-text)]">
                Hours of Ceremony
              </Typography>
            </Box>
            <Box className="space-y-2 pt-2">
              {daysOfWeek.map((day) => {
                const raw = salon?.business_hours?.[day] ?? salon?.business_hours?.[day.slice(0, 3)];
                let hoursStr = "10:00 AM - 8:30 PM";
                if (raw) {
                  if (typeof raw === "string") hoursStr = raw;
                  else if (raw.is_closed) hoursStr = "Closed";
                  else hoursStr = `${raw.start_time || raw.open || "10:00 AM"} - ${raw.end_time || raw.close || "8:30 PM"}`;
                }

                return (
                  <Box
                    key={day}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--app-surface-alt)] text-xs font-semibold"
                  >
                    <span className="capitalize text-[var(--app-text)]">{day}</span>
                    <span className="text-[var(--app-primary)]">{hoursStr}</span>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Location Card */}
          <Box className="p-6 sm:p-8 rounded-3xl bg-[var(--app-surface-alt)] panel-rim space-y-4 shadow-xl">
            <Box className="flex items-center gap-2 text-[var(--app-primary)]">
              <LocationOnOutlinedIcon className="text-[22px]" />
              <Typography className="font-editorial text-xl font-bold text-[var(--app-text)]">
                Sanctuary Address
              </Typography>
            </Box>
            <Typography className="text-xs sm:text-sm text-[var(--app-text)] font-semibold leading-relaxed">
              {salon?.address || "484 Avenue Montaigne, Flagship Studio"}
            </Typography>
            {salon?.phone && (
              <Box className="flex items-center gap-2 text-xs text-[var(--app-muted)]">
                <PhoneOutlinedIcon className="text-[16px] text-[var(--app-primary)]" />
                <span>Concierge: {salon.phone}</span>
              </Box>
            )}
            {salon?.map_link && (
              <Button
                component="a"
                href={salon.map_link}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                startIcon={<NorthEastIcon className="text-[14px]" />}
                className="mt-2 rounded-lg px-5 py-2.5 text-xs font-bold normal-case shadow-md border-0"
              >
                Open in Google Maps
              </Button>
            )}
          </Box>
        </Box>
      </main>
    </Box>
  );
}
