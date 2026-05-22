import { useEffect, useRef } from "react";
import { Box, Typography, Avatar, Button, Skeleton, Divider } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { formatDuration } from "../../common/date.utils";
import { calculateTotals } from "../../common/cart.utils";
import { getCartAction } from "../../features/salon/cart/get-cart/get-cart.action";
import { getActiveBookingAction } from "../../features/salon/bookings/get-active-booking/get-active-booking.action";
import { setBookingPhase, clearPaymentCompleted } from "../../features/salon/bookings/booking.slice";
import { BookingPhase } from "../../common/booking.enums";
import CartItem from "./_components/cart-items";
import BookingPanel from "./_components/booking-panel";
import ActiveBookingBanner from "./_components/active-booking-banner";
import { useLocation, useNavigate } from "react-router-dom";
import { callSnack } from "../../components/snackbar";

interface CartRouteState {
  redirectTo?: string;
  resumeBooking?: boolean;
}

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, salon, loaded } = useAppSelector((s) => s.cart);
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { bookingPhase, activeBooking, paymentJustCompleted } = useAppSelector((s) => s.booking);
  const routeState = (location.state ?? null) as CartRouteState | null;

  const didPaymentJustComplete = useRef(paymentJustCompleted);

  useEffect(() => {
    if (didPaymentJustComplete.current) return;
    if (isAuthenticated && customer?.uuid) {
      dispatch(getCartAction(customer.uuid));
    }
  }, [dispatch, isAuthenticated, customer?.uuid]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (didPaymentJustComplete.current) {
      dispatch(clearPaymentCompleted());
      return;
    }

    dispatch(getActiveBookingAction(salon?.uuid));
  }, [dispatch, isAuthenticated, salon?.uuid]);

  useEffect(() => {
    if (!routeState?.resumeBooking || !isAuthenticated || !loaded || items.length === 0) return;

    dispatch(setBookingPhase(BookingPhase.SLOT_SELECTION));
    navigate(location.pathname, { replace: true, state: null });
  }, [routeState?.resumeBooking, isAuthenticated, loaded, items.length, navigate, location.pathname, dispatch]);

  const bookingPanelOpen =
    bookingPhase === BookingPhase.SLOT_SELECTION ||
    bookingPhase === BookingPhase.CONFIRMING ||
    bookingPhase === BookingPhase.BOOKING_CONFLICT;

  const onProceedToBook = () => {
    if (isAuthenticated) {
      dispatch(setBookingPhase(BookingPhase.SLOT_SELECTION));
      return;
    }

    callSnack("Please sign in to continue booking.", "info");
    navigate("/signup", {
      state: {
        redirectTo: "/cart",
        resumeBooking: true,
      } satisfies CartRouteState,
    });
  };

  if (!loaded) {
    return (
      <Box className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-5">
        <Skeleton variant="rounded" height={176} className="rounded-3xl" />
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={96} className="rounded-2xl" />
        ))}
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box className="flex flex-col items-center justify-center p-10 sm:p-16 text-center gap-4">
        <Box className="w-18 h-18 rounded-2xl bg-(--app-surface-alt) border border-(--app-border) flex items-center justify-center">
          <StorefrontIcon className="text-[32px] text-(--app-muted)" />
        </Box>
        <Box>
          <Typography className="font-bold text-lg text-(--app-text)">Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1 text-(--app-muted)">
            Browse salons and add services to get started
          </Typography>
        </Box>
      </Box>
    );
  }

  const { totalPrice, totalDuration } = calculateTotals(items);

  const durationText = formatDuration(totalDuration);

  return (
    <>
      <Box className="bg-(--app-bg) min-h-full p-2.5 sm:p-6 lg:p-8">
        <Box className="w-full max-w-345 mx-auto">
          {salon && (
            <Box className="relative rounded-3xl overflow-hidden mb-6 sm:mb-7 bg-linear-to-r from-(--app-hero-from) via-(--app-primary) to-(--app-hero-to) min-h-36 sm:min-h-40 border border-(--app-border)">
              {salon.logo && (
                <Box
                  component="img"
                  src={salon.logo}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110"
                />
              )}

              <Box className="absolute inset-0 bg-linear-to-r from-(--app-hero-from) via-(--app-primary) to-(--app-hero-to) opacity-30" />

              <Box className="relative p-3.5 sm:p-7 lg:p-8 flex items-center gap-3 sm:gap-6">
                <Avatar
                  src={salon.logo}
                  variant="rounded"
                  className="w-12 h-12 sm:w-18 sm:h-18 rounded-xl border border-(--app-border) bg-(--app-surface) shrink-0"
                />

                <Box className="flex-1 min-w-0">
                  <Box className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Typography className="font-extrabold text-[1.65rem] sm:text-[30px] text-(--app-primary-contrast) leading-none">
                      {salon.name}
                    </Typography>
                    <Box className="px-3 py-1 bg-(--app-surface) rounded-full border border-(--app-border)">
                      <Typography className="text-(--app-text) text-[11px] font-semibold tracking-wide">
                        {(salon.type ?? "salon").toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-start gap-1 max-w-full">
                    <PlaceIcon className="text-[13px] text-(--app-primary-contrast)" />
                    <Typography
                      variant="caption"
                      className="text-(--app-primary-contrast) text-[0.73rem] sm:text-sm leading-snug sm:leading-normal break-words"
                    >
                      {salon.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {activeBooking && <ActiveBookingBanner />}

          <Typography
            variant="caption"
            className="font-bold text-(--app-muted) block mb-3 sm:mb-4 ml-0.5 tracking-[0.16em]"
          >
            {items.length} SERVICE{items.length > 1 ? "S" : ""}
          </Typography>

          <Box className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_380px] gap-4 sm:gap-6 lg:gap-8 items-start content-start">
            <Box className="self-start">
              <Box className="space-y-3 sm:space-y-4">
                {items.map((item: any) => (
                  <CartItem key={item.uuid ?? item.service_id} item={item} />
                ))}
              </Box>
            </Box>

            <Box className="bg-(--app-surface) border border-(--app-border) rounded-3xl overflow-hidden self-start lg:sticky lg:top-6 shadow-[0_1px_6px_var(--app-primary-soft)]">
              <Box className="px-4 sm:px-6 py-4 sm:py-5 border-b border-(--app-border) bg-(--app-surface-alt)">
                <Typography className="font-bold text-[0.98rem] sm:text-base text-(--app-text)">
                  Order Summary
                </Typography>
              </Box>

              <Box className="px-4 sm:px-6 py-4 sm:py-6">
                <Box className="flex justify-between items-center mb-3.5">
                  <Box className="flex items-center gap-1.5">
                    <AccessTimeIcon className="text-[15px] text-(--app-muted)" />
                    <Typography variant="body2" className="text-(--app-muted)">
                      Duration
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="font-semibold text-(--app-text)">
                    {durationText}
                  </Typography>
                </Box>

                <Box className="flex justify-between items-center mb-4">
                  <Box className="flex items-center gap-1.5">
                    <CalendarMonthIcon className="text-[15px] text-(--app-muted)" />
                    <Typography variant="body2" className="text-(--app-muted)">
                      Services
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="font-semibold text-(--app-text)">
                    {items.length}
                  </Typography>
                </Box>

                <Divider className="my-4 border-(--app-border)" />

                <Box className="flex justify-between items-center mb-4">
                  <Typography className="font-bold text-(--app-text)">Total</Typography>
                  <Typography className="font-extrabold text-[1.38rem] sm:text-[24px] leading-none text-(--app-text)">
                    ₹{totalPrice}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disableElevation
                  onClick={onProceedToBook}
                  className="rounded-xl font-bold py-3 text-sm tracking-wide transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_22px_var(--app-primary-soft)]"
                >
                  Proceed to Book
                </Button>

                <Typography variant="caption" className="block text-center mt-3 text-(--app-muted)">
                  Select staff & time you want to book
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <BookingPanel open={bookingPanelOpen} onClose={() => dispatch(setBookingPhase(BookingPhase.IDLE))} />
    </>
  );
}
