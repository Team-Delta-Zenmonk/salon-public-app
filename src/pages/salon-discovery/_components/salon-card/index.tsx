import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatAddress, formatCategories, getSalonLogo, salonType } from "../utils/salon.formatter";

interface SalonCardProps {
  salon: any;
  variant: "grid" | "list";
}

export default function SalonCard({ salon, variant }: SalonCardProps) {
  const navigate = useNavigate();

  const categoriesText = formatCategories(salon?.categories);
  const addressText = formatAddress(salon?.address);
  const imageUrl = getSalonLogo(salon?.logo);

  const goToDetail = () => {
    if (!salon?.uuid) return;
    navigate(`/salons/${salon.uuid}`);
  };

  const HeartButton = (
    <Tooltip title="Login to save favourites">
      <Box className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-xs rounded-full shadow-xs">
        <IconButton disabled onClick={(e) => e.stopPropagation()} size="small" className="p-0.5">
          <FavoriteBorderIcon fontSize="small" className="text-rose-500" />
        </IconButton>
      </Box>
    </Tooltip>
  );

  if (variant === "grid") {
    return (
      <Box
        onClick={goToDetail}
        className="group cursor-pointer border border-(--app-border) rounded-2xl overflow-hidden transition-all duration-300 bg-(--app-surface) hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] flex flex-col justify-between"
      >
        <Box className="w-full aspect-[16/9] bg-(--app-surface-alt) overflow-hidden relative">
          {HeartButton}
          
          <Box className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-full flex items-center gap-0.5 text-white text-[10px] sm:text-xs font-bold border border-white/10 shadow-sm">
            <StarRoundedIcon className="text-amber-400 text-[14px]" />
            <Typography component="span">{Number(salon?.rating ?? 4.8).toFixed(1)}</Typography>
          </Box>

          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={salon?.name || "Salon"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-(--app-surface-alt) to-(--app-bg)" />
          )}
        </Box>

        <Box className="p-3 sm:p-4">
          <Box className="min-w-0">
            <Box className="font-bold text-(--app-text) truncate text-sm sm:text-base leading-tight">{salon?.name || "—"}</Box>
            <Box className="text-[11px] sm:text-xs text-(--app-muted) mt-0.5 font-medium">{salonType(salon?.type)}</Box>
          </Box>

          <Box className="flex items-center gap-1 text-[11px] sm:text-xs text-(--app-muted) mt-2">
            <PlaceIcon className="text-[14px] text-(--app-primary) shrink-0" />
            <Box className="truncate">{addressText}</Box>
          </Box>

          <Box className="mt-3 pt-2.5 border-t border-(--app-border)/40 flex items-center justify-between gap-2">
            <Box className="text-[10px] sm:text-xs text-(--app-muted) truncate flex-1">{categoriesText}</Box>
            <Box className="text-[10px] sm:text-xs font-bold text-(--app-primary) flex items-center shrink-0">
              Book <ArrowForwardIcon className="text-[10px] sm:text-[12px] ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onClick={goToDetail}
      className="group cursor-pointer relative border border-(--app-border) rounded-2xl bg-(--app-surface) hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 p-3 sm:p-4"
    >
      <Box className="flex flex-row gap-3.5">
        <Box className="w-24 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-(--app-surface-alt) relative">
          {HeartButton}
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={salon?.name || "Salon"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-(--app-surface-alt) to-(--app-bg)" />
          )}
        </Box>

        <Box className="flex-1 min-w-0 flex flex-col justify-between">
          <Box className="min-w-0">
            <Box className="flex items-start justify-between gap-2">
              <Box className="font-bold text-(--app-text) truncate text-sm sm:text-lg leading-tight pr-2">{salon?.name || "—"}</Box>
              <Box className="flex items-center gap-1 text-xs font-bold text-(--app-text) shrink-0 bg-(--app-primary-soft) px-2 py-0.5 rounded-full">
                <StarRoundedIcon className="text-amber-500 text-[14px]" />
                <Typography component="span">{Number(salon?.rating ?? 4.8).toFixed(1)}</Typography>
              </Box>
            </Box>
            <Box className="text-[11px] sm:text-xs text-(--app-muted) mt-0.5 font-medium">{salonType(salon?.type)}</Box>
            <Box className="text-[11px] sm:text-xs text-(--app-muted) mt-1.5 truncate">{categoriesText}</Box>
          </Box>

          <Box className="mt-2 flex items-center justify-between border-t border-(--app-border)/40 pt-2.5 sm:pt-0 sm:border-t-0">
            <Box className="flex items-center gap-1 text-[11px] sm:text-xs text-(--app-muted) min-w-0">
              <PlaceIcon className="text-[14px] text-(--app-primary) shrink-0" />
              <Box className="truncate">{addressText}</Box>
            </Box>
            
            <Box className="text-[11px] sm:text-xs font-bold text-(--app-primary) flex items-center shrink-0 ml-2">
              Book Now <ArrowForwardIcon className="text-[11px] sm:text-[13px] ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
