import React from "react";
import { Card, CardContent, Box, Skeleton, Divider } from "@mui/material";

export const BookingSkeleton: React.FC = () => {
  return (
    <Card
      elevation={0}
      className="rounded-[32px] mb-3 bg-(--app-surface) border border-(--app-border) shadow-none relative overflow-hidden"
    >
      <Box className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-(--app-border) opacity-50" />

      <CardContent className="!p-4 md:!p-6 !pl-6 md:!pl-8 !pb-4 md:!pb-6">
        <Box className="flex justify-between items-center mb-6">
          <Box className="flex items-center gap-4">
            <Skeleton variant="rounded" className="!w-14 !h-14 !rounded-[18px]" />
            <Box>
              <Skeleton variant="text" className="!w-[140px] !h-7" />
              <Skeleton variant="text" className="!w-[200px] !h-5" />
            </Box>
          </Box>
          <Skeleton variant="rounded" className="!w-[100px] !h-8 !rounded-[20px]" />
        </Box>

        <Divider className="!my-6 !border-dashed opacity-50" />

        <Box className="flex justify-between items-center">
          <Box className="flex gap-8">
            <Box>
              <Skeleton variant="text" className="!w-10 !h-4" />
              <Skeleton variant="text" className="!w-[100px] !h-6" />
            </Box>
            <Box>
              <Skeleton variant="text" className="!w-10 !h-4" />
              <Skeleton variant="text" className="!w-[100px] !h-6" />
            </Box>
          </Box>
          <Box className="flex gap-4">
            <Skeleton variant="rounded" className="!w-[120px] !h-10 !rounded-[14px]" />
            <Skeleton variant="rounded" className="!w-[120px] !h-10 !rounded-[14px]" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
