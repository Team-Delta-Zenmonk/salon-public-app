import { Dialog, DialogContent, Box, Typography, Button, CircularProgress } from "@mui/material";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { callSnack } from "../../../../../../components/snackbar";
import { stripePromise } from "../../../../../../common/stripe-client";

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
      <PaymentElement options={{ layout: "tabs" }} />

      <Box className="mt-8 flex flex-col gap-3">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!stripe || processing}
          className="rounded-xl font-bold py-3.5 shadow-lg shadow-primary/20 bg-(--app-primary) text-(--app-primary-contrast)"
        >
          {processing ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${booking?.total_price || 0}`}
        </Button>

        <Typography className="text-[11px] text-(--app-muted) text-center mt-2 flex items-center justify-center gap-1">
          Protected by SSL encryption and Stripe secure payments
        </Typography>
      </Box>
    </form>
  );
}

export default function PaymentSheetDialog({ open, onClose, clientSecret, booking }: PaymentSheetDialogProps) {
  const [processing, setProcessing] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={processing ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          className: "bg-(--app-surface) rounded-[24px] border border-(--app-border) overflow-hidden",
        },
        backdrop: {
          className: "backdrop-blur-sm bg-black/40",
        },
      }}
    >
      <DialogContent className="p-0">
        <Box className="flex items-center justify-between px-6 py-5 border-b border-(--app-border)">
          <Box>
            <Typography className="font-extrabold text-lg text-(--app-text) leading-tight">Secure Payment</Typography>
            <Typography className="text-xs text-(--app-muted) mt-0.5">Complete your booking payment</Typography>
          </Box>

          <Button
            onClick={processing ? undefined : onClose}
            className="min-w-0 p-2 rounded-xl bg-(--app-surface-alt) text-(--app-muted)"
          >
            <CloseIcon fontSize="small" />
          </Button>
        </Box>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#C291F0",
                colorBackground: "#1e1b4b",
                colorText: "#f8fafc",
                colorDanger: "#f87171",
                fontFamily: "Inter, system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "12px",
              },
            },
          }}
        >
          <PaymentForm onClose={onClose} clientSecret={clientSecret} booking={booking} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}