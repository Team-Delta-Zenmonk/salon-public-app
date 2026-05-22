import { Box, Container, Typography, Paper } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../common/stripe-client";
import CheckoutHeader from "./_components/checkout-header";
import MobileSummaryBar from "./_components/mobile-summary-bar";
import OrderSummary from "./_components/order-summary";
import PaymentForm from "./_components/payment-form";
import AssistanceCard from "./_components/assistance-card";
import SecurityFooter from "./_components/security-footer";
import ExpiryView from "./_components/expiry-view";
import { useCheckoutData } from "./hooks/useCheckoutData";
import { useStripeAppearance } from "./hooks/useStripeAppearance";
interface PaymentPanelProps {
  clientSecret: string;
  stripeAppearance: ReturnType<typeof useStripeAppearance>;
  currentBooking: NonNullable<any>;
  isExpired: boolean;
  displaySalon: any;
}

export default function Checkout() {
  const { currentBooking, clientSecret, displaySalon, formattedTime, isExpired, urgency, dateStr, handleResetBooking } =
    useCheckoutData();

  const stripeAppearance = useStripeAppearance();

  if (!currentBooking || !clientSecret) return null;

  return (
    <Box className="h-[100dvh] w-full bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col relative overflow-y-auto">
      <Box className="fixed top-0 right-0 w-1/2 h-full bg-linear-to-br from-[rgba(var(--app-primary-rgb),0.03)] to-transparent clip-path-angled z-0 hidden lg:block" />

      <CheckoutHeader
        onBack={handleResetBooking}
        isExpired={isExpired}
        urgency={urgency}
        formattedTime={formattedTime}
      />

      <MobileSummaryBar salon={displaySalon} booking={currentBooking} dateStr={dateStr} />

      <Container
        maxWidth="lg"
        className="px-4 relative z-10 mt-6 lg:mt-20 pb-20 lg:pb-10 flex-1 flex flex-col justify-center"
      >
        <Box className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
              />
            )}
          </Box>

          <Box className="hidden lg:block lg:col-span-5 w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Typography className="text-lg font-black text-[var(--app-text)] mb-5 ml-1">Order Summary</Typography>
            <OrderSummary salon={displaySalon} booking={currentBooking} dateStr={dateStr} />
            <AssistanceCard phone={displaySalon?.phone} isDesktop />
          </Box>
        </Box>
      </Container>

      <style>{`
        .clip-path-angled {
          clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
        }
      `}</style>
    </Box>
  );
}

function PaymentPanel({
  clientSecret,
  stripeAppearance,
  currentBooking,
  isExpired,
  displaySalon,
}: Readonly<PaymentPanelProps>) {
  return (
    <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Typography className="text-sm font-black text-[var(--app-text)] mb-6 ml-1 flex items-center gap-2.5">
        <PaymentsIcon className="text-[var(--app-primary)] text-[18px]" />
        Payment Method
      </Typography>

      <Paper
        elevation={0}
        className="p-4 sm:p-8 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-[24px] shadow-sm"
      >
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
          <PaymentForm booking={currentBooking} isExpired={isExpired} />
        </Elements>
      </Paper>

      <AssistanceCard phone={displaySalon?.phone} />
      <SecurityFooter />
    </Box>
  );
}
