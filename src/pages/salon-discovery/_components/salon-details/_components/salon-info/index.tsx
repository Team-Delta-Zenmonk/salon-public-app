import { Box, Button, Chip, Link, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface SalonInfoProps {
  salon: any;
}

export default function SalonInfo({ salon }: SalonInfoProps) {
  const ratingText = String(salon?.rating ?? "4.8");
  const serviceCount = salon?.services?.length ?? 0;
  const staffCount = salon?.staff?.length ?? 0;

  return (
    <Box className="relative overflow-hidden rounded-3xl border border-(--app-border) shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
      <Box className="relative h-62 sm:h-62.5 lg:h-75 xl:h-80">
        <Box className="h-full w-full bg-linear-to-br from-(--app-hero-from)/88 via-(--app-primary)/82 to-(--app-hero-to)/88" />

        <Box className="absolute inset-0 bg-linear-to-t from-black/45 via-black/12 to-transparent" />
        <Box className="absolute inset-0 bg-radial-[circle_at_22%_28%] from-white/16 to-transparent" />
        <Box className="absolute inset-0 bg-radial-[circle_at_82%_78%] from-black/10 to-transparent" />
        <Box className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_100%)]" />

        <Box className="absolute inset-0 p-3 sm:p-5 lg:p-7 flex items-end lg:items-center justify-between gap-4">
          <Box className="w-full max-w-2xl rounded-2xl border border-white/24 bg-black/14 backdrop-blur-md px-3 sm:px-5 py-3 sm:py-4.5">
            <Box className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Chip icon={<StarRoundedIcon className="text-amber-400" />} label={ratingText} className="bg-white/15 text-white border-white/20 h-8 sm:h-8.5" />
              {salon.type && <Chip label={salon.type} className="hidden sm:inline-flex bg-white/15 text-white border-white/20 capitalize h-8 sm:h-8.5" />}
              <Chip label={`${serviceCount} services`} className="hidden sm:inline-flex bg-white/15 text-white border-white/20" />
              <Chip label={`${staffCount} experts`} className="bg-white/15 text-white border-white/20 h-8 sm:h-8.5" />
            </Box>

            <Typography className="text-white font-extrabold text-[2.15rem] sm:text-3xl lg:text-4xl tracking-[-0.02em] leading-none">
              {salon.name}
            </Typography>

            {salon.address && (
              <Box className="mt-1.5 sm:mt-2 flex items-start gap-1.5 max-w-3xl">
                <LocationOnOutlinedIcon className="text-white/75 mt-0.5 text-[16px] sm:text-[18px]" />
                <Typography className="text-white/85 text-[0.86rem] sm:text-base leading-snug sm:leading-relaxed break-words">
                  {salon.address}
                </Typography>
              </Box>
            )}

            <Box className="mt-3 sm:mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
              {salon.map_link && (
                <Link href={salon.map_link} target="_blank" rel="noreferrer" underline="none">
                  <Button
                    variant="contained"
                    className="rounded-xl px-3 sm:px-4 text-[0.95rem] sm:text-sm w-full sm:w-auto min-h-10"
                    startIcon={<MapOutlinedIcon />}
                  >
                    View on map
                  </Button>
                </Link>
              )}
              <Button className="rounded-xl px-3 sm:px-4 text-[0.95rem] sm:text-sm bg-white/10 text-white border-white/35 w-full sm:w-auto min-h-10" variant="outlined">
                Premium Experience
              </Button>
            </Box>
          </Box>

          <Box className="hidden lg:grid grid-cols-2 gap-2 w-70">
            <Box className="rounded-xl border border-white/22 bg-black/14 backdrop-blur-sm px-3 py-3">
              <Typography className="text-[10px] uppercase tracking-[1.2px] text-white/65">Rating</Typography>
              <Typography className="text-white font-bold text-xl mt-0.5">{ratingText}</Typography>
            </Box>
            <Box className="rounded-xl border border-white/22 bg-black/14 backdrop-blur-sm px-3 py-3">
              <Typography className="text-[10px] uppercase tracking-[1.2px] text-white/65">Experts</Typography>
              <Typography className="text-white font-bold text-xl mt-0.5">{staffCount}</Typography>
            </Box>
            <Box className="rounded-xl border border-white/22 bg-black/14 backdrop-blur-sm px-3 py-3 col-span-2">
              <Typography className="text-[10px] uppercase tracking-[1.2px] text-white/65">Services Available</Typography>
              <Typography className="text-white font-bold text-xl mt-0.5">{serviceCount}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
