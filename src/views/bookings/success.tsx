"use client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { Box, Typography, Button, Container, Card, Avatar, Divider, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSearchParams } from "next/navigation";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearCart } from "../../features/salon/cart/cart.slice";
import { clearBookingSession } from "../../features/salon/bookings/booking.slice";
import { getBookingAction } from "../../features/salon/bookings/get-booking/get-booking.action";
import { formatTimeUTC, formatDateUTC } from "../../common/date.utils";
import { callSnack } from "../../components/snackbar";
import styles from "./success.module.scss";

const BookingSuccess: React.FC = () => {
  const navigate = useStorefrontNavigate();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasClearedRef = useRef(false);

  const searchBookingUuid = searchParams?.get("bookingUuid");
  const { currentBooking } = useAppSelector((s) => s.booking);

  const bookingUuid = searchBookingUuid || currentBooking?.uuid;
  const booking = currentBooking;

  const [isLoading, setIsLoading] = useState(!booking && !!bookingUuid);

  const { salon: cartSalon } = useAppSelector((s) => s.cart);
  const initialSalonRef = useRef(booking?.salon || cartSalon);
  const displaySalon = booking?.salon || initialSalonRef.current;

  useEffect(() => {
    if (hasClearedRef.current) return;
    hasClearedRef.current = true;
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    if (!bookingUuid && !booking) {
      callSnack("No booking found. Redirecting to cart.", "error");
      navigate("/cart", { replace: true });
      return;
    }

    if (bookingUuid) {
      if (!booking) {
        setIsLoading(true);
      }
      dispatch(getBookingAction(bookingUuid))
        .unwrap()
        .catch((err: any) => {
          if (!booking) {
            const errorMessage =
              typeof err === "string"
                ? err
                : (err?.payload ?? err?.message ?? "Unable to load booking details.");
            callSnack(errorMessage, "error");
            navigate("/cart", { replace: true });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [bookingUuid, dispatch, navigate]);

  const handleNavigateAway = (path: string) => {
    dispatch(clearBookingSession());
    navigate(path, { replace: true });
  };

  const dateStr = useMemo(
    () => (booking?.booking_date ? formatDateUTC(booking.booking_date) : "Date not available"),
    [booking?.booking_date],
  );

  const timeStr = useMemo(() => {
    if (booking?.booking_start_time && booking?.booking_end_time) {
      return `${formatTimeUTC(booking.booking_start_time)} - ${formatTimeUTC(booking.booking_end_time)}`;
    }
    return "Time not available";
  }, [booking?.booking_start_time, booking?.booking_end_time]);

  const { paymentTitle, amountPaidOnline, toPayAtVenue } = useMemo(() => {
    const totalPrice = Number(booking?.total_price || 0);
    const policy = booking?.payment_policy;
    const isFullUpfront = policy === "full_upfront";
    const isPayAtVenue = policy === "pay_at_venue";

    let paidOnline = 0;
    if (typeof booking?.amount_paid_online === "number" && booking.amount_paid_online > 0) {
      paidOnline = booking.amount_paid_online;
    } else if (isFullUpfront) {
      paidOnline = totalPrice;
    } else if (!isPayAtVenue && typeof booking?.deposit_amount === "number") {
      paidOnline = booking.deposit_amount;
    }

    const remainingVenue = Math.max(0, totalPrice - paidOnline);

    let title = "Full Payment";
    if (isPayAtVenue) {
      title = "Pay at Venue";
    } else if (policy === "partial_deposit") {
      title = "Partial Deposit";
    } else if (isFullUpfront) {
      title = "Full Payment";
    }

    return {
      paymentTitle: title,
      amountPaidOnline: paidOnline,
      toPayAtVenue: remainingVenue,
    };
  }, [booking?.total_price, booking?.payment_policy, booking?.amount_paid_online, booking?.deposit_amount]);

  if (isLoading || !booking) {
    return (
      <Box className={styles.successPage}>
        <Container maxWidth="xs" className={styles.container}>
          <Box className={styles.loadingWrapper}>
            <CircularProgress className={styles.loadingSpinner} size={44} thickness={4} />
            <Box>
              <Typography className={styles.loadingTitle}>
                Confirming Your Booking...
              </Typography>
              <Typography className={styles.loadingSubtitle}>
                Fetching your appointment details
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={styles.successPage}>
      <Box className={styles.confettiOverlay}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`${styles.confetti} ${styles[`confetti${i}` as keyof typeof styles]}`}
          />
        ))}
      </Box>

      <Container maxWidth="xs" className={styles.container}>
        <Box className={styles.animateSlideUp}>
          <Card elevation={0} className={styles.card}>
            <Box className={styles.cardShine} />

            <Box className={styles.cardHeader}>
              <Box className={styles.iconWrapper}>
                <Box className={`${styles.animateSuccessPop} ${styles.iconCircle}`}>
                  <CheckCircleIcon className={styles.checkIcon} />
                </Box>
                <Box className={`${styles.animateSuccessRing} ${styles.ringAbs}`} />
                <Box
                  className={`${styles.animateSuccessRing} ${styles.ringAbs} ${styles.ringAbsDelayed}`}
                />
              </Box>

              <Typography variant="h5" className={styles.confirmedTitle}>
                Booking Confirmed
              </Typography>
              <Typography className={styles.thankyouText}>
                Thank you for choosing {displaySalon?.name || "us"}!
              </Typography>
            </Box>

            <Divider className={styles.cardDivider} />

            <Box className={styles.salonRow}>
              <Avatar
                src={displaySalon?.logo}
                className={styles.salonAvatar}
              >
                {displaySalon?.name?.charAt(0) || "S"}
              </Avatar>
              <Box className={styles.salonInfo}>
                <Typography className={styles.salonName}>
                  {displaySalon?.name || "Salon App"}
                </Typography>
                <Box className={styles.addressRow}>
                  <LocationOnIcon className={styles.locationIcon} />
                  <Typography className={styles.addressText}>
                    {displaySalon?.address || "Address in booking history"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className={styles.dividerPad}>
              <Divider className={styles.cardDividerLight} />
            </Box>

            <Box className={styles.dateTimeGrid}>
              <Box>
                <Typography className={styles.gridLabel}>Appointment</Typography>
                <Typography className={styles.gridValue}>{dateStr}</Typography>
              </Box>
              <Box className={styles.timingCol}>
                <Typography className={styles.gridLabel}>Timing</Typography>
                <Typography className={styles.gridValue}>{timeStr}</Typography>
              </Box>
            </Box>

            <Box className={styles.infoPad}>
              <Box className={styles.infoBox}>
                <InfoOutlinedIcon className={styles.infoIcon} />
                <Typography className={styles.infoText}>
                  Please arrive 10 mins early. Manage your booking in profile.
                </Typography>
              </Box>
            </Box>

            <Box className={styles.paymentSummary}>
              <Box className={styles.paymentHeader}>
                <Typography className={styles.paymentPlanTitle}>
                  {paymentTitle}
                </Typography>
                <Typography className={styles.paymentPlanBadge}>
                  Payment Summary
                </Typography>
              </Box>
              <Box className={styles.paymentRow}>
                <Typography className={styles.paymentLabel}>Amount Paid Online</Typography>
                <Typography className={styles.paymentAmountOnline}>
                  <CurrencyRupeeIcon className={styles.rupeeIcon} />
                  {amountPaidOnline}
                </Typography>
              </Box>
              <Box className={styles.paymentRow}>
                <Typography className={styles.paymentLabel}>To Pay at Venue</Typography>
                <Typography className={styles.paymentAmountVenue}>
                  <CurrencyRupeeIcon className={styles.rupeeIcon} />
                  {toPayAtVenue}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Box className={styles.ctaGroup}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleNavigateAway("/bookings")}
              className={styles.viewBookingsBtn}
            >
              View My Bookings
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleNavigateAway("/")}
              className={styles.backStorefrontBtn}
            >
              Back to Salon Storefront
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingSuccess;
