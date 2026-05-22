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
    <Box className="fixed top-0 left-0 right-0 z-[1000] bg-[var(--app-surface)] border-b border-[var(--app-border)] backdrop-blur-md">
      <Container maxWidth="lg">
        <Box className="flex items-center justify-between h-14">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={onBack}
              size="small"
              className="bg-[var(--app-surface)] border border-[var(--app-border)] p-1.5 hover:bg-[rgba(var(--app-primary-rgb),0.05)] transition-colors"
            >
              <ArrowBackIcon className="text-[18px] text-[var(--app-text)]" />
            </IconButton>
            <Box>
              <Typography className="text-[0.95rem] md:text-[1.1rem] font-black text-[var(--app-text)] leading-none tracking-tight">
                Checkout
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" className="mt-1">
                <VerifiedUserIcon className="text-[10px] text-green-500" />
                <Typography className="text-[9px] text-[var(--app-muted)] font-black tracking-widest uppercase">
                  Secure
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {!isExpired && (
            <Paper
              elevation={0}
              className={`
                px-3 py-1 rounded-full flex items-center gap-2 border transition-all duration-300
                ${
                  isCritical
                    ? "bg-red-500 border-red-500 text-white animate-[countdownPulse_1.5s_ease_infinite]"
                    : "bg-[var(--app-primary-soft)] border-[var(--app-primary)] text-[var(--app-primary)]"
                }
              `}
            >
              <AccessTimeIcon className="text-[12px]" />
              <Typography className="text-[11px] font-black tabular-nums">{formattedTime}</Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
