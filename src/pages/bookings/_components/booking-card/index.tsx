import React from "react";
import { Typography, Box, Button, Avatar, CircularProgress } from "@mui/material";
import { CalendarToday, AccessTime, CurrencyRupee } from "@mui/icons-material";
import { formatDateShortUTC, formatDateUTC, formatTimeUTC } from "../../../../common/date.utils";
import type { CustomerBooking } from "../../../../common/booking.types";
import { BookingStatus } from "../../../../common/booking.enums";
import { getBookingStatusConfig, isBookingCancelable, isBookingPast } from "../../../../common/booking.utils";
import dayjs from "dayjs";

interface BookingCardProps {
  booking: CustomerBooking;
  onPayNow: (booking: CustomerBooking) => void;
  onCancel?: (booking: CustomerBooking) => void;
  disabled?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPayNow, onCancel, disabled }) => {
  const isPending = booking.status === BookingStatus.PENDING;
  const isExpired = booking.expires_at && dayjs(booking.expires_at).isBefore(dayjs());
  const statusConfig = getBookingStatusConfig(isPending && isExpired ? BookingStatus.EXPIRED : booking.status);

  const canPay = isPending && !isExpired;

  const isCancelableTime = isBookingCancelable(booking.booking_start_time);
  const showCancel = ((isPending && !isExpired) || booking.status === BookingStatus.CONFIRMED) && !isBookingPast(booking.booking_start_time);

  return (
    <Box
      className={`group relative mb-4 md:mb-5 rounded-3xl md:rounded-4xl border border-(--app-border) bg-(--app-surface) overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <Box
        className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${statusConfig.bgClass.replace("bg-", "bg-").split("/")[0]}`}
        style={{ backgroundColor: statusConfig.color }}
      />

      <Box className="lg:hidden p-4 md:p-6">
        <Box className="flex flex-col gap-4">
          <Box className="flex items-start justify-between">
            <Box className="flex items-center gap-3 min-w-0">
              <Avatar
                src={booking.salon?.logo}
                variant="rounded"
                className="w-11 h-11 rounded-xl border border-(--app-border) bg-(--app-surface-alt) shadow-sm"
              >
                {booking.salon?.name?.charAt(0)}
              </Avatar>
              <Box className="min-w-0">
                <Typography className="font-black text-[15px] text-(--app-text) leading-tight truncate">
                  {booking.salon?.name}
                </Typography>
                <Typography className="text-[11px] text-(--app-muted) truncate mt-0.5 font-medium">
                  {booking.salon?.address?.split(",")[0]}
                </Typography>
              </Box>
            </Box>
            <Box
              className={`px-3 py-1 rounded-full text-[9.5px] font-black tracking-wider uppercase border ${statusConfig.textClass} ${statusConfig.bgClass}`}
            >
              {statusConfig.label}
            </Box>
          </Box>

          <Box className="flex items-center justify-between bg-(--app-surface-alt)/40 rounded-[18px] p-3.5 border border-(--app-border)/50">
            <Box className="flex flex-col gap-0.5">
              <Typography className="text-[12px] font-bold text-(--app-text) flex items-center gap-1.5">
                {formatDateShortUTC(booking.booking_date)} • {formatTimeUTC(booking.booking_start_time)}
              </Typography>
              <Typography className="text-[10px] text-(--app-muted) font-medium truncate max-w-37.5">
                {booking.booking_services?.map((s) => s.service?.name).join(", ")}
              </Typography>
            </Box>
            <Typography className="text-[16px] font-black text-(--app-primary)">₹{booking.total_price}</Typography>
          </Box>

          {(canPay || showCancel) && (
            <Box className="flex items-center gap-3">
              {canPay && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onPayNow(booking)}
                  disabled={disabled}
                  className="rounded-[14px] py-2.5 font-black bg-(--app-primary) text-(--app-primary-contrast) text-[12px] flex-1 shadow-lg shadow-(--app-primary-soft)/30"
                >
                  {disabled ? <CircularProgress size={16} color="inherit" /> : "Pay Now"}
                </Button>
              )}
              {showCancel && (
                <Button
                  fullWidth={!canPay}
                  variant="outlined"
                  color="error"
                  onClick={() => onCancel?.(booking)}
                  disabled={disabled || !isCancelableTime}
                  className="rounded-[14px] py-2.5 font-bold border-2 text-[12px] flex-1"
                >
                  Cancel
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box className="hidden lg:block p-6">
        <Box className="flex items-center justify-start xl:gap-12 lg:gap-4">
          <Box className="flex items-center gap-4 shrink-0 xl:max-w-75 lg:max-w-55">
            <Avatar
              src={booking.salon?.logo}
              variant="rounded"
              className="w-14 h-14 rounded-[18px] border border-(--app-border) bg-(--app-surface-alt) shadow-sm"
            >
              {booking.salon?.name?.charAt(0)}
            </Avatar>
            <Box className="min-w-0">
              <Typography className="font-black text-[18px] text-(--app-text) leading-tight mb-1 truncate">
                {booking.salon?.name}
              </Typography>
              <Typography className="text-[12.5px] text-(--app-muted) font-medium line-clamp-1 opacity-80">
                {booking.salon?.address || "Location"}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center xl:gap-12 lg:gap-6 min-w-0">
            <Box className="shrink-0">
              <Box className="flex items-center gap-2 mb-1">
                <CalendarToday className="text-[13px] text-(--app-primary)" />
                <Typography className="text-[9.5px] font-black tracking-[1.2px] text-(--app-muted) uppercase">
                  Date
                </Typography>
              </Box>
              <Typography className="text-[14px] font-black text-(--app-text)">
                {formatDateUTC(booking.booking_date)}
              </Typography>
            </Box>

            <Box className="shrink-0">
              <Box className="flex items-center gap-2 mb-1">
                <AccessTime className="text-[13px] text-(--app-primary)" />
                <Typography className="text-[9.5px] font-black tracking-[1.2px] text-(--app-muted) uppercase">
                  Time
                </Typography>
              </Box>
              <Typography className="text-[14px] font-black text-(--app-text)">
                {formatTimeUTC(booking.booking_start_time)}
              </Typography>
            </Box>

            <Box className="shrink-0">
              <Box className="flex items-center gap-2 mb-1">
                <CurrencyRupee className="text-[13px] text-(--app-primary)" />
                <Typography className="text-[9.5px] font-black tracking-[1.2px] text-(--app-muted) uppercase">
                  Amount
                </Typography>
              </Box>
              <Typography className="text-[17px] font-black text-(--app-text)">₹{booking.total_price}</Typography>
            </Box>
          </Box>

          <Box className="ml-auto shrink-0 pl-4">
            <Box
              className={`px-4 py-1.5 rounded-full text-[10.5px] font-black tracking-[1.2px] uppercase border ${statusConfig.textClass} ${statusConfig.bgClass}`}
            >
              {statusConfig.label}
            </Box>
          </Box>
        </Box>

        <Box className="mt-6 pt-4 border-t border-(--app-border)/40 flex items-center justify-between">
          <Box className="flex items-center gap-3 overflow-hidden">
            <Typography className="text-[10px] font-black tracking-[1px] text-(--app-muted) uppercase shrink-0">
              Services Included:
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {booking.booking_services?.map((bs, index) => (
                <Typography key={bs.id} className="text-[12px] font-semibold text-(--app-text) opacity-80">
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
                className="rounded-[14px] px-6 py-2 font-black bg-(--app-primary) text-(--app-primary-contrast) text-[12.5px] shadow-lg shadow-(--app-primary-soft)/20 h-9"
              >
                {disabled ? <CircularProgress size={16} color="inherit" /> : "Pay Now"}
              </Button>
            )}
            {showCancel && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => onCancel?.(booking)}
                disabled={disabled || !isCancelableTime}
                className="rounded-[14px] px-6 py-2 font-bold border-2 text-[12.5px] h-9 hover:bg-rose-50"
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
