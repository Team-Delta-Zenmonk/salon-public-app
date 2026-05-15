import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hook";
import { markPaymentCompleted } from "../../../../features/salon/bookings/booking.slice";
import { callSnack } from "../../../../components/snackbar";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import LockIcon from "@mui/icons-material/Lock";

interface PaymentFormProps {
  booking: any;
  isExpired: boolean;
}

export default function PaymentForm({ booking, isExpired }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || processing || isExpired) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        callSnack("Payment confirmed! 🎉", "success");
        dispatch(markPaymentCompleted());
        navigate("/bookings/success", {
          state: { bookingUuid: booking.uuid, booking },
          replace: true,
        });
      } else {
        setPaymentError("Payment was not completed. Please try again.");
        setProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment submission error:", err);
      setPaymentError(err?.message || "An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Box className="py-2">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["upi", "card"],
          }}
        />
      </Box>

      {paymentError && (
        <Box className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
          <ErrorOutlineIcon className="text-red-500 text-[18px] shrink-0 mt-0.5" />
          <Box>
            <Typography className="text-[12px] font-bold text-red-600 dark:text-red-400 leading-tight">
              {paymentError}
            </Typography>
            <Typography className="text-[10px] text-red-400 dark:text-red-400/70 mt-1">
              Your booking is still reserved. Try again.
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        className={`
          mt-4 p-4 rounded-[12px] border border-dashed border-[var(--app-border)]
          flex items-center justify-center gap-3
          ${isDark ? "bg-white/3" : "bg-gray-50/50"}
        `}
      >
        <ShieldMoonIcon className="text-[var(--app-primary)] text-[18px]" />
        <Box>
          <Typography className="text-[11px] font-black text-[var(--app-text)] tracking-tight">
            100% Secure Transaction
          </Typography>
          <Typography className="text-[10px] text-[var(--app-muted)]">End-to-end encrypted • Stripe</Typography>
        </Box>
      </Box>

      <Box className="mt-8 hidden md:block">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!stripe || processing || isExpired}
          className={`
            rounded-[12px] font-black py-4 text-sm normal-case transition-all duration-200
            bg-[var(--app-primary)] text-white shadow-[0_8px_16px_-4px_var(--app-primary-soft)]
            hover:shadow-[0_12px_20px_-4px_var(--app-primary-soft)]
            disabled:opacity-50
          `}
        >
          {processing ? (
            <CircularProgress size={22} color="inherit" />
          ) : isExpired ? (
            "Booking Expired"
          ) : (
            `Confirm & Pay ₹${booking?.total_price || 0}`
          )}
        </Button>
        {!isExpired && !processing && (
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" className="mt-3 opacity-60">
            <LockIcon className="text-[10px] text-[var(--app-muted)]" />
            <Typography className="text-[10px] text-[var(--app-muted)] font-medium">
              Payments are processed securely
            </Typography>
          </Stack>
        )}
      </Box>

      <Box className="flex md:hidden fixed bottom-0 left-0 right-0 bg-[var(--app-surface)]/80 backdrop-blur-xl p-4 px-6 border-t border-[var(--app-border)] z-[1000] items-center justify-between gap-4">
        <Box>
          <Typography className="text-[9px] text-[var(--app-muted)] font-black uppercase tracking-widest">
            Total Amount
          </Typography>
          <Typography className="text-[18px] font-black text-[var(--app-primary)] leading-none mt-1">
            ₹{booking?.total_price || 0}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing || isExpired}
          className="rounded-full font-black px-8 h-11 text-sm normal-case bg-[var(--app-primary)] text-white shadow-lg shadow-[var(--app-primary-soft)]"
        >
          {processing ? <CircularProgress size={20} color="inherit" /> : isExpired ? "Expired" : "Pay Now"}
        </Button>
      </Box>
    </form>
  );
}
