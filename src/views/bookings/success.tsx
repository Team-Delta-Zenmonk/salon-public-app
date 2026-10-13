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
    if (!booking && bookingUuid) {
      setIsLoading(true);
      dispatch(getBookingAction(bookingUuid))
        .unwrap()
        .catch((err: any) => {
          const errorMessage =
            typeof err === "string"
              ? err
              : (err?.payload ?? err?.message ?? "Unable to load booking details.");
          callSnack(errorMessage, "error");
          navigate("/cart", { replace: true });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!bookingUuid && !booking) {
      callSnack("No booking found. Redirecting to cart.", "error");
      navigate("/cart", { replace: true });
    }
  }, [bookingUuid, booking, dispatch, navigate]);

  const handleNavigateAway = (path: string) => {
    dispatch(clearBookingSession());
    navigate(path, { replace: true });
  };

  const dateStr = useMemo(
    () => (booking?.booking_date ? formatDateUTC(booking.booking_date) : "Date not available"),
    [booking?.booking_date],
  );

  const CONFETTI_ITEMS = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${(i / 20) * 100}%`,
        animationDelay: `${((i * 13) % 50) / 10}s`,
        backgroundColor: ["#10b981", "#fbbf24", "#3b82f6", "#f472b6"][i % 4],
        width: `${((i * 7) % 10) + 5}px`,
        height: `${((i * 7) % 10) + 5}px`,
        borderRadius: i % 2 === 0 ? "50%" : "2px",
      })),
    []
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
            <CircularProgress sx={{ color: "var(--app-primary)" }} size={44} thickness={4} />
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
        {CONFETTI_ITEMS.map((item) => (
          <div
            key={item.id}
            className={styles.confetti}
            style={{
              left: item.left,
              animationDelay: item.animationDelay,
              backgroundColor: item.backgroundColor,
              width: item.width,
              height: item.height,
              borderRadius: item.borderRadius,
            }}
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
                  className={`${styles.animateSuccessRing} ${styles.ringAbs}`}
                  style={{ animationDelay: "0.7s" }}
                />
              </Box>

              <Typography variant="h5" className={styles.confirmedTitle}>
                Booking Confirmed
              </Typography>
              <Typography className={styles.thankyouText}>
                Thank you for choosing {displaySalon?.name || "us"}!
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "var(--app-border)", opacity: 0.5 }} />

            <Box className={styles.salonRow}>
              <Avatar
                src={displaySalon?.logo}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "var(--app-surface-alt)",
                  border: "1.5px solid var(--app-border)",
                  color: "var(--app-text)",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {displaySalon?.name?.charAt(0) || "S"}
              </Avatar>
              <Box className={styles.salonInfo}>
                <Typography className={styles.salonName}>
                  {displaySalon?.name || "Salon App"}
                </Typography>
                <Box className={styles.addressRow}>
                  <LocationOnIcon sx={{ fontSize: 13, color: "var(--app-primary)", mt: "1px" }} />
                  <Typography className={styles.addressText}>
                    {displaySalon?.address || "Address in booking history"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className={styles.dividerPad}>
              <Divider sx={{ borderColor: "var(--app-border)", opacity: 0.4 }} />
            </Box>

            <Box className={styles.dateTimeGrid}>
              <Box>
                <Typography className={styles.gridLabel}>Appointment</Typography>
                <Typography className={styles.gridValue}>{dateStr}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography className={styles.gridLabel}>Timing</Typography>
                <Typography className={styles.gridValue}>{timeStr}</Typography>
              </Box>
            </Box>

            <Box className={styles.infoPad}>
              <Box className={styles.infoBox}>
                <InfoOutlinedIcon sx={{ fontSize: 18, color: "var(--app-primary)", mt: "2px" }} />
                <Typography className={styles.infoText}>
                  Please arrive 10 mins early. Manage your booking in profile.
                </Typography>
              </Box>
            </Box>

            <Box className={styles.paymentSummary}>
              <Box className={styles.paymentRow}>
                <Typography className={styles.paymentLabel}>Amount Paid Online</Typography>
                <Typography className={styles.paymentAmountOnline}>
                  <CurrencyRupeeIcon sx={{ fontSize: 14, marginRight: "-2px" }} />
                  {booking.amount_paid_online ?? booking.deposit_amount ?? 0}
                </Typography>
              </Box>
              <Box className={styles.paymentRow}>
                <Typography className={styles.paymentLabel}>To Pay at Venue</Typography>
                <Typography className={styles.paymentAmountVenue}>
                  <CurrencyRupeeIcon sx={{ fontSize: 14, marginRight: "-2px" }} />
                  {booking.total_price - (booking.amount_paid_online ?? booking.deposit_amount ?? 0)}
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
              sx={{
                borderRadius: "1rem",
                py: 1.75,
                fontWeight: 900,
                fontSize: 14,
                textTransform: "none",
                bgcolor: "var(--app-primary)",
                color: "var(--app-primary-contrast)",
                "&:hover": {
                  bgcolor: "var(--app-primary-hover, var(--app-primary))",
                  filter: "brightness(0.92)",
                },
              }}
            >
              View My Bookings
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleNavigateAway("/")}
              sx={{
                borderRadius: "1rem",
                py: 1.75,
                fontWeight: 800,
                fontSize: 14,
                textTransform: "none",
                borderWidth: 2,
                borderColor: "var(--app-border)",
                color: "var(--app-text)",
                bgcolor: "var(--app-surface)",
                "&:hover": {
                  bgcolor: "var(--app-surface-alt)",
                  borderColor: "var(--app-primary)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
              }}
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
