import { Box, Button, Chip, Link, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface SalonInfoProps {
  salon: any;
}

export default function SalonInfo({ salon }: Readonly<SalonInfoProps>) {
  const ratingText = String(salon?.rating ?? "4.8");
  const serviceCount = salon?.services?.length ?? 0;
  const staffCount = salon?.staff?.length ?? 0;

  return (
    <Box className="relative overflow-hidden rounded-3xl border border-(--app-border) shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
      <Box className="absolute inset-0 bg-linear-to-br from-(--app-hero-from)/88 via-(--app-primary)/82 to-(--app-hero-to)/88" />
      <Box className="absolute inset-0 bg-linear-to-t from-black/45 via-black/12 to-transparent" />
      <Box className="absolute inset-0 bg-radial-[circle_at_22%_28%] from-white/16 to-transparent" />
      <Box className="absolute inset-0 bg-radial-[circle_at_82%_78%] from-black/10 to-transparent" />
      <Box className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_100%)]" />
      <Box className="relative p-3 sm:p-4.5 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Box className="w-full max-w-2xl rounded-2xl border border-white/20 bg-black/15 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3.5">
          <Box className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Chip icon={<StarRoundedIcon className="text-amber-400" />} label={ratingText} className="bg-white/15 text-white border-white/20 h-7 sm:h-7.5 text-xs font-semibold" />
            {salon.type && <Chip label={salon.type} className="hidden sm:inline-flex bg-white/15 text-white border-white/20 capitalize h-7 sm:h-7.5 text-xs font-semibold" />}
            <Chip label={`${serviceCount} services`} className="hidden sm:inline-flex bg-white/15 text-white border-white/20 h-7 sm:h-7.5 text-xs font-semibold" />
            <Chip label={`${staffCount} experts`} className="bg-white/15 text-white border-white/20 h-7 sm:h-7.5 text-xs font-semibold" />
          </Box>
          <Typography className="text-white font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-[-0.02em] leading-tight">
            {salon.name}
          </Typography>
          {salon.address && (
            <Box className="mt-1 sm:mt-1.5 flex items-start gap-1.5 max-w-3xl">
              <LocationOnOutlinedIcon className="text-white/75 mt-0.5 text-[14px] sm:text-[16px]" />
              <Typography className="text-white/85 text-[0.78rem] sm:text-[0.84rem] lg:text-[0.9rem] leading-snug break-words">
                {salon.address}
              </Typography>
            </Box>
          )}
          <Box className="mt-3 sm:mt-3.5 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
            {salon.map_link && (
              <Link href={salon.map_link} target="_blank" rel="noreferrer" underline="none">
                <Button
                  variant="contained"
                  className="rounded-xl px-3 sm:px-3.5 text-[0.85rem] sm:text-xs.5 w-full sm:w-auto min-h-8.5"
                  startIcon={<MapOutlinedIcon />}
                >
                  View on map
                </Button>
              </Link>
            )}
            <Button className="rounded-xl px-3 sm:px-3.5 text-[0.85rem] sm:text-xs.5 bg-white/10 text-white border-white/35 w-full sm:w-auto min-h-8.5 hover:bg-white/20" variant="outlined">
              Premium Experience
            </Button>
          </Box>
        </Box>

        <Box className="hidden lg:grid grid-cols-2 gap-2 w-64 shrink-0">
          <Box className="rounded-xl border border-white/18 bg-black/15 backdrop-blur-xs px-3 py-2">
            <Typography className="text-[9px] uppercase tracking-[1.2px] text-white/70 font-semibold">Rating</Typography>
            <Typography className="text-white font-bold text-base mt-0.5">{ratingText}</Typography>
          </Box>
          <Box className="rounded-xl border border-white/18 bg-black/15 backdrop-blur-xs px-3 py-2">
            <Typography className="text-[9px] uppercase tracking-[1.2px] text-white/70 font-semibold">Experts</Typography>
            <Typography className="text-white font-bold text-base mt-0.5">{staffCount}</Typography>
          </Box>
          <Box className="rounded-xl border border-white/18 bg-black/15 backdrop-blur-xs px-3 py-2 col-span-2">
            <Typography className="text-[9px] uppercase tracking-[1.2px] text-white/70 font-semibold">Services Available</Typography>
            <Typography className="text-white font-bold text-base mt-0.5">{serviceCount}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
