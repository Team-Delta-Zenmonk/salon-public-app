import { Box, Typography, Chip, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ImageLightbox from "../../../../components/image-lightbox";

interface SalonGalleryProps {
  photos: any[] | null;
  logo?: string | null;
}

export default function SalonGallery({ photos, logo }: Readonly<SalonGalleryProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let images: { src: string }[] = [];
  if (photos?.length) {
    images = photos.map((p) => ({ src: p.secure_url || p.url }));
  } else if (logo) {
    images = [{ src: logo }];
  }

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const leadImage = images[0];
  const sideImages = images.slice(1, 3);
  const hasMore = images.length > 3;

  const handleImageClick = (idx: number) => {
    setIndex(idx);
    setOpen(true);
  };

  if (!images.length) {
    return (
      <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface-alt) p-8 text-center">
        <Typography className="text-(--app-muted)">No photos available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface) p-3 sm:p-4 shadow-[0_16px_38px_rgba(15,23,42,0.1)]">
        {isMobile ? (
          <Box className="space-y-3.5">
            <Box className="flex items-center justify-between px-1">
              <Typography className="text-(--app-text) font-semibold text-sm">Gallery Preview</Typography>
              <Chip size="small" label={`${images.length} photos`} className="text-xs" />
            </Box>

            <Box
              onClick={() => handleImageClick(0)}
              className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Box
                component="img"
                src={leadImage.src}
                alt="Salon hero"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Box className="absolute inset-0 bg-linear-to-t from-black/58 via-transparent to-transparent" />
              <Box className="absolute left-4 bottom-4">
                <Typography className="text-white font-semibold text-xl">Salon Gallery</Typography>
                <Typography className="text-white/80 text-xs mt-1">Tap to open full gallery</Typography>
              </Box>
            </Box>

            <Box className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.slice(1, 8).map((img, idx) => {
                const imageIndex = idx + 1;
                const remaining = images.length - (imageIndex + 1);
                const isLastVisible = idx === Math.min(images.length - 2, 6);
                const showMoreOverlay = isLastVisible && remaining > 0;

                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className="group relative min-w-44 w-44 h-31 rounded-xl overflow-hidden cursor-pointer snap-start border border-(--app-border)"
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {showMoreOverlay && (
                      <Box className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <VisibilityIcon className="text-white text-lg mb-1" />
                        <Typography className="text-white font-bold text-base">+{remaining}</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-3 sm:gap-4">
            <Box
              onClick={() => handleImageClick(0)}
              className="group relative h-64 sm:h-76 lg:h-95 xl:h-105 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Box
                component="img"
                src={leadImage.src}
                alt="Salon hero"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Box className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
              <Box className="absolute left-4 bottom-4">
                <Typography className="text-white font-semibold text-sm sm:text-base">Salon Gallery</Typography>
              </Box>
            </Box>

            <Box className="grid grid-cols-1 grid-rows-2 gap-3 sm:gap-4 h-64 sm:h-76 lg:h-95 xl:h-105">
              {sideImages.map((img, idx) => {
                const imageIndex = idx + 1;
                const isLastTile = idx === sideImages.length - 1 && hasMore;
                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                      sideImages.length === 1 ? "row-span-2" : ""
                    }`}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isLastTile && (
                      <Box className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center">
                        <Box className="w-11 h-11 rounded-xl bg-white/90 flex items-center justify-center mb-2">
                          <VisibilityIcon className="text-(--app-hero-from)" />
                        </Box>
                        <Typography className="text-white font-bold text-lg">+{images.length - 3}</Typography>
                        <Typography className="text-white text-xs sm:text-sm font-semibold">See all photos</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <ImageLightbox open={open} index={index} images={images} onClose={() => setOpen(false)} />
    </>
  );
}
