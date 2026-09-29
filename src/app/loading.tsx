import { Box, CircularProgress } from "@mui/material";

export default function RootLoader() {
  return (
    <Box className="flex justify-center items-center min-h-screen w-full bg-(--app-bg)">
      <CircularProgress size={40} className="text-(--app-primary)" />
    </Box>
  );
}
