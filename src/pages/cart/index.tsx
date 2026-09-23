import { useEffect, useRef, useState } from "react";
import { Box, Typography, Avatar, Button, Skeleton, Divider } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { formatDuration } from "../../common/date.utils";
import { calculateTotals } from "../../common/cart.utils";
import { getCartAction } from "../../features/salon/cart/get-cart/get-cart.action";
import { getPaymentCompleted } from "../../features/salon/cart/cart.utils";
import { getActiveBookingAction } from "../../features/salon/bookings/get-active-booking/get-active-booking.action";
import { setBookingPhase, clearPaymentCompleted } from "../../features/salon/bookings/booking.slice";
import { BookingPhase } from "../../common/booking.enums";
import CartItem from "./_components/cart-items";
import BookingPanel from "./_components/booking-panel";
import ActiveBookingBanner from "./_components/active-booking-banner";
import { useLocation } from "react-router-dom";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { callSnack } from "../../components/snackbar";

interface CartRouteState {
  redirectTo?: string;
  resumeBooking?: boolean;
}

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const location = useLocation();
  const { items, salon, loaded } = useAppSelector((s) => s.cart);
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { bookingPhase, activeBooking, paymentJustCompleted } = useAppSelector((s) => s.booking);
  const routeState = (location.state ?? null) as CartRouteState | null;

  const [isFetchingCart, setIsFetchingCart] = useState(isAuthenticated && !!customer?.uuid);
  const didPaymentJustComplete = useRef(paymentJustCompleted || getPaymentCompleted());

  useEffect(() => {
    if (didPaymentJustComplete.current) {
      setIsFetchingCart(false);
      return;
    }
    if (isAuthenticated && customer?.uuid) {
      setIsFetchingCart(true);
      dispatch(getCartAction(customer.uuid))
        .unwrap()
        .catch(() => {})
        .finally(() => setIsFetchingCart(false));
    } else {
      setIsFetchingCart(false);
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

  if (isFetchingCart || !loaded) {
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
        <Box className="w-18 h-18 rounded-3xl bg-(--app-surface-alt) border border-(--app-border) flex items-center justify-center">
          <StorefrontIcon className="text-[32px] text-(--app-muted)" />
        </Box>
        <Box>
          <Typography className="font-editorial text-xl sm:text-2xl font-bold text-(--app-text)">
            Your basket is currently empty
          </Typography>
          <Typography variant="body2" className="mt-1 text-xs sm:text-sm text-(--app-muted) max-w-sm mx-auto">
            Explore our curated menu of hair, skin, and wellness treatments to get started.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/services")}
            className="mt-4 rounded-full px-6 py-2.5 font-bold text-xs bg-(--app-primary) text-(--app-primary-contrast) normal-case"
          >
            Explore Services Menu
          </Button>
        </Box>
      </Box>
    );
  }

  const { totalPrice, totalDuration } = calculateTotals(items);

  const durationText = formatDuration(totalDuration);

  return (
    <>
      <Box className="bg-[var(--app-bg)] min-h-screen text-[var(--app-text)] p-4 sm:p-6 lg:p-10">
        <Box className="w-full max-w-6xl mx-auto">
          {salon && (
            <Box className="relative rounded-2xl overflow-hidden mb-8 bg-[var(--app-surface)] border border-[var(--app-primary)]/15 shadow-2xl p-6 sm:p-8">
              {salon.logo && (
                <Box
                  component="img"
                  src={salon.logo}
                  className="absolute inset-0 w-full h-full object-cover opacity-15 blur-xl scale-110"
                />
              )}

              <Box className="absolute inset-0 bg-gradient-to-r from-[var(--app-bg)] via-transparent to-[var(--app-bg)] opacity-80" />

              <Box className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar
                  src={salon.logo}
                  variant="rounded"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[var(--app-primary)]/30 bg-[var(--app-bg)] shrink-0"
                />

                <Box className="flex-1 min-w-0">
                  <Box className="flex items-center gap-3 mb-2 flex-wrap">
                    <Typography className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--app-text)] tracking-tight">
                      {salon.name}
                    </Typography>
                    <Box className="px-3 py-1 /10 rounded-full border border-[var(--app-primary)]/30">
                      <Typography className="text-[var(--app-primary)] text-[10px] font-semibold tracking-widest uppercase">
                        {(salon.type ?? "SANCTUARY")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center gap-2 text-xs text-[var(--app-muted)]/70">
                    <PlaceIcon className="text-sm text-[var(--app-primary)]" />
                    <Typography variant="body2" className="text-xs text-[var(--app-muted)]/70 truncate">
                      {salon.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {activeBooking && <ActiveBookingBanner />}

          <Box className="flex items-center justify-between mb-6 border-b border-[var(--app-primary)]/10 pb-4">
            <Typography
              variant="caption"
              className="font-mono text-xs font-bold text-[var(--app-primary)] tracking-[0.2em] uppercase"
            >
              Selected Ceremonies ({items.length})
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            <Box className="space-y-4">
              {items.map((item: any) => (
                <CartItem key={item.uuid ?? item.service_id} item={item} />
              ))}
            </Box>

            <Box className="bg-[var(--app-surface)] border border-[var(--app-primary)]/15 rounded-2xl overflow-hidden lg:sticky lg:top-8 shadow-2xl">
              <Box className="px-6 py-5 border-b border-[var(--app-primary)]/10 bg-[var(--app-surface-alt)]">
                <Typography className="font-editorial text-lg font-bold text-[var(--app-text)] tracking-wide">
                  Reservation Summary
                </Typography>
              </Box>

              <Box className="p-6 space-y-4">
                <Box className="flex justify-between items-center text-sm">
                  <Box className="flex items-center gap-2 text-[var(--app-muted)]/70">
                    <AccessTimeIcon className="text-base text-[var(--app-primary)]" />
                    <Typography variant="body2">Total Duration</Typography>
                  </Box>
                  <Typography variant="body2" className="font-semibold text-[var(--app-text)]">
                    {durationText}
                  </Typography>
                </Box>

                <Box className="flex justify-between items-center text-sm">
                  <Box className="flex items-center gap-2 text-[var(--app-muted)]/70">
                    <CalendarMonthIcon className="text-base text-[var(--app-primary)]" />
                    <Typography variant="body2">Ceremonies</Typography>
                  </Box>
                  <Typography variant="body2" className="font-semibold text-[var(--app-text)]">
                    {items.length}
                  </Typography>
                </Box>

                <Divider className="my-4 border-[var(--app-primary)]/10" />

                <Box className="flex justify-between items-baseline mb-6">
                  <Typography className="font-editorial text-base font-bold text-[var(--app-text)]">Total Investment</Typography>
                  <Typography className="font-editorial text-3xl font-bold text-[var(--app-primary)]">
                    ₹{totalPrice}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={onProceedToBook}
                  className="rounded-xl font-bold py-3.5 tracking-widest uppercase transition-all duration-300 hover:brightness-110 shadow-lg"
                >
                  Proceed to Schedule
                </Button>

                <Typography variant="caption" className="block text-center text-[11px] text-[var(--app-muted)]/50 mt-2">
                  Select your artisan specialist & preferred timing
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
