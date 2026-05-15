import { Box, Typography, CircularProgress } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAppSelector } from "../../../../../../store/hook";
import { useBookingExpiry } from "../../../../../../common/hooks/useBookingExpiry";
import { ExpiryUrgency } from "../../../../../../common/booking.enums";
import { formatTimeUTC } from "../../../../../../common/date.utils";
import { getUrgencyColor } from "../../../../../../common/booking.utils";
import { useActiveBookingActions } from "../../../../../../common/hooks/useActiveBookingActions";

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
    <Box className="px-5 py-6">
      <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface-alt) p-5 sm:p-6">
        <Box className="flex items-start gap-3 mb-5">
          <Box className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <WarningAmberIcon className="text-amber-500 text-xl" />
          </Box>
          <Box className="flex-1 min-w-0">
            <Typography className="font-bold text-[14px] text-(--app-text) leading-tight">
              You already have a pending booking
            </Typography>
            <Typography className="text-xs text-(--app-muted) mt-1">What would you like to do?</Typography>
          </Box>
        </Box>

        <Box className="rounded-xl bg-(--app-surface) border border-(--app-border) p-3.5 mb-5">
          {timeStr && (
            <Box className="flex items-center gap-2 mb-2">
              <AccessTimeIcon className="text-sm text-(--app-muted)" />
              <Typography className="text-[13px] font-semibold text-(--app-text)">{timeStr}</Typography>
            </Box>
          )}

          {!isExpired && (
            <Box className="flex items-center gap-1.5">
              <Box
                className="w-2 h-2 rounded-full"
                sx={{
                  backgroundColor: urgencyColor,
                  animation: urgency === ExpiryUrgency.CRITICAL ? "countdownPulse 1.5s ease infinite" : "none",
                }}
              />
              <Typography className="text-[12px] font-bold tabular-nums" sx={{ color: urgencyColor }}>
                Expires in {formattedTime}
              </Typography>
            </Box>
          )}

          {isExpired && <Typography className="text-[12px] font-semibold text-red-500">Booking has expired</Typography>}
        </Box>

        <Box className="flex flex-col gap-2.5">
          {!isExpired && (
            <Box
              onClick={handleComplete}
              className={`py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                isBusy ? "bg-(--app-primary) cursor-default" : "bg-(--app-primary) cursor-pointer hover:brightness-95"
              }`}
            >
              {isContinuing ? (
                <CircularProgress size={16} className="text-(--app-primary-contrast)" />
              ) : (
                <Typography className="text-[13px] font-bold text-(--app-primary-contrast)">
                  Complete this booking
                </Typography>
              )}
            </Box>
          )}

          <Box
            onClick={!isBusy ? handleCancel : undefined}
            className={`py-3.5 rounded-xl border-[1.5px] border-(--app-border) text-center transition-colors ${
              isBusy ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-(--app-bg)"
            }`}
          >
            {isCancelling ? (
              <CircularProgress size={16} className="text-(--app-muted)" />
            ) : (
              <Typography className="text-[13px] font-semibold text-(--app-muted)">
                {isExpired ? "Dismiss & book a new slot" : "Cancel & book a new slot"}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
