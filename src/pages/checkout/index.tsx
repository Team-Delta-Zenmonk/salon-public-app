import { useEffect } from "react";
import { Box, Container, Typography, Paper, useTheme } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { useBookingExpiry } from "../../common/hooks/useBookingExpiry";
import { clearBookingSession } from "../../features/salon/bookings/booking.slice";
import { stripePromise } from "../../common/stripe-client";
import { WEEKDAY_FULL, MONTH_SHORT } from "../../common/date.constants";
import CheckoutHeader from "./_components/checkout-header";
import MobileSummaryBar from "./_components/mobile-summary-bar";
import OrderSummary from "./_components/order-summary";
import PaymentForm from "./_components/payment-form";
import AssistanceCard from "./_components/assistance-card";
import SecurityFooter from "./_components/security-footer";
import ExpiryView from "./_components/expiry-view";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { currentBooking, clientSecret } = useAppSelector((s) => s.booking);
  const { salon: cartSalon } = useAppSelector((s) => s.cart);

  const displaySalon = currentBooking?.salon || cartSalon;
  const { formattedTime, isExpired, urgency } = useBookingExpiry(currentBooking?.expires_at);

  useEffect(() => {
    if (!currentBooking || !clientSecret) {
      navigate("/cart", { replace: true });
    }
  }, [currentBooking, clientSecret, navigate]);

  if (!currentBooking || !clientSecret) return null;

  const dateObj = currentBooking.booking_date ? new Date(currentBooking.booking_date) : null;
  const dateStr = dateObj
    ? `${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_SHORT[dateObj.getUTCMonth()]}`
    : "";

  const handleResetBooking = () => {
    dispatch(clearBookingSession());
    navigate("/cart");
  };

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
            {!isExpired ? (
              <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Typography className="text-sm font-black text-[var(--app-text)] mb-6 ml-1 flex items-center gap-2.5">
                  <PaymentsIcon className="text-[var(--app-primary)] text-[18px]" />
                  Payment Method
                </Typography>

                <Paper
                  elevation={0}
                  className="p-4 sm:p-8 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-[24px] shadow-sm"
                >
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: isDark ? "night" : "flat",
                        variables: {
                          colorPrimary: theme.palette.primary.main,
                          colorBackground: isDark ? theme.palette.background.paper : "#ffffff",
                          colorText: isDark ? theme.palette.text.primary : "#1e293b",
                          colorDanger: "#ef4444",
                          fontFamily: theme.typography.fontFamily,
                          spacingUnit: "4px",
                          borderRadius: "10px",
                        },
                        rules: {
                          ".Input": {
                            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#fcfcfc",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #eef2f6",
                            padding: "10px 14px",
                            fontSize: "14px",
                            color: isDark ? "#ffffff" : "#1e293b",
                          },
                          ".Label": {
                            fontSize: "12px",
                            fontWeight: "700",
                            color: isDark ? "#94a3b8" : "#475569",
                            marginBottom: "6px",
                            textTransform: "none",
                          },
                          ".Tab": {
                            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                            padding: "8px 16px",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #eef2f6",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: isDark ? "#ffffff" : "#1e293b",
                          },
                        },
                      },
                    }}
                  >
                    <PaymentForm booking={currentBooking} isExpired={isExpired} />
                  </Elements>
                </Paper>

                <AssistanceCard phone={displaySalon?.phone} />

                <SecurityFooter />
              </Box>
            ) : (
              <ExpiryView onReturn={handleResetBooking} />
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
