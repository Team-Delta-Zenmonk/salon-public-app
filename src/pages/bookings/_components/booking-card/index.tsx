import React from "react";
import { Typography, Box, Button, Avatar, CircularProgress } from "@mui/material";
import { CalendarToday, AccessTime, CurrencyRupee, Download } from "@mui/icons-material";
import { formatDateShortUTC, formatDateUTC, formatTimeUTC } from "../../../../common/date.utils";
import type { CustomerBooking } from "../../../../common/booking.types";
import { BookingStatus } from "../../../../common/booking.enums";
import { getBookingStatusConfig, isBookingCancelable, isBookingPast } from "../../../../common/booking.utils";
import dayjs from "dayjs";

interface BookingCardProps {
  booking: CustomerBooking;
  onPayNow: (booking: CustomerBooking) => void;
  onCancel?: (booking: CustomerBooking) => void;
  onDownloadInvoice?: (booking: CustomerBooking) => void;
  downloadingUuid?: string | null;
  disabled?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPayNow,
  onCancel,
  onDownloadInvoice,
  downloadingUuid,
  disabled,
}) => {
  const isPending = booking.status === BookingStatus.PENDING;
  const isExpired = booking.expires_at && dayjs(booking.expires_at).isBefore(dayjs());
  const statusConfig = getBookingStatusConfig(isPending && isExpired ? BookingStatus.EXPIRED : booking.status);

  const canPay = isPending && !isExpired;

  const isCancelableTime = isBookingCancelable(booking.booking_start_time);
  const showCancel = ((isPending && !isExpired) || booking.status === BookingStatus.CONFIRMED) && !isBookingPast(booking.booking_start_time);

  return (
    <Box
      className={`group relative mb-5 rounded-2xl border border-[var(--app-primary)]/15 bg-[var(--app-surface)] overflow-hidden transition-all duration-300 hover:border-[var(--app-primary)]/40 shadow-xl ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <Box
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: statusConfig.color }}
      />

      <Box className="lg:hidden p-5">
        <Box className="flex flex-col gap-4">
          <Box className="flex items-start justify-between">
            <Box className="flex items-center gap-3 min-w-0">
              <Avatar
                src={booking.salon?.logo}
                variant="rounded"
                className="w-12 h-12 rounded-xl border border-[var(--app-primary)]/20 bg-[var(--app-bg)]"
              >
                {booking.salon?.name?.charAt(0)}
              </Avatar>
              <Box className="min-w-0">
                <Typography className="font-editorial text-base font-bold text-[var(--app-text)] leading-tight truncate capitalize">
                  {booking.salon?.name}
                </Typography>
                <Typography className="text-xs text-[var(--app-muted)]/70 truncate mt-0.5 capitalize">
                  {booking.salon?.address?.split(",")[0]}
                </Typography>
              </Box>
            </Box>
            <Box
              className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border"
              style={{ color: statusConfig.color, borderColor: `${statusConfig.color}40`, backgroundColor: `${statusConfig.color}15` }}
            >
              {statusConfig.label}
            </Box>
          </Box>

          <Box className="flex items-center justify-between bg-[var(--app-bg)] rounded-xl p-4 border border-[var(--app-primary)]/10">
            <Box className="flex flex-col gap-1">
              <Typography className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                {formatDateShortUTC(booking.booking_date)} • {formatTimeUTC(booking.booking_start_time)}
              </Typography>
              <Typography className="text-[11px] text-[var(--app-muted)]/70 truncate max-w-48">
                {booking.booking_services?.map((s) => s.service?.name).join(", ")}
              </Typography>
            </Box>
            <Typography className="font-editorial text-lg font-bold text-[var(--app-primary)]">₹{booking.total_price}</Typography>
          </Box>

          {(canPay || showCancel || (onDownloadInvoice && booking.status === BookingStatus.CONFIRMED)) && (
            <Box className="flex items-center gap-3">
              {canPay && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onPayNow(booking)}
                  disabled={disabled}
                >
                  {disabled ? <CircularProgress size={16} color="inherit" /> : "Complete Payment"}
                </Button>
              )}
              {onDownloadInvoice && booking.status === BookingStatus.CONFIRMED && (
                <Button
                  fullWidth={!canPay && !showCancel}
                  variant="contained"
                  onClick={() => onDownloadInvoice(booking)}
                  disabled={disabled || downloadingUuid === booking.uuid}
                  startIcon={downloadingUuid === booking.uuid ? <CircularProgress size={14} color="inherit" /> : <Download fontSize="small" />}
                >
                  Invoice
                </Button>
              )}
              {showCancel && (
                <Button
                  fullWidth={!canPay}
                  variant="contained"
                  color="error"
                  onClick={() => onCancel?.(booking)}
                  disabled={disabled || !isCancelableTime}
                >
                  Cancel
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box className="hidden lg:block p-6">
        <Box className="flex items-center justify-between gap-6">
          <Box className="flex items-center gap-4 min-w-0 max-w-sm">
            <Avatar
              src={booking.salon?.logo}
              variant="rounded"
              className="w-14 h-14 rounded-xl border border-[var(--app-primary)]/20 bg-[var(--app-bg)]"
            >
              {booking.salon?.name?.charAt(0)}
            </Avatar>
            <Box className="min-w-0">
              <Typography className="font-editorial text-lg font-bold text-[var(--app-text)] leading-tight mb-1 truncate capitalize">
                {booking.salon?.name}
              </Typography>
              <Typography className="text-xs text-[var(--app-muted)]/70 truncate capitalize">
                {booking.salon?.address || "Flagship Sanctuary"}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-8 min-w-0">
            <Box>
              <Box className="flex items-center gap-1.5 mb-1">
                <CalendarToday className="text-xs text-[var(--app-primary)]" />
                <Typography className="text-[10px] font-mono font-bold tracking-widest text-[var(--app-primary)]/70 uppercase">
                  Date
                </Typography>
              </Box>
              <Typography className="text-sm font-bold text-[var(--app-text)]">
                {formatDateUTC(booking.booking_date)}
              </Typography>
            </Box>

            <Box>
              <Box className="flex items-center gap-1.5 mb-1">
                <AccessTime className="text-xs text-[var(--app-primary)]" />
                <Typography className="text-[10px] font-mono font-bold tracking-widest text-[var(--app-primary)]/70 uppercase">
                  Time
                </Typography>
              </Box>
              <Typography className="text-sm font-bold text-[var(--app-text)]">
                {formatTimeUTC(booking.booking_start_time)}
              </Typography>
            </Box>

            <Box>
              <Box className="flex items-center gap-1.5 mb-1">
                <CurrencyRupee className="text-xs text-[var(--app-primary)]" />
                <Typography className="text-[10px] font-mono font-bold tracking-widest text-[var(--app-primary)]/70 uppercase">
                  Investment
                </Typography>
              </Box>
              <Typography className="font-editorial text-xl font-bold text-[var(--app-primary)]">₹{booking.total_price}</Typography>
            </Box>
          </Box>

          <Box>
            <Box
              className="px-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border"
              style={{ color: statusConfig.color, borderColor: `${statusConfig.color}40`, backgroundColor: `${statusConfig.color}15` }}
            >
              {statusConfig.label}
            </Box>
          </Box>
        </Box>

        <Box className="mt-5 pt-4 border-t border-[var(--app-primary)]/10 flex items-center justify-between">
          <Box className="flex items-center gap-3 overflow-hidden">
            <Typography className="text-[10px] font-mono font-bold tracking-widest text-[var(--app-primary)]/70 uppercase shrink-0">
              Ceremonies:
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {booking.booking_services?.map((bs, index) => (
                <Typography key={bs.id} className="text-xs font-medium text-[var(--app-muted)]/80">
                  {bs.service?.name}
                  {index < (booking.booking_services?.length || 0) - 1 ? " • " : ""}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box className="flex gap-3 shrink-0 ml-6">
            {canPay && (
              <Button
                variant="contained"
                onClick={() => onPayNow(booking)}
                disabled={disabled}
              >
                {disabled ? <CircularProgress size={16} color="inherit" /> : "Complete Payment"}
              </Button>
            )}
            {onDownloadInvoice && booking.status === BookingStatus.CONFIRMED && (
              <Button
                variant="contained"
                onClick={() => onDownloadInvoice(booking)}
                disabled={disabled || downloadingUuid === booking.uuid}
                startIcon={downloadingUuid === booking.uuid ? <CircularProgress size={14} color="inherit" /> : <Download fontSize="small" />}
              >
                Invoice
              </Button>
            )}
            {showCancel && (
              <Button
                variant="contained"
                color="error"
                onClick={() => onCancel?.(booking)}
                disabled={disabled || !isCancelableTime}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
