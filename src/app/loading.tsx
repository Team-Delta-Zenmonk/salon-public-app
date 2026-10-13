import { Box, CircularProgress } from "@mui/material";

export default function RootLoader() {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--app-bg)",
      }}
    >
      <CircularProgress size={40} style={{ color: "var(--app-primary)" }} />
    </Box>
  );
}
