import { Box, Typography, Chip, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ImageLightbox from "../../../../components/image-lightbox";
import { getOptimizedImageUrl, MEDIA_PRESETS } from "../../../../common/media.utils";
import styles from "./storefront-gallery.module.css";

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

  const rawLead = images[0];
  const rawSide = images.slice(1, 3);
  const hasMore = images.length > 3;

  const leadImageSrc = rawLead?.src
    ? getOptimizedImageUrl(rawLead.src, MEDIA_PRESETS.SALON_GALLERY_LEAD)
    : "";

  const lightboxImages = images.map((img) => ({
    src: getOptimizedImageUrl(img.src, { width: 1920, quality: "auto" }),
  }));

  const handleImageClick = (idx: number) => {
    setIndex(idx);
    setOpen(true);
  };

  if (!images.length) {
    return (
      <Box className={styles.emptyCard}>
        <Typography className={styles.emptyText}>No photos available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box className={styles.galleryCard}>
        {isMobile ? (
          <Box className={styles.mobileContainer}>
            <Box className={styles.mobileHeader}>
              <Typography className={styles.mobileTitle}>Gallery Preview</Typography>
              <Chip size="small" label={`${images.length} photos`} className={styles.mobileChip} />
            </Box>

            <Box
              onClick={() => handleImageClick(0)}
              className={styles.mobileLeadBox}
            >
              <Box
                component="img"
                src={leadImageSrc}
                alt="Salon hero"
                className={styles.leadImg}
              />
              <Box className={styles.gradientOverlay} />
              <Box className={styles.mobileLeadText}>
                <Typography className={styles.leadHeading}>Salon Gallery</Typography>
                <Typography className={styles.leadSubheading}>Tap to open full gallery</Typography>
              </Box>
            </Box>

            <Box className={styles.mobileStrip}>
              {images.slice(1, 8).map((img, idx) => {
                const imageIndex = idx + 1;
                const remaining = images.length - (imageIndex + 1);
                const isLastVisible = idx === Math.min(images.length - 2, 6);
                const showMoreOverlay = isLastVisible && remaining > 0;
                const thumbUrl = getOptimizedImageUrl(img.src, MEDIA_PRESETS.SALON_GALLERY_THUMB);

                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className={styles.mobileThumbnail}
                  >
                    <Box
                      component="img"
                      src={thumbUrl}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className={styles.leadImg}
                    />

                    {showMoreOverlay && (
                      <Box className={styles.thumbnailOverlay}>
                        <VisibilityIcon className={styles.thumbnailOverlayIcon} />
                        <Typography className={styles.thumbnailOverlayText}>+{remaining}</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box className={styles.desktopGrid}>
            <Box
              onClick={() => handleImageClick(0)}
              className={styles.desktopLeadBox}
            >
              <Box
                component="img"
                src={leadImageSrc}
                alt="Salon hero"
                className={styles.leadImg}
              />
              <Box className={styles.desktopGradientOverlay} />
              <Box className={styles.mobileLeadText}>
                <Typography className={styles.galleryBadgeText}>Salon Gallery</Typography>
              </Box>
            </Box>

            <Box className={styles.desktopSideGrid}>
              {rawSide.map((img, idx) => {
                const imageIndex = idx + 1;
                const isLastTile = idx === rawSide.length - 1 && hasMore;
                const thumbUrl = getOptimizedImageUrl(img.src, MEDIA_PRESETS.SALON_GALLERY_THUMB);

                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className={`${styles.sideTile} ${
                      rawSide.length === 1 ? styles.sideTileSpan2 : ""
                    }`}
                  >
                    <Box
                      component="img"
                      src={thumbUrl}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className={styles.leadImg}
                    />
                    {isLastTile && (
                      <Box className={styles.seeAllOverlay}>
                        <Box className={styles.iconBox}>
                          <VisibilityIcon className={styles.seeAllIcon} />
                        </Box>
                        <Typography className={styles.seeAllCount}>+{images.length - 3}</Typography>
                        <Typography className={styles.seeAllText}>See all photos</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <ImageLightbox open={open} index={index} images={lightboxImages} onClose={() => setOpen(false)} />
    </>
  );
}
