"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, Avatar, Skeleton } from "@mui/material";
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
import { usePathname, useSearchParams } from "next/navigation";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { callSnack } from "../../components/snackbar";
import EllipsisCell from "@/components/ellipse-cell";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { items, salon, loaded } = useAppSelector((s) => s.cart);
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { bookingPhase, activeBooking, paymentJustCompleted } = useAppSelector((s) => s.booking);
  const resumeBooking = searchParams?.get("resumeBooking") === "true";

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
        .catch(() => { })
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
    if (!resumeBooking || !isAuthenticated || !loaded || items.length === 0) return;

    dispatch(setBookingPhase(BookingPhase.SLOT_SELECTION));
    navigate(pathname || "/cart", { replace: true });
  }, [resumeBooking, isAuthenticated, loaded, items.length, navigate, pathname, dispatch]);

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
      },
    });
  };

  if (isFetchingCart || !loaded) {
    return (
      <Box className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-6">
        <Skeleton variant="rectangular" height={140} className="rounded-[2px]" />
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="rectangular" height={100} className="rounded-[2px]" />
        ))}
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box className="flex flex-col items-center justify-center p-12 md:p-20 text-center gap-4 bg-[#FCF9F3] min-h-[60vh]">
        <Box className="w-16 h-16 rounded-[2px] bg-[#F2EEE7] border border-[#E5DFD5] flex items-center justify-center">
          <StorefrontIcon className="text-[28px] text-[#766A5E]" />
        </Box>
        <Box>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1C1A17] font-medium">
            Your Basket is Currently Empty
          </h2>
          <p className="font-sans text-xs text-[#766A5E] mt-2 max-w-sm mx-auto leading-relaxed">
            Explore our curated menu of hair, skin, and wellness treatments to get started.
          </p>
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="mt-6 px-6 py-3 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-[#1C1A17] text-[#FCFAF7] border-0 cursor-pointer"
          >
            EXPLORE SERVICE MENU
          </button>
        </Box>
      </Box>
    );
  }

  const { totalPrice, totalDuration } = calculateTotals(items);
  const durationText = formatDuration(totalDuration);

  return (
    <>
      <Box className="bg-[#FCF9F3] min-h-screen text-[#1C1C18] p-6 md:p-12 font-sans">
        <Box className="w-full max-w-[1440px] mx-auto">
          {salon && (
            <Box className="relative rounded-[2px] overflow-hidden mb-8 bg-[#FCFAF7] border border-[#E5DFD5] p-6 sm:p-8">
              <Box className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar
                  src={salon.logo}
                  variant="square"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] border border-[#E5DFD5] bg-[#F2EEE7] text-[#1C1A17] font-serif shrink-0 text-xl"
                >
                  {salon.name?.[0]}
                </Avatar>

                <Box className="flex-1 min-w-0">
                  <Box className="flex items-center gap-3 mb-1 flex-wrap">
                    <EllipsisCell value={salon.name} className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1A17] tracking-tight capitalize" maxChars={20}/>
                    <Box className="px-2.5 py-0.5 rounded-[2px] bg-[#F2EEE7] border border-[#E5DFD5]">
                      <Typography className="text-[#766A5E] text-[10px] font-semibold tracking-widest uppercase">
                        {(salon.type ?? "SANCTUARY")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center gap-2 text-xs text-[#766A5E]">
                    <PlaceIcon className="text-sm text-[#A88B64]" />
                    <EllipsisCell value={salon.address} className="text-xs text-[#766A5E] capitalize" maxChars={20} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {activeBooking && <ActiveBookingBanner />}

          <Box className="flex items-center justify-between mb-6 border-b border-[#E5DFD5] pb-4">
            <Typography
              variant="caption"
              className="font-sans text-xs font-semibold text-[#1C1A17] tracking-[0.14em] uppercase"
            >
              SELECTED CEREMONIES ({items.length})
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
            <Box className="space-y-4">
              {items.map((item: any) => (
                <CartItem key={item.uuid ?? item.service_id} item={item} />
              ))}
            </Box>

            <Box className="bg-[#FCFAF7] border border-[#E5DFD5] rounded-[2px] overflow-hidden lg:sticky lg:top-28 shadow-xs">
              <Box className="px-6 py-5 border-b border-[#E5DFD5] bg-[#F6F3ED]">
                <Typography className="font-serif text-xl font-medium text-[#1C1A17] tracking-wide">
                  Reservation Investment Summary
                </Typography>
              </Box>

              <Box className="p-6 space-y-4">
                <Box className="flex justify-between items-center text-xs text-[#766A5E]">
                  <Box className="flex items-center gap-2">
                    <AccessTimeIcon className="text-sm text-[#A88B64]" />
                    <span>Estimated Total Duration</span>
                  </Box>
                  <span className="font-semibold text-[#1C1A17]">{durationText}</span>
                </Box>

                <Box className="flex justify-between items-center text-xs text-[#766A5E]">
                  <Box className="flex items-center gap-2">
                    <CalendarMonthIcon className="text-sm text-[#A88B64]" />
                    <span>Selected Treatments</span>
                  </Box>
                  <span className="font-semibold text-[#1C1A17]">{items.length}</span>
                </Box>

                <hr className="my-4 border-[#E5DFD5]" />

                <Box className="flex justify-between items-baseline mb-6">
                  <span className="font-serif text-base font-medium text-[#1C1A17]">Total Investment</span>
                  <span className="font-serif text-3xl font-medium text-[#1C1A17]">
                    ₹{totalPrice}
                  </span>
                </Box>

                <button
                  type="button"
                  onClick={onProceedToBook}
                  className="w-full bg-[#1C1A17] hover:bg-[#2E2A25] text-[#FCFAF7] py-3.5 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer transition-all border-0"
                >
                  PROCEED TO SCHEDULE & ARTISAN
                </button>

                <p className="block text-center text-[10px] text-[#766A5E] uppercase tracking-wider mt-2">
                  Select your specialist & preferred timing slot
                </p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <BookingPanel open={bookingPanelOpen} onClose={() => dispatch(setBookingPhase(BookingPhase.IDLE))} />
    </>
  );
}

