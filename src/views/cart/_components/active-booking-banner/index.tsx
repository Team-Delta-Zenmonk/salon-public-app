import { useState } from "react";
import { Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BoltIcon from "@mui/icons-material/Bolt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useBookingExpiry } from "../../../../common/hooks/useBookingExpiry";
import { clearActiveBooking } from "../../../../features/salon/bookings/booking.slice";
import { ExpiryUrgency } from "../../../../common/booking.enums";
import { WEEKDAY_FULL, MONTH_SHORT } from "../../../../common/date.constants";
import { ConfirmationDialog } from "../../../../components/dialogs";
import { formatTimeUTC } from "../../../../common/date.utils";
import { getUrgencyColor } from "../../../../common/booking.utils";
import { useActiveBookingActions } from "../../../../common/hooks/useActiveBookingActions";
import styles from "./active-booking-banner.module.css";

interface BookingActionButtonsProps {
  isExpired: boolean;
  isBusy: boolean;
  isCancelling: boolean;
  isContinuing: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onStartNew: () => void;
}

const TOTAL_SECONDS = 600;

const getBookingDateTime = (activeBooking: any) => {
  const dateObj = activeBooking.booking_date ? new Date(activeBooking.booking_date) : null;
  return {
    dateStr: dateObj
      ? `${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_SHORT[dateObj.getUTCMonth()]}`
      : "",
    timeStr:
      activeBooking.booking_start_time && activeBooking.booking_end_time
        ? `${formatTimeUTC(activeBooking.booking_start_time)} – ${formatTimeUTC(activeBooking.booking_end_time)}`
        : "",
  };
};

const getProgress = (isExpired: boolean, secondsLeft: number) =>
  isExpired ? 0 : Math.min(100, (secondsLeft / TOTAL_SECONDS) * 100);

function BookingActionButtons({
  isExpired,
  isBusy,
  isCancelling,
  isContinuing,
  onCancel,
  onContinue,
  onStartNew,
}: Readonly<BookingActionButtonsProps>) {
  if (isExpired) {
    return (
      <Box onClick={onStartNew} className={styles.continueBtn}>
        <Typography className={styles.continueBtnText}>Start New Booking</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={isBusy ? undefined : onCancel}
        className={`${styles.cancelBtn} ${isBusy ? styles.btnDisabled : ""}`}
      >
        {isCancelling ? (
          <CircularProgress size={16} sx={{ color: "var(--app-muted)" }} />
        ) : (
          <Typography className={styles.cancelBtnText}>Cancel Booking</Typography>
        )}
      </Box>

      <Box onClick={onContinue} className={`${styles.continueBtn} ${isBusy ? styles.btnDisabledCursor : ""}`}>
        {isContinuing ? (
          <CircularProgress size={16} sx={{ color: "var(--app-primary-contrast)" }} />
        ) : (
          <Typography className={styles.continueBtnText}>Continue Payment</Typography>
        )}
      </Box>
    </>
  );
}

export default function ActiveBookingBanner() {
  const dispatch = useAppDispatch();
  const { activeBooking } = useAppSelector((state) => state.booking);
  const { handleCancelActiveBooking, handleContinueActiveBooking, isCancelling, isContinuing } =
    useActiveBookingActions();
  const { formattedTime, isExpired, secondsLeft, urgency } = useBookingExpiry(activeBooking?.expires_at);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  if (!activeBooking) return null;

  const { dateStr, timeStr } = getBookingDateTime(activeBooking);
  const isBusy = isCancelling || isContinuing;
  const progress = getProgress(isExpired, secondsLeft);
  const urgencyColor = getUrgencyColor(urgency);

  const handleContinue = async () => {
    if (isBusy || isExpired) return;
    await handleContinueActiveBooking(activeBooking);
  };

  const handleConfirmCancel = async () => {
    if (isBusy) return;
    await handleCancelActiveBooking(activeBooking.uuid);
    setCancelDialogOpen(false);
  };

  const handleStartNew = () => {
    dispatch(clearActiveBooking());
  };

  return (
    <>
      <Box
        className={`${styles.bannerCard} ${isExpired ? styles.bannerExpired : styles.bannerActive}`}
      >
        <Box className={styles.bannerHeader}>
          <Box
            className={styles.iconBox}
            sx={{ backgroundColor: isExpired ? "var(--app-surface-alt)" : "var(--app-primary-soft)" }}
          >
            {isExpired ? (
              <ErrorOutlineIcon sx={{ fontSize: "1rem", color: "var(--app-muted)" }} />
            ) : (
              <BoltIcon sx={{ fontSize: "1rem", color: "var(--app-primary)" }} />
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography className={styles.title}>
              {isExpired ? "Booking Expired" : "You have an active booking"}
            </Typography>
          </Box>

          {!isExpired && (
            <Box
              className={styles.timerBadge}
              sx={{
                backgroundColor: urgency === ExpiryUrgency.CRITICAL ? "rgba(239,68,68,0.1)" : "var(--app-primary-soft)",
                animation: urgency === ExpiryUrgency.CRITICAL ? "countdownPulse 1.5s ease infinite" : "none",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "0.75rem", color: urgencyColor }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: urgencyColor }}>
                {formattedTime}
              </Typography>
            </Box>
          )}
        </Box>

        <Box className={styles.metaRow}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <CalendarMonthIcon sx={{ fontSize: "0.75rem", color: "var(--app-muted)" }} />
            <Typography sx={{ fontSize: 12, color: "var(--app-muted)" }}>{dateStr}</Typography>
          </Box>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "var(--app-border)" }} />
          <Typography sx={{ fontSize: 12, color: "var(--app-muted)" }}>{timeStr}</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "var(--app-border)" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--app-text)" }}>₹{activeBooking.total_price}</Typography>
        </Box>

        {!isExpired && (
          <Box className={styles.progressWrapper}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                borderRadius: "9999px",
                height: 6,
                backgroundColor: "var(--app-surface-alt)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: urgencyColor,
                  borderRadius: "9999px",
                  transition: "transform 1s linear",
                },
              }}
            />
          </Box>
        )}

        <Box className={styles.actionsWrapper}>
          <BookingActionButtons
            isExpired={isExpired}
            isBusy={isBusy}
            isCancelling={isCancelling}
            isContinuing={isContinuing}
            onCancel={() => setCancelDialogOpen(true)}
            onContinue={handleContinue}
            onStartNew={handleStartNew}
          />
        </Box>
      </Box>

      <ConfirmationDialog
        open={cancelDialogOpen}
        title="Cancel Current Booking?"
        description="Are you sure you want to cancel your incomplete booking? This slot will be released and you will need to select a new one."
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        color="error"
        loading={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelDialogOpen(false)}
      />
    </>
  );
}
