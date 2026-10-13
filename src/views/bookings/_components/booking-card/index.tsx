import React from "react";
import { Typography, Box, Button, Avatar, CircularProgress } from "@mui/material";
import { CalendarToday, AccessTime, CurrencyRupee, Download } from "@mui/icons-material";
import { formatDateShortUTC, formatDateUTC, formatTimeUTC } from "../../../../common/date.utils";
import type { CustomerBooking } from "../../../../common/booking.types";
import { BookingStatus } from "../../../../common/booking.enums";
import { getBookingStatusConfig, isBookingCancelable, isBookingPast } from "../../../../common/booking.utils";
import dayjs from "dayjs";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./booking-card.module.css";

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
    <Box className={`${styles.card} ${disabled ? styles.cardDisabled : ""}`}>
      <Box className={styles.statusStrip} />
      <Box className={styles.mobileBox}>
        <Box className={styles.mobileInner}>
          <Box className={styles.headerRow}>
            <Box className={styles.salonInfo}>
              <Avatar
                src={booking.salon?.logo}
                variant="rounded"
                className={styles.salonAvatar}
              >
                {booking.salon?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <EllipsisCell
                  value={booking.salon?.name}
                  maxChars={10}
                  className={styles.salonName}
                />
                <br />
                <EllipsisCell
                  value={booking.salon?.address?.split(",")[0] ?? ""}
                  maxChars={30}
                  className={styles.salonAddress}
                />
              </Box>
            </Box>
            <Box
              className={styles.statusPill}
              style={{
                color: statusConfig.color,
                borderColor: `${statusConfig.color}40`,
                backgroundColor: `${statusConfig.color}15`,
              }}
            >
              {statusConfig.label}
            </Box>
          </Box>

          <Box className={styles.detailsBox}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <Typography className={styles.dateTimeText}>
                {formatDateShortUTC(booking.booking_date)} • {formatTimeUTC(booking.booking_start_time)}
              </Typography>
              <EllipsisCell
                value={booking.booking_services?.map((s) => s.service?.name).join(", ")}
                maxChars={30}
                className={styles.servicesText}
              />
            </Box>
            <Typography className={styles.priceText}>₹{booking.total_price}</Typography>
          </Box>

          {(canPay || showCancel || (onDownloadInvoice && booking.status === BookingStatus.CONFIRMED)) && (
            <Box className={styles.actionsRow}>
              {canPay && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onPayNow(booking)}
                  disabled={disabled}
                  className={styles.actionBtnItem}
                >
                  {disabled ? <CircularProgress size={16} color="inherit" /> : "Complete Payment"}
                </Button>
              )}
              {onDownloadInvoice && booking.status === BookingStatus.CONFIRMED && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onDownloadInvoice(booking)}
                  disabled={disabled || downloadingUuid === booking.uuid}
                  startIcon={downloadingUuid === booking.uuid ? <CircularProgress size={14} color="inherit" /> : <Download fontSize="small" />}
                  className={styles.actionBtnItem}
                >
                  Invoice
                </Button>
              )}
              {showCancel && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => onCancel?.(booking)}
                  disabled={disabled || !isCancelableTime}
                  className={styles.actionBtnItem}
                >
                  Cancel
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box className={styles.desktopBox}>
        <Box className={styles.desktopTopRow}>
          <Box className={styles.desktopSalonCol}>
            <Avatar
              src={booking.salon?.logo}
              variant="rounded"
              className={styles.salonAvatarLg}
            >
              {booking.salon?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <EllipsisCell value={booking.salon?.name} maxChars={10} className={styles.salonNameLg} />
              <br />
              <EllipsisCell value={booking.salon?.address || "Flagship Sanctuary"} maxChars={20} className={styles.salonAddressLg} />
            </Box>
          </Box>

          <Box className={styles.desktopMetaRow}>
            {[
              { icon: <CalendarToday className={styles.metaIcon} />, label: "Date", value: formatDateUTC(booking.booking_date) },
              { icon: <AccessTime className={styles.metaIcon} />, label: "Time", value: formatTimeUTC(booking.booking_start_time) },
              {
                icon: <CurrencyRupee className={styles.metaIcon} />,
                label: "Investment",
                value: `₹${booking.total_price}`,
                isPrice: true,
              },
            ].map(({ icon, label, value, isPrice }) => (
              <Box key={label}>
                <Box className={styles.metaLabelRow}>
                  {icon}
                  <Typography className={styles.metaLabel}>{label}</Typography>
                </Box>
                <Typography className={isPrice ? styles.metaPrice : styles.metaValue}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box>
            <Box
              className={styles.statusPillLg}
              style={{
                color: statusConfig.color,
                borderColor: `${statusConfig.color}40`,
                backgroundColor: `${statusConfig.color}15`,
              }}
            >
              {statusConfig.label}
            </Box>
          </Box>
        </Box>

        <Box className={styles.desktopBottomRow}>
          <Box className={styles.ceremoniesRow}>
            <Typography className={styles.ceremoniesLabel}>Ceremonies:</Typography>
            <Box className={styles.ceremoniesList}>
              {booking.booking_services?.map((bs, index) => (
                <EllipsisCell
                  key={bs.id}
                  value={`${bs.service?.name} ${index < (booking.booking_services?.length || 0) - 1 ? " • " : ""}`}
                  maxChars={30}
                  className={styles.ceremonyItem}
                />
              ))}
            </Box>
          </Box>

          <Box className={styles.desktopActions}>
            {canPay && (
              <Button variant="contained" onClick={() => onPayNow(booking)} disabled={disabled}>
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
              <Button variant="contained" color="error" onClick={() => onCancel?.(booking)} disabled={disabled || !isCancelableTime}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
