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
      <Box
        onClick={onStartNew}
        className="flex-1 py-3 rounded-xl bg-(--app-primary) text-center cursor-pointer hover:brightness-95 transition-all"
      >
        <Typography className="text-[13px] font-bold text-(--app-primary-contrast)">Start New Booking</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={isBusy ? undefined : onCancel}
        className={`shrink-0 px-5 py-3 rounded-xl border-[1.5px] border-(--app-border) text-center transition-colors ${
          isBusy ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-(--app-surface-alt)"
        }`}
      >
        {isCancelling ? (
          <CircularProgress size={16} className="text-(--app-muted)" />
        ) : (
          <Typography className="text-[13px] font-semibold text-(--app-muted)">Cancel Booking</Typography>
        )}
      </Box>

      <Box
        onClick={onContinue}
        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
          isBusy ? "bg-(--app-primary) cursor-default" : "bg-(--app-primary) cursor-pointer hover:brightness-95"
        }`}
      >
        {isContinuing ? (
          <CircularProgress size={16} className="text-(--app-primary-contrast)" />
        ) : (
          <Typography className="text-[13px] font-bold text-(--app-primary-contrast)">Continue Payment</Typography>
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

  if (!activeBooking) {
    return null;
  }

  const { dateStr, timeStr } = getBookingDateTime(activeBooking);

  const isBusy = isCancelling || isContinuing;
  const progress = getProgress(isExpired, secondsLeft);
  const urgencyColor = getUrgencyColor(urgency);

  const handleContinue = async () => {
    if (isBusy || isExpired) {
      return;
    }

    await handleContinueActiveBooking(activeBooking);
  };

  const handleConfirmCancel = async () => {
    if (isBusy) {
      return;
    }

    await handleCancelActiveBooking(activeBooking.uuid);
    setCancelDialogOpen(false);
  };

  const handleStartNew = () => {
    dispatch(clearActiveBooking());
  };

  return (
    <>
      <Box
        className={`rounded-2xl border overflow-hidden mb-5 sm:mb-6 transition-all duration-300 ${
          isExpired
            ? "border-(--app-border) bg-(--app-surface-alt) opacity-75"
            : "border-(--app-primary)/30 bg-(--app-surface) shadow-[0_4px_20px_var(--app-primary-soft)]"
        }`}
      >
        <Box className="flex items-center gap-2.5 px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
          <Box
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            sx={{
              backgroundColor: isExpired ? "var(--app-surface-alt)" : "var(--app-primary-soft)",
            }}
          >
            {isExpired ? (
              <ErrorOutlineIcon className="text-base" sx={{ color: "var(--app-muted)" }} />
            ) : (
              <BoltIcon className="text-base" sx={{ color: "var(--app-primary)" }} />
            )}
          </Box>

          <Box className="flex-1 min-w-0">
            <Typography className="font-bold text-[13px] text-(--app-text) leading-tight">
              {isExpired ? "Booking Expired" : "You have an active booking"}
            </Typography>
          </Box>

          {!isExpired && (
            <Box
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              sx={{
                backgroundColor: urgency === ExpiryUrgency.CRITICAL ? "rgba(239,68,68,0.1)" : "var(--app-primary-soft)",
                animation: urgency === ExpiryUrgency.CRITICAL ? "countdownPulse 1.5s ease infinite" : "none",
              }}
            >
              <AccessTimeIcon className="text-xs" sx={{ color: urgencyColor }} />

              <Typography className="text-[11px] font-bold tabular-nums" sx={{ color: urgencyColor }}>
                {formattedTime}
              </Typography>
            </Box>
          )}
        </Box>

        <Box className="px-4 sm:px-5 pb-3 flex items-center gap-2 flex-wrap">
          <Box className="flex items-center gap-1">
            <CalendarMonthIcon className="text-xs text-(--app-muted)" />
            <Typography className="text-[12px] text-(--app-muted)">{dateStr}</Typography>
          </Box>

          <Box className="w-1 h-1 rounded-full bg-(--app-border)" />

          <Typography className="text-[12px] text-(--app-muted)">{timeStr}</Typography>

          <Box className="w-1 h-1 rounded-full bg-(--app-border)" />

          <Typography className="text-[12px] font-semibold text-(--app-text)">₹{activeBooking.total_price}</Typography>
        </Box>

        {!isExpired && (
          <Box className="px-4 sm:px-5 pb-3.5">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="rounded-full h-1.5"
              sx={{
                backgroundColor: "var(--app-surface-alt)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: urgencyColor,
                  borderRadius: "999px",
                  transition: "transform 1s linear",
                },
              }}
            />
          </Box>
        )}

        <Box className="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2.5 max-w-sm">
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
