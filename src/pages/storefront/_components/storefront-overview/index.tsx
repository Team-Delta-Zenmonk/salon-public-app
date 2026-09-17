import { Box, Typography, Button, Chip } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Avatar } from "@mui/material";
import StorefrontGallery from "../storefront-gallery";
import ServiceCard from "../storefront-services/_components/service-card";
import type { StorefrontTab } from "../storefront-header";

interface StorefrontOverviewProps {
  salon: any;
  onNavigateTab: (tab: StorefrontTab) => void;
}

export default function StorefrontOverview({
  salon,
  onNavigateTab,
}: Readonly<StorefrontOverviewProps>) {
  const ratingText = String(salon?.rating ?? "4.9");
  const services: any[] = salon?.services || [];
  const staff: any[] = salon?.staff || [];

  const rootServices = services.filter((s: any) => s.parent_id === null);
  const subServicesMap = services.reduce<Record<number, any[]>>((acc, s: any) => {
    if (s.parent_id) {
      acc[s.parent_id] = acc[s.parent_id] || [];
      acc[s.parent_id].push(s);
    }
    return acc;
  }, {});

  const popularServices = rootServices.slice(0, 4);

  return (
    <Box className="space-y-6 sm:space-y-8 pb-12">
      <Box className="relative overflow-hidden rounded-3xl border border-(--app-border) shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
        <Box className="absolute inset-0 bg-linear-to-br from-(--app-hero-from)/90 via-(--app-primary)/85 to-(--app-hero-to)/90" />
        <Box className="absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-transparent" />
        <Box className="absolute inset-0 bg-radial-[circle_at_20%_30%] from-white/15 to-transparent" />

        <Box className="relative p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <Box className="max-w-2xl text-white">
            <Box className="flex flex-wrap items-center gap-2 mb-3">
              <Chip
                icon={<StarRoundedIcon className="text-amber-400 !text-[15px]" />}
                label={`${ratingText} Rating`}
                className="bg-white/20 text-white border-white/25 h-7 text-xs font-bold backdrop-blur-md"
              />
              <Chip
                label={salon?.type || "Luxury Unisex Salon"}
                className="bg-white/20 text-white border-white/25 h-7 text-xs font-bold capitalize backdrop-blur-md"
              />
              <Chip
                icon={<VerifiedOutlinedIcon className="text-emerald-300 !text-[15px]" />}
                label="Verified Venue"
                className="bg-white/20 text-white border-white/25 h-7 text-xs font-bold backdrop-blur-md"
              />
            </Box>

            <Typography className="text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              {salon?.name}
            </Typography>

            {salon?.about && (
              <Typography className="text-white/85 text-xs sm:text-sm mt-3 line-clamp-2 leading-relaxed max-w-xl">
                {salon.about}
              </Typography>
            )}

            {salon?.address && (
              <Box className="mt-3 flex items-start gap-1.5 text-white/90">
                <LocationOnOutlinedIcon className="text-white/70 text-[18px] shrink-0 mt-0.5" />
                <Typography className="text-xs sm:text-sm leading-snug break-words">
                  {salon.address}
                </Typography>
              </Box>
            )}

            <Box className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="contained"
                size="large"
                onClick={() => onNavigateTab("services")}
                endIcon={<ArrowForwardIcon className="text-[16px]" />}
                className="rounded-2xl px-6 py-3 font-bold text-xs sm:text-sm bg-white text-gray-900 hover:bg-white/90 shadow-xl"
              >
                Explore Services & Book
              </Button>

              {salon?.map_link && (
                <Button
                  component="a"
                  href={salon.map_link}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<MapOutlinedIcon />}
                  className="rounded-2xl px-5 py-3 font-bold text-xs sm:text-sm border-white/40 text-white hover:bg-white/10"
                >
                  Get Directions
                </Button>
              )}
            </Box>
          </Box>

          <Box className="grid grid-cols-2 gap-2.5 w-full lg:w-72 shrink-0">
            <Box className="p-3.5 rounded-2xl bg-black/25 border border-white/20 backdrop-blur-md text-white">
              <Typography className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                Treatments
              </Typography>
              <Typography className="text-2xl font-black mt-1">{services.length}+</Typography>
            </Box>

            <Box className="p-3.5 rounded-2xl bg-black/25 border border-white/20 backdrop-blur-md text-white">
              <Typography className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                Specialists
              </Typography>
              <Typography className="text-2xl font-black mt-1">{staff.length}</Typography>
            </Box>

            <Box className="col-span-2 p-3.5 rounded-2xl bg-black/25 border border-white/20 backdrop-blur-md text-white">
              <Typography className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                Payment Policy
              </Typography>
              <Typography className="text-xs font-bold mt-1 leading-snug">
                {salon?.payment_policy === "pay_at_venue"
                  ? "Pay at venue after service"
                  : salon?.payment_policy === "partial_deposit"
                  ? `${salon.deposit_percentage || 20}% deposit required`
                  : "Online payment required"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <StorefrontGallery photos={salon?.photos} logo={salon?.logo} />

      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-4 sm:p-6 lg:p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <Box className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-(--app-border)">
          <Box>
            <Box className="flex items-center gap-2">
              <SparklesIcon className="text-(--app-primary) text-[20px]" />
              <Typography className="text-lg sm:text-xl font-black text-(--app-text)">
                Popular Treatments
              </Typography>
            </Box>
            <Typography className="text-xs text-(--app-muted) mt-1">
              Top requested haircuts, coloring, styling, and wellness rituals.
            </Typography>
          </Box>

          <Button
            variant="text"
            onClick={() => onNavigateTab("services")}
            endIcon={<ArrowForwardIcon className="text-[14px]" />}
            className="text-xs font-bold text-(--app-primary) hover:bg-(--app-primary-soft) rounded-xl px-3 py-1.5 self-start sm:self-auto -ml-2 sm:ml-0"
          >
            View All ({services.length}) Services
          </Button>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularServices.map((service: any) => (
            <ServiceCard
              key={service.uuid}
              service={service}
              subServices={subServicesMap[service.id] || []}
              salon={salon}
            />
          ))}
        </Box>
      </Box>

      {staff.length > 0 && (
        <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-4 sm:p-6 lg:p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <Box className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-(--app-border)">
            <Box>
              <Typography className="text-lg sm:text-xl font-black text-(--app-text)">
                Meet Our Specialists
              </Typography>
              <Typography className="text-xs text-(--app-muted) mt-0.5">
                Experienced artisans passionate about hair, skin, and grooming.
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => onNavigateTab("specialists")}
              className="text-xs font-bold text-(--app-primary) hover:bg-(--app-primary-soft) rounded-xl px-3 py-1"
            >
              See All Team ➔
            </Button>
          </Box>

          <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {staff.slice(0, 5).map((member: any) => {
              const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Specialist";
              const photo = member.photos?.secure_url || member.photos?.url;
              const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;

              return (
                <Box
                  key={member.uuid}
                  onClick={() => onNavigateTab("specialists")}
                  className="p-3.5 rounded-2xl border border-(--app-border) bg-(--app-surface-alt) hover:border-(--app-primary)/40 transition-all duration-200 text-center cursor-pointer group"
                >
                  <Avatar
                    src={photo}
                    alt={fullName}
                    className="w-14 h-14 mx-auto ring-2 ring-(--app-border) group-hover:scale-105 transition-transform"
                  >
                    {initials || "S"}
                  </Avatar>
                  <Typography className="font-bold text-xs text-(--app-text) truncate mt-2">
                    {fullName}
                  </Typography>
                  <Typography className="text-[10px] text-(--app-muted) truncate mt-0.5">
                    {member.title || member.role || "Stylist"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <Box className="flex items-start gap-3.5 min-w-0">
          <Box className="w-11 h-11 rounded-2xl bg-(--app-primary-soft) text-(--app-primary) flex items-center justify-center shrink-0">
            <AccessTimeIcon className="text-[22px]" />
          </Box>
          <Box>
            <Typography className="font-bold text-sm sm:text-base text-(--app-text)">
              Operating Schedule & Policies
            </Typography>
            <Typography className="text-xs text-(--app-muted) mt-0.5">
              Check complete weekly hours, location directions, and booking terms.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={() => onNavigateTab("hours")}
          className="rounded-xl px-4 py-2 font-bold text-xs text-(--app-text) border-(--app-border) hover:bg-(--app-surface-alt) shrink-0"
        >
          View Full Schedule & Location
        </Button>
      </Box>
    </Box>
  );
}
