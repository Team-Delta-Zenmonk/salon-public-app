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
import styles from "../checkout-components.module.css";

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
    <form onSubmit={handleSubmit} className={styles.form}>
      <Box className={styles.elementWrapper}>
        <PaymentElement
          options={{ layout: "tabs", paymentMethodOrder: ["upi", "card"] }}
        />
      </Box>

      {paymentError && (
        <Box className={styles.errorBox}>
          <ErrorOutlineIcon className={styles.paymentErrorIcon} />
          <Box>
            <Typography className={styles.paymentErrorTitle}>
              {paymentError}
            </Typography>
            <Typography className={styles.paymentErrorSub}>
              Your booking is still reserved. Try again.
            </Typography>
          </Box>
        </Box>
      )}

      <Box className={styles.secureNotice}>
        <ShieldMoonIcon className={styles.secureIcon} />
        <Box>
          <Typography className={styles.secureTitle}>
            100% Secure Transaction
          </Typography>
          <Typography className={styles.secureSub}>
            End-to-end encrypted • Stripe
          </Typography>
        </Box>
      </Box>

      <Box className={styles.desktopBtnWrapper}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!stripe || processing || isExpired}
          className={styles.submitBtnDesktop}
        >
          <DesktopButtonLabel processing={processing} isExpired={isExpired} totalPrice={totalPrice} />
        </Button>
        {!isExpired && !processing && (
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" className={styles.securityNoteStack}>
            <LockIcon className={styles.lockSmallIcon} />
            <Typography className={styles.lockSmallText}>
              Payments are processed securely
            </Typography>
          </Stack>
        )}
      </Box>

      <Box className={styles.mobileStickyFooter}>
        <Box>
          <Typography className={styles.mobileTotalLabel}>
            Total Amount
          </Typography>
          <Typography className={styles.mobileTotalPrice}>
            ₹{totalPrice}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing || isExpired}
          className={styles.mobileSubmitBtn}
        >
          <MobileButtonLabel processing={processing} isExpired={isExpired} />
        </Button>
      </Box>
    </form>
  );
}
