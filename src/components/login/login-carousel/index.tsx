import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { salonImages } from "./login-image.constant";
import styles from "./login-carousel.module.css";

const SalonLoginCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = salonImages.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide, total]);

  const active = useMemo(() => salonImages[currentIndex], [currentIndex]);

  return (
    <Box className={styles.carouselContainer}>
      <Box className={styles.gradientOverlay} />

      <Box className={styles.imageWrapper}>
        <Box
          component="img"
          src={active.path}
          alt={active.title}
          className={styles.carouselImage}
        />
      </Box>

      <Box className={styles.footerBar}>
        <Box className={styles.curatedTitle}>
          Curated Looks
        </Box>
        <Box className={styles.dotsWrapper}>
          {salonImages.map((slide) => (
            <Box
              key={slide.id}
              onClick={() => setCurrentIndex(salonImages.findIndex((s) => s.id === slide.id))}
              role="button"
              title={slide.title}
              aria-label={`Go to slide ${salonImages.findIndex((s) => s.id === slide.id) + 1}`}
              className={`${styles.dot} ${
                slide.id === active.id ? styles.dotActive : styles.dotInactive
              }`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SalonLoginCarousel;
