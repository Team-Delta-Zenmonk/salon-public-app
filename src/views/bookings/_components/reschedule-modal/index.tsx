import React, { useEffect, useState } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { CustomerBooking } from "../../../../common/booking.types";
import BookingDateSelector from "../../../cart/_components/booking-panel/_components/booking-date-selector";
import SlotGrid from "../../../cart/_components/booking-panel/_components/slot-grid";
import { useAppDispatch } from "../../../../store/hook";
import {
  getBookingSlotsAction,
  rescheduleBookingAction,
} from "../../../../features/salon/bookings/reschedule-booking/reschedule-booking.action";
import { formatDateShortUTC, formatTimeUTC, formatDuration } from "../../../../common/date.utils";
import styles from "./reschedule-modal.module.css";

interface RescheduleModalProps {
  open: boolean;
  booking: CustomerBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  booking,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  const [daysData, setDaysData] = useState<{ date: string; slots: any[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const todayStr = toLocalDateStr(new Date());

  const maxAttempts = booking?.max_reschedule_attempts ?? 2;
  const rescheduleCount = booking?.reschedule_count ?? 0;
  const currentAttempt = rescheduleCount + 1;

  useEffect(() => {
    if (open && booking) {
      setSelectedDate(todayStr);
      setSelectedSlot(null);
      setErrorMsg(null);
      setLoadingSlots(true);

      dispatch(
        getBookingSlotsAction({
          bookingUuid: booking.uuid,
          startDate: todayStr,
          days: 7,
        })
      )
        .unwrap()
        .then((res: any) => {
          const slotDays = res?.data || [];
          setDaysData(slotDays);
          const firstDayWithSlots = slotDays.find((d: any) => d.slots && d.slots.length > 0);
          if (firstDayWithSlots) {
            setSelectedDate(firstDayWithSlots.date);
          } else {
            setSelectedDate(todayStr);
          }
        })
        .catch((err: any) => {
          setErrorMsg(err || "Failed to load slots for rescheduling");
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    } else {
      setDaysData([]);
      setSelectedDate(null);
      setSelectedSlot(null);
      setErrorMsg(null);
    }
  }, [open, booking, dispatch, todayStr]);

  const activeDaySlots = daysData.find((d) => d.date === selectedDate)?.slots || [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setErrorMsg(null);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!booking || !selectedSlot || !selectedDate || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await dispatch(
        rescheduleBookingAction({
          bookingUuid: booking.uuid,
          payload: {
            date: selectedDate,
            slot: {
              start: selectedSlot.start,
              end: selectedSlot.end,
            },
          },
        })
      ).unwrap();

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err || "Failed to reschedule booking. Please try another slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) return null;

  const servicesCount = booking.booking_services?.length ?? 1;
  const totalDuration = booking.total_duration || 0;
  const durationText = formatDuration(totalDuration);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      slotProps={{
        paper: { className: styles.drawerPaper },
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.55)",
          },
        },
      }}
    >
      <Box className={styles.header}>
        <Box className={styles.titleWrapper}>
          <Typography className={styles.title}>Reschedule Booking</Typography>
          <Typography className={styles.subtitle}>
            {booking.salon?.name ? `${booking.salon.name} • ` : ""}
            Currently: {formatDateShortUTC(booking.booking_date)} at {formatTimeUTC(booking.booking_start_time)}
            {` • Attempt ${currentAttempt} out of ${maxAttempts}`}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={isSubmitting}
          size="small"
          className={styles.closeBtn}
        >
          <CloseIcon className={styles.closeIcon} />
        </IconButton>
      </Box>

      <Box className={styles.body}>
        {errorMsg && (
          <Alert severity="error" className={styles.errorAlert}>
            {errorMsg}
          </Alert>
        )}

        <Box className={styles.sectionBlock}>
          <Typography className={styles.sectionLabel}>Select Date</Typography>
          <BookingDateSelector
            days={daysData}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            loading={loadingSlots}
          />
        </Box>

        <Box className={styles.timeSectionBlock}>
          <Box className={styles.slotHeaderRow}>
            <Typography className={styles.slotSectionLabel}>Available Slots</Typography>
            <Typography className={styles.attemptBadge}>
              Reschedule: {currentAttempt} out of {maxAttempts}
            </Typography>
          </Box>
          <SlotGrid
            slots={activeDaySlots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelect}
            loading={loadingSlots}
            selectedDate={selectedDate}
          />
        </Box>
      </Box>

      <Box className={styles.footer}>
        <Box className={styles.footerRow}>
          <Box className={styles.metaGroup}>
            <AccessTimeIcon className={styles.metaIcon} />
            <Typography className={styles.metaText}>{durationText}</Typography>
            <Box className={styles.dot} />
            <Typography className={styles.metaText}>
              {servicesCount} service{servicesCount > 1 ? "s" : ""}
            </Typography>
          </Box>
          <Typography className={styles.totalPrice}>₹{booking.total_price}</Typography>
        </Box>

        <Box
          onClick={selectedSlot && !isSubmitting ? handleSubmit : undefined}
          className={`${styles.actionBtn} ${
            selectedSlot && !isSubmitting ? styles.actionBtnActive : styles.actionBtnInactive
          }`}
        >
          {isSubmitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <>
              <Typography className={styles.btnText}>
                {selectedSlot
                  ? `Confirm Reschedule (${formatTimeUTC(selectedSlot.start)} – ${formatTimeUTC(selectedSlot.end)})`
                  : "Select a time slot"}
              </Typography>
              {selectedSlot && <ArrowForwardIcon className={styles.arrowForwardIcon} />}
            </>
          )}
        </Box>

        <Typography className={styles.footerNote}>
          Reschedule attempt {currentAttempt} out of {maxAttempts}
        </Typography>
      </Box>
    </Drawer>
  );
};
