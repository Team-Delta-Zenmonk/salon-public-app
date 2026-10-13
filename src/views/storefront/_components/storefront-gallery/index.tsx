import { Box, Typography, Chip, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ImageLightbox from "../../../../components/image-lightbox";
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

  const leadImage = images[0];
  const sideImages = images.slice(1, 3);
  const hasMore = images.length > 3;

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
                src={leadImage.src}
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

                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className={styles.mobileThumbnail}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className={styles.leadImg}
                    />

                    {showMoreOverlay && (
                      <Box className={styles.thumbnailOverlay}>
                        <VisibilityIcon sx={{ color: "white", fontSize: "1.125rem", mb: 0.5 }} />
                        <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>+{remaining}</Typography>
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
                src={leadImage.src}
                alt="Salon hero"
                className={styles.leadImg}
              />
              <Box className={styles.desktopGradientOverlay} />
              <Box className={styles.mobileLeadText}>
                <Typography sx={{ color: "white", fontWeight: 600, fontSize: { xs: "0.875rem", sm: "1rem" } }}>Salon Gallery</Typography>
              </Box>
            </Box>

            <Box className={styles.desktopSideGrid}>
              {sideImages.map((img, idx) => {
                const imageIndex = idx + 1;
                const isLastTile = idx === sideImages.length - 1 && hasMore;
                return (
                  <Box
                    key={imageIndex}
                    onClick={() => handleImageClick(imageIndex)}
                    className={`${styles.sideTile} ${
                      sideImages.length === 1 ? styles.sideTileSpan2 : ""
                    }`}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={`Salon photo ${imageIndex + 1}`}
                      className={styles.leadImg}
                    />
                    {isLastTile && (
                      <Box className={styles.seeAllOverlay}>
                        <Box className={styles.iconBox}>
                          <VisibilityIcon sx={{ color: "var(--app-hero-from, var(--app-primary))" }} />
                        </Box>
                        <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1.125rem" }}>+{images.length - 3}</Typography>
                        <Typography sx={{ color: "white", fontSize: { xs: "0.75rem", sm: "0.875rem" }, fontWeight: 600 }}>See all photos</Typography>
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
