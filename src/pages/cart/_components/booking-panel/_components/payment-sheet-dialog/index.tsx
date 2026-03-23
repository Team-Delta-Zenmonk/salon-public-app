import { Dialog, DialogContent, Box, Typography, Button, CircularProgress, useTheme, IconButton } from "@mui/material";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { callSnack } from "../../../../../../components/snackbar";
import { stripePromise } from "../../../../../../common/stripe-client";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";

interface PaymentSheetDialogProps {
  open: boolean;
  onClose: () => void;
  clientSecret: string;
  booking: any;
}

function PaymentForm({ onClose, clientSecret, booking }: Omit<PaymentSheetDialogProps, "open">) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || processing) return;

    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      callSnack(submitError.message || "An error occurred", "error");
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: "if_required",
    });

    if (error) {
      callSnack(error.message || "Payment failed", "error");
      setProcessing(false);
    }
    else if (paymentIntent?.status === "succeeded") {
      callSnack("Payment successful!", "success");

      onClose();
      navigate("/bookings/success", { state: { booking } });
    }
    else if (paymentIntent?.status === "processing") {
      callSnack("Payment is processing...", "info");

      onClose();
      navigate("/bookings/success", { state: { booking } });
    }
    else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <PaymentElement options={{ layout: "tabs", paymentMethodOrder: ["upi", "card"] }} />

      <Box className="mt-8 flex flex-col gap-3">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!stripe || processing}
          className="rounded-2xl font-black py-4 shadow-xl shadow-primary/20 bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110 active:scale-[0.98] transition-all text-base uppercase tracking-wider"
        >
          {processing ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${booking?.total_price || 0}`}
        </Button>

        <Box className="mt-4 p-4 rounded-2xl bg-(--app-surface-alt) border border-(--app-border) flex items-center justify-center gap-3">
          <ShieldMoonIcon className="text-(--app-primary) text-xl" />
          <Box>
            <Typography className="text-[11px] font-bold text-(--app-text) uppercase tracking-tighter">Secure Checkout</Typography>
            <Typography className="text-[10px] text-(--app-muted)">SSL Encryption & Stripe Protected</Typography>
          </Box>
        </Box>
      </Box>
    </form>
  );
}

export default function PaymentSheetDialog({ open, onClose, clientSecret, booking }: PaymentSheetDialogProps) {
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={processing ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          className: "bg-(--app-surface) rounded-[32px] border border-(--app-border) overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-xl",
          style: {
            backgroundImage: 'none',
          }
        },
        backdrop: {
          className: "backdrop-blur-md bg-black/60",
        },
      }}
    >
      <DialogContent className="p-0">
        <Box className="relative flex flex-col items-center justify-center px-6 py-10 border-b border-(--app-border) bg-linear-to-b from-(--app-primary-soft) to-transparent">
          <IconButton
            onClick={processing ? undefined : onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-(--app-surface-alt)/50 text-(--app-muted) hover:bg-(--app-surface-alt) hover:text-(--app-text) transition-all"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box className="w-16 h-16 rounded-3xl bg-(--app-primary) flex items-center justify-center shadow-lg shadow-primary/30 mb-4 animate-pulse">
            <ShieldMoonIcon className="text-(--app-primary-contrast) text-3xl" />
          </Box>

          <Typography className="font-black text-2xl text-(--app-text) tracking-tight text-center">Secure Payment</Typography>
          <Typography className="text-sm text-(--app-muted) mt-1 text-center font-medium">Complete your premium salon booking</Typography>
        </Box>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: isDark ? "night" : "flat",
              variables: {
                colorPrimary: theme.palette.primary.main,
                colorBackground: theme.palette.background.paper,
                colorText: theme.palette.text.primary,
                colorDanger: theme.palette.error.main,
                colorWarning: theme.palette.warning.main,
                fontFamily: theme.typography.fontFamily,
                spacingUnit: "5px",
                borderRadius: "16px",
                fontSizeBase: "14px",
              },
              rules: {
                '.Input': {
                  backgroundColor: isDark ? theme.palette.background.default : '#ffffff',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  padding: '12px 14px',
                },
                '.Input:focus': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                },
                '.Label': {
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: theme.palette.text.secondary,
                },
                '.Tab': {
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark ? theme.palette.background.default : '#f8fafc',
                  padding: '12px 16px',
                },
                '.Tab--selected': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: isDark ? (theme as any).palette.primary.light || theme.palette.primary.main + '15' : theme.palette.primary.light,
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
                },
                '.TabLabel': {
                  fontWeight: '700',
                }
              }
            },
          }}
        >
          <PaymentForm onClose={onClose} clientSecret={clientSecret} booking={booking} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}