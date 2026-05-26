import React from "react";
import { Box, Skeleton } from "@mui/material";

interface SalonCardSkeletonProps {
  variant: "grid" | "list";
}

export const SalonCardSkeleton: React.FC<SalonCardSkeletonProps> = ({ variant }) => {
  if (variant === "grid") {
    return (
      <Box className="border border-(--app-border) rounded-2xl overflow-hidden bg-(--app-surface) flex flex-col">
        {/* Image area */}
        <Skeleton
          variant="rectangular"
          className="!w-full !aspect-[16/9]"
          sx={{ bgcolor: "var(--app-surface-alt)" }}
        />

        {/* Content area */}
        <Box className="p-3 sm:p-4">
          <Skeleton variant="text" className="!w-3/4 !h-5 !mb-1" />
          <Skeleton variant="text" className="!w-1/3 !h-4" />

          {/* Location row */}
          <Box className="flex items-center gap-1 mt-2">
            <Skeleton variant="circular" className="!w-3.5 !h-3.5 !shrink-0" />
            <Skeleton variant="text" className="!w-2/3 !h-3.5" />
          </Box>

          {/* Bottom row */}
          <Box className="mt-3 pt-2.5 border-t border-(--app-border)/40 flex items-center justify-between gap-2">
            <Skeleton variant="text" className="!w-1/2 !h-3.5" />
            <Skeleton variant="rounded" className="!w-14 !h-4 !rounded-full" />
          </Box>
        </Box>
      </Box>
    );
  }

  // List variant
  return (
    <Box className="border border-(--app-border) rounded-2xl bg-(--app-surface) p-3 sm:p-4">
      <Box className="flex flex-row gap-3.5">
        {/* Image area */}
        <Skeleton
          variant="rounded"
          className="!w-24 !h-24 sm:!w-40 sm:!h-28 !rounded-xl !shrink-0"
          sx={{ bgcolor: "var(--app-surface-alt)" }}
        />

        {/* Content area */}
        <Box className="flex-1 min-w-0 flex flex-col justify-between">
          <Box className="min-w-0">
            <Box className="flex items-start justify-between gap-2">
              <Skeleton variant="text" className="!w-2/3 !h-6" />
              <Skeleton variant="rounded" className="!w-14 !h-6 !rounded-full !shrink-0" />
            </Box>
            <Skeleton variant="text" className="!w-1/4 !h-4 !mt-0.5" />
            <Skeleton variant="text" className="!w-1/2 !h-3.5 !mt-1.5" />
          </Box>

          <Box className="mt-2 flex items-center justify-between border-t border-(--app-border)/40 pt-2.5 sm:pt-0 sm:border-t-0">
            <Box className="flex items-center gap-1">
              <Skeleton variant="circular" className="!w-3.5 !h-3.5 !shrink-0" />
              <Skeleton variant="text" className="!w-28 !h-3.5" />
            </Box>
            <Skeleton variant="rounded" className="!w-20 !h-4 !rounded-full" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
