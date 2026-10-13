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
            <WarningAmberIcon sx={{ color: "#f59e0b", fontSize: "1.25rem" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography className={styles.title}>
              You already have a pending booking
            </Typography>
            <Typography className={styles.subtitle}>What would you like to do?</Typography>
          </Box>
        </Box>

        <Box className={styles.detailsBox}>
          {timeStr && (
            <Box className={styles.timeRow}>
              <AccessTimeIcon sx={{ fontSize: "0.875rem", color: "var(--app-muted)" }} />
              <Typography className={styles.timeText}>{timeStr}</Typography>
            </Box>
          )}

          {!isExpired && (
            <Box className={styles.timerRow}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: urgencyColor,
                  animation: urgency === ExpiryUrgency.CRITICAL ? "countdownPulse 1.5s ease infinite" : "none",
                }}
              />
              <Typography sx={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: urgencyColor }}>
                Expires in {formattedTime}
              </Typography>
            </Box>
          )}

          {isExpired && (
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>
              Booking has expired
            </Typography>
          )}
        </Box>

        <Box className={styles.actionsColumn}>
          {!isExpired && (
            <Box
              onClick={handleComplete}
              className={styles.completeBtn}
              sx={{
                opacity: isBusy ? 0.7 : 1,
                cursor: isBusy ? "default" : "pointer",
              }}
            >
              {isContinuing ? (
                <CircularProgress size={16} sx={{ color: "var(--app-primary-contrast)" }} />
              ) : (
                <Typography className={styles.btnText}>
                  Complete this booking
                </Typography>
              )}
            </Box>
          )}

          <Box
            onClick={isBusy ? undefined : handleCancel}
            className={styles.cancelBtn}
            sx={{
              opacity: isBusy ? 0.5 : 1,
              cursor: isBusy ? "default" : "pointer",
            }}
          >
            {isCancelling ? (
              <CircularProgress size={16} sx={{ color: "var(--app-muted)" }} />
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
