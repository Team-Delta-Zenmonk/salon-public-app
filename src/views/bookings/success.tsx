"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, Typography, Button, Container, Card, Avatar, Divider, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSearchParams } from "next/navigation";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearBookingSession } from "../../features/salon/bookings/booking.slice";
import { getBookingAction } from "../../features/salon/bookings/get-booking/get-booking.action";
import { confirmPaymentAction } from "../../features/payments/confirm-payment/confirm-payment.action";
import { formatTimeUTC, formatDateUTC } from "../../common/date.utils";
import { callSnack } from "../../components/snackbar";
import styles from "./success.module.scss";

const BookingSuccess: React.FC = () => {
  const navigate = useStorefrontNavigate();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const searchBookingUuid = searchParams?.get("bookingUuid");
  const { currentBooking } = useAppSelector((s) => s.booking);

  const bookingUuid = searchBookingUuid || currentBooking?.uuid;
  const booking = currentBooking;

  const [isLoading, setIsLoading] = useState(!booking && Boolean(bookingUuid));
  const hasFetchedRef = useRef(false);

  const { salon } = useStorefront();

  useEffect(() => {
    if (hasFetchedRef.current) return;

    if (!bookingUuid && !booking) {
      callSnack("No active booking found.", "info");
      navigate("/cart", { replace: true });
      return;
    }

    if (!bookingUuid) return;

    hasFetchedRef.current = true;

    const syncBooking = async () => {
      const paymentIntentId = searchParams?.get("payment_intent");
      const redirectStatus = searchParams?.get("redirect_status");

      if (paymentIntentId && redirectStatus === "succeeded") {
        try {
          await dispatch(confirmPaymentAction({ paymentIntentId })).unwrap();
        } catch (e) {
          console.warn("Redirect payment confirmation error:", e);
        }
      }

      if (!booking) {
        setIsLoading(true);
      }

      try {
        await dispatch(getBookingAction(bookingUuid)).unwrap();
      } catch (err: any) {
        if (!booking) {
          const errorMessage =
            typeof err === "string"
              ? err
              : (err?.payload ?? err?.message ?? "Unable to load booking details.");
          callSnack(errorMessage, "error");
          navigate("/cart", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    syncBooking();
  }, [bookingUuid, booking, dispatch, navigate, searchParams]);

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

  const amountPaidOnline = Number(
    booking.amount_paid_online || (booking.payment_policy !== "pay_at_venue" ? booking.deposit_amount : 0) || 0,
  );
  const toPayAtVenue = Math.max(0, Number(booking.total_price || 0) - amountPaidOnline);

  const paymentTitle =
    booking.payment_policy === "pay_at_venue"
      ? "Pay at Venue"
      : booking.payment_policy === "partial_deposit"
        ? "Partial Deposit"
        : "Full Payment";

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
                Thank you for choosing {salon?.name || "us"}!
              </Typography>
            </Box>

            <Divider className={styles.cardDivider} />

            <Box className={styles.salonRow}>
              <Avatar
                src={salon?.logo}
                className={styles.salonAvatar}
              >
                {salon?.name?.charAt(0) || "S"}
              </Avatar>
              <Box className={styles.salonInfo}>
                <Typography className={styles.salonName}>
                  {salon?.name || "Salon App"}
                </Typography>
                <Box className={styles.addressRow}>
                  <LocationOnIcon className={styles.locationIcon} />
                  <Typography className={styles.addressText}>
                    {salon?.address || "Address in booking history"}
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
