import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ExpiryViewProps {
  onReturn: () => void;
}

export default function ExpiryView({ onReturn }: Readonly<ExpiryViewProps>) {
  return (
    <Box className="p-10 text-center border border-[var(--app-border)] !bg-[var(--app-primary-soft)] rounded-[32px] shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <Box className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
        <ErrorOutlineIcon color="error" className="text-[32px]" />
      </Box>
      <Typography className="font-black text-[var(--app-text)] text-xl mb-2">Booking Expired</Typography>
      <Typography className="text-[var(--app-muted)] text-sm mb-8 max-w-[280px] mx-auto">
        Your session has timed out and the slot has been released. Please return to the cart to re-book.
      </Typography>
      <Button
        variant="contained"
        onClick={onReturn}
        className="rounded-[12px] px-10 py-3 bg-[var(--app-primary)] text-white font-black text-sm normal-case shadow-lg shadow-[var(--app-primary-soft)] transition-all active:scale-95"
      >
        Return to Cart
      </Button>
    </Box>
  );
}
