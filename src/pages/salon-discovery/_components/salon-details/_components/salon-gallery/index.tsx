import { Box, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import ImageLightbox from "../../../../../../components/image-lightbox";

interface SalonGalleryProps {
  photos: any[] | null;
  logo?: string | null;
}

export default function SalonGallery({ photos, logo }: SalonGalleryProps) {
  const images = photos?.length ? photos.map((p) => ({ src: p.secure_url || p.url })) : logo ? [{ src: logo }] : [];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const previewImages = images.slice(0, 4);
  const hasMore = images.length > 4;

  const handleImageClick = (idx: number) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <>
      <Box className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {previewImages.map((img, idx) => {
          const isLastImage = idx === previewImages.length - 1 && hasMore;

          return (
            <Box
              key={idx}
              className="relative group aspect-square md:aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleImageClick(idx)}
            >
              <img
                src={img.src}
                alt={`Salon photo ${idx + 1}`}
                className={`h-full w-full object-cover transition-all ${
                  isLastImage ? "group-hover:brightness-50" : "group-hover:brightness-90"
                }`}
                loading={idx < 2 ? "eager" : "lazy"}
              />

              {isLastImage && (
                <Box className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex flex-col items-center justify-center p-4">
                  <Box className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-xl group-hover:scale-110 transition-all">
                    <VisibilityIcon className="text-slate-800 text-xl md:text-2xl" />
                  </Box>
                  <Typography variant="h5" className="text-white!" fontWeight="fontWeightMedium">
                    +{images.length - 4}
                  </Typography>
                  <Typography variant="body2" className="text-white!" fontWeight="fontWeightMedium">
                    See all images
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}

        {!images.length && (
          <Box className="col-span-full md:col-span-4 h-64 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-md">
            <Typography variant="h6" className="text-slate-400">
              No photos available
            </Typography>
          </Box>
        )}
      </Box>

      <ImageLightbox open={open} index={index} images={images} onClose={() => setOpen(false)} />
    </>
  );
}
