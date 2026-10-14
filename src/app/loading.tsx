import { Box, CircularProgress } from "@mui/material";

export default function RootLoader() {
  return (
    <Box className="rootLoader">
      <CircularProgress size={40} className="rootSpinner" />
    </Box>
  );
}
