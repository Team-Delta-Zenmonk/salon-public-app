import { Box, Typography } from "@mui/material";

export const MapViewPlaceholder = () => {
  return (
    <Box className="h-150 rounded-3xl border border-dashed border-slate-300 flex items-center justify-center">
      <Typography color="text.secondary">🚧 Map view in progress</Typography>
    </Box>
  );
};
