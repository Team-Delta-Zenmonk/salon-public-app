import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
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
    <Box className="relative h-full min-h-130 w-full overflow-hidden rounded-lg ">
      <Box component="img" src={active.path} alt={active.title} className="h-full w-full object-cover scale-[1.02]" />
      <Box className="absolute left-5.5 right-5.5 bottom-5.5 text-white">
        <Box className="mt-1.5 flex gap-1 align-center justify-center">
          {salonImages.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              role="button"
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full cursor-pointer transition-all duration-200 ease-out
                ${idx === currentIndex ? "w-6.5 bg-black opacity-100" : "w-2 bg-black/55 opacity-80"}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SalonLoginCarousel;
