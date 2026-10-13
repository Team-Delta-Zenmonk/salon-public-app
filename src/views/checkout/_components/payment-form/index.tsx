import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAppDispatch } from "../../../../store/hook";
import { markPaymentCompleted } from "../../../../features/salon/bookings/booking.slice";
import { setPaymentCompleted } from "../../../../features/salon/cart/cart.utils";
import { callSnack } from "../../../../components/snackbar";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import LockIcon from "@mui/icons-material/Lock";
import { buildStorefrontUrl } from "../../../../common/storefront-slug.utils";

interface PaymentFormProps {
  booking: any;
  isExpired: boolean;
  onPaymentSuccess: () => void;
}

interface DesktopButtonLabelProps {
  processing: boolean;
  isExpired: boolean;
  totalPrice: number;
}
interface MobileButtonLabelProps {
  processing: boolean;
  isExpired: boolean;
}

function DesktopButtonLabel({ processing, isExpired, totalPrice }: Readonly<DesktopButtonLabelProps>) {
  if (processing) return <CircularProgress size={22} color="inherit" />;
  if (isExpired) return "Booking Expired";
  return `Confirm & Pay ₹${totalPrice}`;
}

function MobileButtonLabel({ processing, isExpired }: Readonly<MobileButtonLabelProps>) {
  if (processing) return <CircularProgress size={20} color="inherit" />;
  if (isExpired) return "Expired";
  return "Pay Now";
}

export default function PaymentForm({ booking, isExpired, onPaymentSuccess }: Readonly<PaymentFormProps>) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const totalPrice = booking?.total_price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || processing || isExpired) return;
    setProcessing(true);
    setPaymentError(null);

    try {
      const returnUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${buildStorefrontUrl("/bookings/success")}`
          : "/bookings/success";

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        callSnack("Payment confirmed! 🎉", "success");
        setPaymentCompleted();
        dispatch(markPaymentCompleted());
        onPaymentSuccess();
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
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Box sx={{ py: 1 }}>
        <PaymentElement
          options={{ layout: "tabs", paymentMethodOrder: ["upi", "card"] }}
        />
      </Box>

      {paymentError && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: "0.75rem",
            backgroundColor: isDark ? "rgba(239,68,68,0.1)" : "rgba(254,242,242,1)",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "rgba(254,202,202,1)"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <ErrorOutlineIcon sx={{ color: "#ef4444", fontSize: 18, flexShrink: 0, mt: "2px" }} />
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: isDark ? "#f87171" : "#dc2626", lineHeight: 1.4 }}>
              {paymentError}
            </Typography>
            <Typography sx={{ fontSize: 10, color: isDark ? "rgba(248,113,113,0.7)" : "#f87171", mt: "4px" }}>
              Your booking is still reserved. Try again.
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: "0.75rem",
          border: "1px dashed var(--color-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(249,250,251,0.5)",
        }}
      >
        <ShieldMoonIcon sx={{ color: "var(--color-primary)", fontSize: 18 }} />
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 900, color: "var(--color-on-surface)", letterSpacing: "-0.01em" }}>
            100% Secure Transaction
          </Typography>
          <Typography sx={{ fontSize: 10, color: "var(--color-tertiary)" }}>
            End-to-end encrypted • Stripe
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: { xs: "none", md: "block" } }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!stripe || processing || isExpired}
          sx={{
            borderRadius: "0.75rem",
            fontWeight: 900,
            py: 2,
            fontSize: "0.875rem",
            textTransform: "none",
            boxShadow: "0 8px 16px -4px var(--app-primary-soft)",
            "&:hover": { boxShadow: "0 12px 20px -4px var(--app-primary-soft)" },
            "&:disabled": { opacity: 0.5 },
          }}
        >
          <DesktopButtonLabel processing={processing} isExpired={isExpired} totalPrice={totalPrice} />
        </Button>
        {!isExpired && !processing && (
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ mt: 1.5, opacity: 0.6 }}>
            <LockIcon sx={{ fontSize: 10, color: "var(--color-tertiary)" }} />
            <Typography sx={{ fontSize: 10, color: "var(--color-tertiary)", fontWeight: 500 }}>
              Payments are processed securely
            </Typography>
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(var(--bg-surface-rgb, 255,255,255), 0.8)",
          backdropFilter: "blur(20px)",
          p: 2,
          px: 3,
          borderTop: "1px solid var(--color-hairline)",
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 9, color: "var(--color-tertiary)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Total Amount
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 900, color: "var(--color-primary)", lineHeight: 1, mt: "4px" }}>
            ₹{totalPrice}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing || isExpired}
          sx={{
            borderRadius: "9999px",
            fontWeight: 900,
            px: 4,
            height: 44,
            textTransform: "none",
            boxShadow: "0 4px 12px var(--app-primary-soft)",
          }}
        >
          <MobileButtonLabel processing={processing} isExpired={isExpired} />
        </Button>
      </Box>
    </form>
  );
}
