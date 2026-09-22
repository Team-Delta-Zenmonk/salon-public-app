import { Box, Typography } from "@mui/material";
import { useStorefront } from "../../providers/storefront-provider";
import StorefrontHoursAbout from "../storefront/_components/storefront-hours-about";

export default function AboutPage() {
  const { salon } = useStorefront();

  return (
    <Box className="space-y-6">
      <Box>
        <Typography className="text-xl sm:text-2xl font-black text-(--app-text) tracking-tight">
          About & Operational Hours
        </Typography>
        <Typography className="text-xs sm:text-sm text-(--app-muted) mt-0.5">
          Everything you need to know about visiting {salon?.name}
        </Typography>
      </Box>

      <StorefrontHoursAbout salon={salon} />
    </Box>
  );
}
