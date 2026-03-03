import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, IconButton, Tooltip } from "@mui/material";
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
      <Box component="span">
        <IconButton disabled onClick={(e) => e.stopPropagation()}>
          <FavoriteBorderIcon className="text-rose-500" />
        </IconButton>
      </Box>
    </Tooltip>
  );

  if (variant === "grid") {
    return (
      <Box
        onClick={goToDetail}
        className="group cursor-pointer border border-(--app-border) rounded-2xl overflow-hidden transition-all duration-300 bg-(--app-surface) hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
      >
        <Box className="w-full aspect-video bg-(--app-surface-alt) overflow-hidden">
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={salon?.name || "Salon"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-(--app-surface-alt) to-(--app-bg)" />
          )}
        </Box>

        <Box className="p-4 sm:p-5">
          <Box className="flex items-start justify-between gap-3">
            <Box className="min-w-0">
              <Box className="font-semibold text-(--app-text) truncate text-[15px]">{salon?.name || "—"}</Box>
              <Box className="text-xs text-(--app-muted) mt-1">{salonType(salon?.type)}</Box>
            </Box>
            {HeartButton}
          </Box>

          <Box className="text-xs text-(--app-muted) mt-3 truncate">{categoriesText}</Box>

          <Box className="flex items-center gap-1 text-xs text-(--app-muted) mt-3">
            <PlaceIcon fontSize="inherit" />
            <Box className="truncate">{addressText}</Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onClick={goToDetail}
      className="group cursor-pointer relative border border-(--app-border) rounded-2xl bg-(--app-surface) hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)] transition-all duration-300 p-3 sm:p-4"
    >
      <Box className="absolute top-3 right-3">{HeartButton}</Box>

      <Box className="flex flex-col sm:flex-row gap-4">
        <Box className="w-full sm:w-28 h-38 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-(--app-surface-alt)">
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={salon?.name || "Salon"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Box className="h-full w-full bg-linear-to-br from-(--app-surface-alt) to-(--app-bg)" />
          )}
        </Box>

        <Box className="flex-1 min-w-0 pr-10 sm:pr-10">
          <Box className="font-semibold text-(--app-text) truncate">{salon?.name || "—"}</Box>
          <Box className="text-xs text-(--app-muted) mt-1">{salonType(salon?.type)}</Box>

          <Box className="text-xs text-(--app-muted) mt-2 truncate">{categoriesText}</Box>

          <Box className="flex items-center gap-1 text-xs text-(--app-muted) mt-2">
            <PlaceIcon fontSize="inherit" />
            <Box className="truncate">{addressText}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
