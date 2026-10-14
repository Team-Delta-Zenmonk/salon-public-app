import { Box, Typography, CircularProgress } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAppSelector } from "../../../../../../store/hook";
import { useBookingExpiry } from "../../../../../../common/hooks/useBookingExpiry";
import { ExpiryUrgency } from "../../../../../../common/booking.enums";
import { formatTimeUTC } from "../../../../../../common/date.utils";
import { getUrgencyColor } from "../../../../../../common/booking.utils";
import { useActiveBookingActions } from "../../../../../../common/hooks/useActiveBookingActions";
import styles from "./active-booking-conflict-card.module.css";

export default function ActiveBookingConflictCard() {
  const { activeBooking } = useAppSelector((state) => state.booking);
  const { handleCancelActiveBooking, handleContinueActiveBooking, isCancelling, isContinuing } =
    useActiveBookingActions();
  const { formattedTime, isExpired, urgency } = useBookingExpiry(activeBooking?.expires_at);

  if (!activeBooking) return null;

  const timeStr =
    activeBooking.booking_start_time && activeBooking.booking_end_time
      ? `${formatTimeUTC(activeBooking.booking_start_time)} – ${formatTimeUTC(activeBooking.booking_end_time)}`
      : "";

  const isBusy = isCancelling || isContinuing;

  const urgencyColor = getUrgencyColor(urgency);

  const handleComplete = async () => {
    if (isBusy || isExpired || !activeBooking) return;
    await handleContinueActiveBooking(activeBooking);
  };

  const handleCancel = async () => {
    if (isBusy || !activeBooking) return;
    await handleCancelActiveBooking(activeBooking.uuid);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.headerRow}>
          <Box className={styles.warningIconBox}>
            <WarningAmberIcon className={styles.warningAmberIcon} />
          </Box>
          <Box className={styles.headerTextCol}>
            <Typography className={styles.title}>
              You already have a pending booking
            </Typography>
            <Typography className={styles.subtitle}>What would you like to do?</Typography>
          </Box>
        </Box>

        <Box className={styles.detailsBox}>
          {timeStr && (
            <Box className={styles.timeRow}>
              <AccessTimeIcon className={styles.timeIcon} />
              <Typography className={styles.timeText}>{timeStr}</Typography>
            </Box>
          )}

          {!isExpired && (
            <Box className={styles.timerRow}>
              <Box
                className={`${styles.timerDot} ${urgency === ExpiryUrgency.CRITICAL ? styles.timerDotCritical : urgency === ExpiryUrgency.WARNING ? styles.timerDotWarning : styles.timerDotNormal}`}
              />
              <Typography className={`${styles.timerText} ${urgency === ExpiryUrgency.CRITICAL ? styles.urgencyCritical : urgency === ExpiryUrgency.WARNING ? styles.urgencyWarning : styles.urgencyNormal}`}>
                Expires in {formattedTime}
              </Typography>
            </Box>
          )}

          {isExpired && (
            <Typography className={styles.expiredText}>
              Booking has expired
            </Typography>
          )}
        </Box>

        <Box className={styles.actionsColumn}>
          {!isExpired && (
            <Box
              onClick={handleComplete}
              className={`${styles.completeBtn} ${isBusy ? styles.btnBusy : ""}`}
            >
              {isContinuing ? (
                <CircularProgress size={16} className={styles.completeSpinner} />
              ) : (
                <Typography className={styles.btnText}>
                  Complete this booking
                </Typography>
              )}
            </Box>
          )}

          <Box
            onClick={isBusy ? undefined : handleCancel}
            className={`${styles.cancelBtn} ${isBusy ? styles.btnBusyCancel : ""}`}
          >
            {isCancelling ? (
              <CircularProgress size={16} className={styles.cancelSpinner} />
            ) : (
              <Typography className={styles.btnTextSecondary}>
                {isExpired ? "Dismiss & book a new slot" : "Cancel & book a new slot"}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
