"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography, Avatar, Skeleton, CircularProgress } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { formatDuration } from "../../common/date.utils";
import { calculateTotals } from "../../common/cart.utils";
import { getDiscountedPrice } from "../../common/discount.utils";
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

import styles from "./cart.module.css";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { items, salon, loaded } = useAppSelector((s) => s.cart);
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { bookingPhase, activeBooking, paymentJustCompleted } = useAppSelector((s) => s.booking);
  const resumeBooking = searchParams?.get("resumeBooking") === "true";

  const [isFetchingCart, setIsFetchingCart] = useState(!loaded && isAuthenticated && !!customer?.uuid);
  const [visibleItemsCount, setVisibleItemsCount] = useState(10);
  const didPaymentJustComplete = useRef(paymentJustCompleted || getPaymentCompleted());

  useEffect(() => {
    if (didPaymentJustComplete.current) {
      setIsFetchingCart(false);
      return;
    }
    if (isAuthenticated && customer?.uuid) {
      if (!loaded) {
        setIsFetchingCart(true);
      }
      dispatch(getCartAction(customer.uuid))
        .unwrap()
        .catch(() => { })
        .finally(() => setIsFetchingCart(false));
    } else {
      setIsFetchingCart(false);
    }
  }, [dispatch, isAuthenticated, customer?.uuid, loaded]);

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
      <Box className={styles.cartContainer}>
        <Skeleton variant="rectangular" height={140} className={styles.cartSkeletonBanner} />
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="rectangular" height={100} className={styles.cartSkeletonItem} />
        ))}
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box className={styles.cartContainer}>
        <Box className={styles.cartWrapper}>
          {activeBooking && <ActiveBookingBanner />}
          <Box className={styles.emptyContainer}>
            <Box className={styles.emptyIconBox}>
              <StorefrontIcon className={styles.emptyStorefrontIcon} />
            </Box>
            <Box>
              <h2 className={styles.emptyTitle}>
                Your Basket is Currently Empty
              </h2>
              <p className={styles.emptySub}>
                Explore our curated menu of hair, skin, and wellness treatments to get started.
              </p>
              <button
                type="button"
                onClick={() => navigate("/services")}
                className={styles.exploreBtn}
              >
                EXPLORE SERVICE MENU
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const { totalPrice, totalDuration } = calculateTotals(items);
  const durationText = formatDuration(totalDuration);

  const totalOriginalPrice = items.reduce((acc, item) => {
    const { originalPrice } = getDiscountedPrice(item);
    return acc + originalPrice;
  }, 0);
  const totalSavings = Math.max(0, totalOriginalPrice - totalPrice);

  return (
    <>
      <Box className={styles.cartContainer}>
        <Box className={styles.cartWrapper}>
          {salon && (
            <Box className={styles.salonBanner}>
              <Box className={styles.bannerContent}>
                <Avatar
                  src={salon.logo}
                  variant="square"
                  className={styles.salonAvatar}
                >
                  {salon.name?.[0]}
                </Avatar>

                <Box className={styles.salonInfo}>
                  <Box className={styles.salonTitleRow}>
                    <EllipsisCell value={salon.name} className={styles.salonName} maxChars={20}/>
                    <Box className={styles.salonBadge}>
                      <Typography className={styles.salonBadgeText}>
                        {(salon.type ?? "SANCTUARY")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.salonLocation}>
                    <PlaceIcon className={styles.locationIcon} />
                    <EllipsisCell value={salon.address} className={styles.locationText} maxChars={20} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {activeBooking && <ActiveBookingBanner />}

          <Box className={styles.sectionHeader}>
            <Typography
              variant="caption"
              className={styles.sectionTitle}
            >
              SELECTED CEREMONIES ({items.length})
            </Typography>
          </Box>

          <Box className={styles.cartGrid}>
            <Box className={styles.itemList}>
              <InfiniteScroll
                dataLength={items.slice(0, visibleItemsCount).length}
                next={() => setVisibleItemsCount((prev) => prev + 10)}
                hasMore={visibleItemsCount < items.length}
                loader={
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                }
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {items.slice(0, visibleItemsCount).map((item: any) => (
                    <CartItem key={item.uuid ?? item.service_id} item={item} />
                  ))}
                </Box>
              </InfiniteScroll>
            </Box>

            <Box className={styles.summaryCard}>
              <Box className={styles.summaryHeader}>
                <Typography className={styles.summaryTitle}>
                  Booking Summary
                </Typography>
              </Box>

              <Box className={styles.summaryBody}>
                <Box className={styles.summaryRow}>
                  <Box className={styles.rowLabel}>
                    <AccessTimeIcon className={styles.rowIcon} />
                    <span>Estimated Total Duration</span>
                  </Box>
                  <span className={styles.rowValue}>{durationText}</span>
                </Box>

                <Box className={styles.summaryRow}>
                  <Box className={styles.rowLabel}>
                    <CalendarMonthIcon className={styles.rowIcon} />
                    <span>Selected Treatments</span>
                  </Box>
                  <span className={styles.rowValue}>{items.length}</span>
                </Box>

                <hr className={styles.summaryDivider} />

                {totalSavings > 0 && (
                  <Box className={styles.discountRow}>
                    <span className={styles.discountSavingsLabel}>Discount Savings</span>
                    <span className={styles.discountSavingsValue}>
                      -₹{totalSavings}
                    </span>
                  </Box>
                )}

                <Box className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total Investment</span>
                  <Box className={styles.totalPriceGroup}>
                    {totalSavings > 0 && (
                      <span className={styles.totalOriginalCrossed}>
                        ₹{totalOriginalPrice}
                      </span>
                    )}
                    <span className={styles.totalValue}>
                      ₹{totalPrice}
                    </span>
                  </Box>
                </Box>

                <button
                  type="button"
                  onClick={onProceedToBook}
                  className={styles.checkoutBtn}
                >
                  PROCEED TO SCHEDULE
                </button>

                <p className={styles.helperText}>
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

