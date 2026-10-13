import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ExpiryViewProps {
  onReturn: () => void;
}

export default function ExpiryView({ onReturn }: Readonly<ExpiryViewProps>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "rgba(239,68,68,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 32 }} />
      </Box>
      <Typography sx={{ fontWeight: 900, color: "var(--color-on-surface)", fontSize: "1.25rem", mb: 1 }}>
        Booking Expired
      </Typography>
      <Typography sx={{ color: "var(--color-tertiary)", fontSize: "0.875rem", mb: 4, maxWidth: 280 }}>
        Your session has timed out and the slot has been released. Please return to the cart to re-book.
      </Typography>
      <Button
        variant="contained"
        onClick={onReturn}
        sx={{
          borderRadius: "0.75rem",
          px: 5,
          py: 1.5,
          fontWeight: 900,
          textTransform: "none",
          boxShadow: "0 4px 12px var(--app-primary-soft)",
          "&:active": { transform: "scale(0.95)" },
        }}
      >
        Return to Cart
      </Button>
    </Box>
  );
}
