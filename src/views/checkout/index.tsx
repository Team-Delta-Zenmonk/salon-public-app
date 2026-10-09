"use client";
import { useState, useCallback, useEffect } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Elements } from "@stripe/react-stripe-js";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { stripePromise } from "../../common/stripe-client";
import CheckoutHeader from "./_components/checkout-header";
import MobileSummaryBar from "./_components/mobile-summary-bar";
import OrderSummary from "./_components/order-summary";
import PaymentForm from "./_components/payment-form";
import AssistanceCard from "./_components/assistance-card";
import SecurityFooter from "./_components/security-footer";
import ExpiryView from "./_components/expiry-view";
import PaymentProcessing from "./_components/payment-processing";
import { getPaymentCompleted, clearGuestCart } from "../../features/salon/cart/cart.utils";
import { clearCart } from "../../features/salon/cart/cart.slice";
import { useAppDispatch } from "../../store/hook";
import { useCheckoutData } from "./hooks/useCheckoutData";
import { useStripeAppearance } from "./hooks/useStripeAppearance";

interface PaymentPanelProps {
  clientSecret: string;
  stripeAppearance: ReturnType<typeof useStripeAppearance>;
  currentBooking: NonNullable<any>;
  isExpired: boolean;
  displaySalon: any;
  onPaymentSuccess: () => void;
}

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const { currentBooking, clientSecret, displaySalon, formattedTime, isExpired, urgency, dateStr, handleResetBooking } =
    useCheckoutData();

  const stripeAppearance = useStripeAppearance();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const handleProcessingComplete = useCallback(() => {
    dispatch(clearCart());
    clearGuestCart();
    navigate("/bookings/success", {
      state: { bookingUuid: currentBooking?.uuid, booking: currentBooking },
      replace: true,
    });
  }, [dispatch, navigate, currentBooking]);

  useEffect(() => {
    if (!currentBooking && getPaymentCompleted()) {
      navigate("/bookings", { replace: true });
    }
  }, [currentBooking, navigate]);

  if (!currentBooking || !clientSecret) return null;

  if (isProcessing) {
    return (
      <PaymentProcessing
        salonName={displaySalon?.name || "the salon"}
        onComplete={handleProcessingComplete}
      />
    );
  }

  return (
    <Box className="min-h-screen w-full bg-[#FCF9F3] text-[#1C1C18] flex flex-col relative font-sans">
      <CheckoutHeader
        onBack={handleResetBooking}
        isExpired={isExpired}
        urgency={urgency}
        formattedTime={formattedTime}
      />

      <MobileSummaryBar salon={displaySalon} booking={currentBooking} dateStr={dateStr} />

      <Container
        maxWidth="lg"
        className="px-6 relative z-10 mt-6 lg:mt-12 flex-1 flex flex-col justify-center pb-16"
      >
        <Box className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <Box className="lg:col-span-7 order-1 w-full">
            {isExpired ? (
              <ExpiryView onReturn={handleResetBooking} />
            ) : (
              <PaymentPanel
                clientSecret={clientSecret}
                stripeAppearance={stripeAppearance}
                currentBooking={currentBooking}
                isExpired={isExpired}
                displaySalon={displaySalon}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </Box>

          <Box className="hidden lg:block lg:col-span-5 w-full">
            <Typography className="font-serif text-xl font-medium text-[#1C1A17] mb-4 ml-1">
              Reservation Investment Summary
            </Typography>
            <OrderSummary salon={displaySalon} booking={currentBooking} dateStr={dateStr} />
            <AssistanceCard phone={displaySalon?.phone} isDesktop />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function PaymentPanel({
  clientSecret,
  stripeAppearance,
  currentBooking,
  isExpired,
  displaySalon,
  onPaymentSuccess,
}: Readonly<PaymentPanelProps>) {
  return (
    <Box>
      <Typography className="font-serif text-2xl font-medium text-[#1C1A17] mb-6 flex items-center gap-2.5">
        <PaymentsIcon className="text-[#A88B64] text-xl" />
        Payment Sanctuary
      </Typography>

      <Paper
        elevation={0}
        className="p-6 sm:p-8 bg-[#FCFAF7] border border-[#E5DFD5] rounded-[2px] shadow-xs"
      >
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
          <PaymentForm booking={currentBooking} isExpired={isExpired} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      </Paper>

      <AssistanceCard phone={displaySalon?.phone} />
      <SecurityFooter />
    </Box>
  );
}

