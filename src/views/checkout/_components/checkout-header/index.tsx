import { Box, Container, Stack, IconButton, Typography, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ExpiryUrgency } from "../../../../common/booking.enums";

interface CheckoutHeaderProps {
  onBack: () => void;
  isExpired: boolean;
  urgency: ExpiryUrgency;
  formattedTime: string;
}

export default function CheckoutHeader({ onBack, isExpired, urgency, formattedTime }: Readonly<CheckoutHeaderProps>) {
  const isCritical = urgency === ExpiryUrgency.CRITICAL;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--color-hairline)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--color-hairline)",
                p: "6px",
                "&:hover": { backgroundColor: "color-mix(in srgb, var(--color-primary) 5%, transparent)" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18, color: "var(--color-on-surface)" }} />
            </IconButton>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  fontWeight: 900,
                  color: "var(--color-on-surface)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Checkout
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: "4px" }}>
                <VerifiedUserIcon sx={{ fontSize: 10, color: "#22c55e" }} />
                <Typography sx={{ fontSize: 9, color: "var(--color-tertiary)", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Secure
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {!isExpired && (
            <Paper
              elevation={0}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid",
                transition: "all 0.3s",
                ...(isCritical
                  ? {
                      backgroundColor: "#ef4444",
                      borderColor: "#ef4444",
                      color: "white",
                      animation: "countdownPulse 1.5s ease infinite",
                    }
                  : {
                      backgroundColor: "var(--app-primary-soft)",
                      borderColor: "var(--color-primary)",
                      color: "var(--color-primary)",
                    }),
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 12 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                {formattedTime}
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
