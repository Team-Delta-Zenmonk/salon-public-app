import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, IconButton, Tooltip } from "@mui/material";
import { formatAddress, formatCategories, getSalonLogo, salonType } from "../utils/salon.formatter";

interface SalonCardProps {
  salon: any;
  variant: "grid" | "list";
}

export default function SalonCard({ salon, variant }: SalonCardProps) {
  const categoriesText = formatCategories(salon?.categories);
  const addressText = formatAddress(salon?.address);
  const imageUrl = getSalonLogo(salon?.logo);

  const HeartButton = (
    <Tooltip title="Add to favorites" placement="top">
      <span>
        <IconButton>
          <FavoriteBorderIcon sx={{ color: "#ef4444" }} />
        </IconButton>
      </span>
    </Tooltip>
  );

  if (variant === "grid") {
    return (
      <Box className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-sm transition bg-white">
        <Box className="w-full aspect-video bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt={salon?.name || "Salon"} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-slate-100 to-slate-200" />
          )}
        </Box>

        <Box className="p-5">
          <Box className="flex items-start justify-between gap-3">
            <Box className="min-w-0">
              <Box className="font-semibold text-slate-900 truncate text-[15px]">{salon?.name || "—"}</Box>
              <Box className="text-xs text-slate-600 mt-1">{salonType(salon?.type)}</Box>
            </Box>
            {HeartButton}
          </Box>

          <Box className="text-xs text-slate-500 mt-3 truncate">{categoriesText}</Box>

          <Box className="flex items-center gap-1 text-xs text-slate-500 mt-3">
            <PlaceIcon fontSize="inherit" />
            <Box className="truncate">{addressText}</Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="relative border border-slate-200 rounded-2xl bg-white hover:shadow-sm transition p-4">
      <Box className="absolute top-3 right-3">{HeartButton}</Box>

      <Box className="flex gap-4">
        <Box className="w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt={salon?.name || "Salon"} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-slate-100 to-slate-200" />
          )}
        </Box>

        <Box className="flex-1 min-w-0 pr-10">
          <Box className="font-semibold text-slate-900 truncate">{salon?.name || "—"}</Box>
          <Box className="text-xs text-slate-600 mt-1">{salonType(salon?.type)}</Box>

          <Box className="text-xs text-slate-500 mt-2 truncate">{categoriesText}</Box>

          <Box className="flex items-center gap-1 text-xs text-slate-500 mt-2">
            <PlaceIcon fontSize="inherit" />
            <Box className="truncate">{addressText}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
