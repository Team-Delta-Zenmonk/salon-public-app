import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { salonImages } from "./login-image.constant";

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
    <Box className="relative h-full min-h-130 w-full overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-surface)">
      <Box className="pointer-events-none absolute inset-0 bg-linear-to-br from-(--app-primary-soft)/70 via-transparent to-(--app-surface-alt)" />

      <Box className="flex h-full w-full items-center justify-center p-6 sm:p-8">
        <Box
          component="img"
          src={active.path}
          alt={active.title}
          className="relative h-full max-h-[420px] w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
        />
      </Box>

      <Box className="absolute inset-x-0 bottom-0 border-t border-(--app-border) bg-(--app-surface)/85 px-5 py-4 backdrop-blur-sm">
        <Box className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-(--app-muted)">
          Curated Looks
        </Box>
        <Box className="mt-2 flex items-center justify-center gap-2">
          {salonImages.map((slide) => (
            <Box
              key={slide.id}
              onClick={() => setCurrentIndex(salonImages.findIndex((s) => s.id === slide.id))}
              role="button"
              title={slide.title}
              aria-label={`Go to slide ${salonImages.findIndex((s) => s.id === slide.id) + 1}`}
              className={`h-2 rounded-full border transition-all duration-200 ease-out ${
                slide.id === active.id
                  ? "w-7 border-(--app-primary) bg-(--app-primary)"
                  : "w-2 border-(--app-border) bg-(--app-surface-alt) hover:bg-(--app-primary-soft)"
              }`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SalonLoginCarousel;
