import { useEffect, useRef, useMemo } from "react";
import { Box, Typography, Button, Container, Card, Avatar, Divider, useMediaQuery, useTheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearCart } from "../../features/salon/cart/cart.slice";
import { clearBookingSession } from "../../features/salon/bookings/booking.slice";
import { formatTimeUTC, formatDateUTC } from "../../common/date.utils";
import styles from "./success.module.scss";
import clsx from "clsx";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const hasClearedRef = useRef(false);

  const bookingUuid = location.state?.bookingUuid;
  const booking = location.state?.booking as any;

  const { salon: cartSalon } = useAppSelector((s) => s.cart);
  const initialSalonRef = useRef(booking?.salon || cartSalon);
  const displaySalon = initialSalonRef.current;

  useEffect(() => {
    if (hasClearedRef.current) return;
    hasClearedRef.current = true;
    dispatch(clearCart());
    dispatch(clearBookingSession());
  }, [dispatch]);

  useEffect(() => {
    if (!bookingUuid && !booking) {
      navigate("/bookings", { replace: true });
    }
  }, [bookingUuid, booking, navigate]);

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

  if (!booking) return null;

  return (
    <Box className={styles.successPage}>
      <Box className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.confetti}
            style={{
              left: `${(i / 20) * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor: ["#10b981", "#fbbf24", "#3b82f6", "#f472b6"][i % 4],
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              borderRadius: i % 2 === 0 ? "50%" : "2px",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xs" className="flex-1 flex flex-col justify-center py-2 sm:py-6 px-4 relative z-10">
        <Box className={styles.animateSlideUp}>
          <Card
            elevation={0}
            className="bg-(--app-surface) border border-(--app-border) overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.18)] relative"
          >
            <Box className={styles.cardShine} />

            <Box className="pt-8 pb-5 px-6 text-center bg-linear-to-b from-(--app-surface-alt)/40 to-transparent">
              <Box className="inline-flex items-center justify-center mb-4 relative">
                <Box
                  className={clsx(
                    styles.animateSuccessPop,
                    "w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full bg-(--app-surface) flex items-center justify-center border-[3px] border-[#10b981] relative z-10 shadow-[0_8px_24px_rgba(16,185,129,0.2)]"
                  )}
                >
                  <CheckCircleIcon className="text-[#10b981] text-[32px] sm:text-[38px]" />
                </Box>
                <Box
                  className={clsx("absolute border-2 border-[#10b981] rounded-full -inset-1", styles.animateSuccessRing)}
                />
                <Box
                  className={clsx("absolute border border-[#10b981] rounded-full -inset-1", styles.animateSuccessRing)}
                  style={{ animationDelay: "0.7s" }}
                />
              </Box>

              <Typography
                variant="h5"
                className="font-black text-(--app-text) mb-1 tracking-tight text-[20px] sm:text-[24px] tracking-[-0.02em]"
              >
                Booking Confirmed
              </Typography>
              <Typography className="text-(--app-muted) text-[11px] font-bold uppercase tracking-widest opacity-60">
                Thank you for choosing {displaySalon?.name || "us"}!
              </Typography>
            </Box>

            <Divider className="!border-(--app-border) opacity-30" />

            <Box className="p-5 flex items-center gap-4">
              <Avatar
                src={displaySalon?.logo}
                className="!w-[44px] !h-[44px] !bg-(--app-surface-alt) !border-[1.5px] !border-(--app-border) shrink-0"
              >
                {displaySalon?.name?.charAt(0) || "S"}
              </Avatar>
              <Box className="min-w-0 flex-1 text-left">
                <Typography className="font-black text-[16px] sm:text-[17px] text-(--app-text) leading-tight mb-0.5 truncate">
                  {displaySalon?.name || "Salon App"}
                </Typography>
                <Box className="flex items-start gap-1 opacity-70">
                  <LocationOnIcon className="text-[13px] text-(--app-primary) mt-[1px]" />
                  <Typography className="text-[10px] sm:text-[11px] text-(--app-muted) font-semibold leading-tight line-clamp-1">
                    {displaySalon?.address || "Address in booking history"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="px-5">
              <Divider className="!border-(--app-border) opacity-20" />
            </Box>

            <Box className="p-5 grid grid-cols-2 gap-4">
              <Box className="text-left">
                <Typography className="text-[9px] font-black uppercase tracking-widest text-(--app-muted) opacity-40 mb-1">
                  Appointment
                </Typography>
                <Typography className="font-bold text-[13px] text-(--app-text)">{dateStr}</Typography>
              </Box>
              <Box className="text-right">
                <Typography className="text-[9px] font-black uppercase tracking-widest text-(--app-muted) opacity-40 mb-1">
                  Timing
                </Typography>
                <Typography className="font-bold text-[13px] text-(--app-text)">{timeStr}</Typography>
              </Box>
            </Box>

            <Box className="px-5 pb-5">
              <Box className="bg-(--app-primary)/5 p-3.5 rounded-2xl border border-(--app-primary)/10 flex gap-3 items-start">
                <InfoOutlinedIcon className="text-[18px] text-(--app-primary) mt-[2px]" />
                <Typography className="text-[11px] font-medium text-(--app-text) leading-normal opacity-80 text-left">
                  Please arrive 10 mins early. Manage your booking in profile.
                </Typography>
              </Box>
            </Box>

            <Box className="p-5 bg-(--app-surface-alt)/40 flex items-center justify-between border-t border-(--app-border)">
              <Typography className="text-[10px] font-black text-(--app-muted) uppercase tracking-wider">
                Total Paid
              </Typography>
              <Typography className="text-[22px] sm:text-[26px] font-black text-(--app-primary) flex items-center leading-none">
                <CurrencyRupeeIcon className="text-[18px] -mr-[2px]" />
                {booking.total_price}
              </Typography>
            </Box>
          </Card>

          <Box className="mt-6 sm:mt-10 space-y-3 px-1">
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/bookings", { replace: true })}
              className="!rounded-2xl !py-3.5 sm:!py-4 !font-black !text-[14px] !normal-case !shadow-[0_10px_25px_-5px_rgba(var(--app-primary-rgb),0.4)] hover:!-translate-y-0.5 !transition-transform !duration-200"
            >
              View My Bookings
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate("/salons", { replace: true })}
              className="!rounded-2xl !py-3.5 sm:!py-4 !font-extrabold !text-[14px] !normal-case !border-2 !border-(--app-primary) !text-(--app-primary) !bg-(--app-surface) hover:!bg-(--app-surface-alt) hover:!-translate-y-0.5 !transition-all !duration-200"
            >
              Back to Salons
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
