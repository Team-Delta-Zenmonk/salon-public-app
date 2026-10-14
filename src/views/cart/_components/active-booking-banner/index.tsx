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
          <CircularProgress size={16} className={styles.cancelSpinner} />
        ) : (
          <Typography className={styles.cancelBtnText}>Cancel Booking</Typography>
        )}
      </Box>

      <Box onClick={onContinue} className={`${styles.continueBtn} ${isBusy ? styles.btnDisabledCursor : ""}`}>
        {isContinuing ? (
          <CircularProgress size={16} className={styles.continueSpinner} />
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
            className={`${styles.iconBox} ${isExpired ? styles.iconBoxExpired : styles.iconBoxActive}`}
          >
            {isExpired ? (
              <ErrorOutlineIcon className={styles.bannerIconExpired} />
            ) : (
              <BoltIcon className={styles.bannerIconActive} />
            )}
          </Box>

          <Box className={styles.titleCol}>
            <Typography className={styles.title}>
              {isExpired ? "Booking Expired" : "You have an active booking"}
            </Typography>
          </Box>

          {!isExpired && (
            <Box
              className={`${styles.timerBadge} ${urgency === ExpiryUrgency.CRITICAL ? styles.timerBadgeCritical : styles.timerBadgeNormal}`}
            >
              <AccessTimeIcon className={`${styles.timerIcon} ${urgency === ExpiryUrgency.CRITICAL ? styles.urgencyCritical : urgency === ExpiryUrgency.WARNING ? styles.urgencyWarning : styles.urgencyNormal}`} />
              <Typography className={`${styles.timerText} ${urgency === ExpiryUrgency.CRITICAL ? styles.urgencyCritical : urgency === ExpiryUrgency.WARNING ? styles.urgencyWarning : styles.urgencyNormal}`}>
                {formattedTime}
              </Typography>
            </Box>
          )}
        </Box>

        <Box className={styles.metaRow}>
          <Box className={styles.metaGroup}>
            <CalendarMonthIcon className={styles.metaCalendarIcon} />
            <Typography className={styles.metaDateText}>{dateStr}</Typography>
          </Box>
          <Box className={styles.metaDot} />
          <Typography className={styles.metaTimeText}>{timeStr}</Typography>
          <Box className={styles.metaDot} />
          <Typography className={styles.metaPriceText}>₹{activeBooking.total_price}</Typography>
        </Box>

        {!isExpired && (
          <Box className={styles.progressWrapper}>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={`${styles.linearProgressBar} ${urgency === ExpiryUrgency.CRITICAL ? styles.linearProgressCritical : urgency === ExpiryUrgency.WARNING ? styles.linearProgressWarning : styles.linearProgressNormal}`}
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
