import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { BookingAction, BookingPhase } from "../../../../common/booking.enums";
import { getSlotsAction } from "../../../../features/salon/bookings/get-slots/get-slots.action";
import { createBookingAction } from "../../../../features/salon/bookings/create-booking/create-booking.action";
import { createPaymentAction } from "../../../../features/payments/create-payment/create-payment.action";
import { useStorefrontNavigate } from "../../../../common/hooks/useStorefrontNavigate";
import { callSnack } from "../../../../components/snackbar";
import { calculateTotals } from "../../../../common/cart.utils";
import { formatDuration } from "../../../../common/date.utils";
import BookingConfirmDialog from "./_components/booking-confirm-dialog";
import SlotGrid from "./_components/slot-grid";
import BookingDateSelector from "./_components/booking-date-selector";
import ActiveBookingConflictCard from "./_components/active-booking-conflict-card";
import styles from "./booking-panel.module.css";

interface BookingPanelProps {
  open: boolean;
  onClose: () => void;
}

function SlotPanelContent({
  isConflict,
  slotsError,
  slotsData,
  slotsLoading,
  selectedDate,
  selectedSlot,
  currentDaySlots,
  onSelectDate,
  onSelectSlot,
}: any) {
  if (isConflict) return <ActiveBookingConflictCard />;

  if (slotsError) {
    return (
      <Box className={styles.errorStateBox}>
        <Typography className={styles.errorStateText}>{slotsError}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box className={styles.sectionBlock}>
        <Typography className={styles.sectionLabel}>Select Date</Typography>
        <BookingDateSelector
          days={slotsData}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          loading={slotsLoading}
        />
      </Box>
      <Box className={styles.timeSectionBlock}>
        <Typography className={styles.sectionLabel}>Select Time</Typography>
        <SlotGrid
          slots={currentDaySlots}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          loading={slotsLoading}
          selectedDate={selectedDate}
        />
      </Box>
    </>
  );
}

export default function BookingPanel({ open, onClose }: Readonly<BookingPanelProps>) {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const { cartUuid: cartId, items, salon } = useAppSelector((s) => s.cart);
  const { bookingPhase } = useAppSelector((s) => s.booking);

  const [slotsData, setSlotsData] = useState<{ date: string; slots: any[] }[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isConflict = bookingPhase === BookingPhase.BOOKING_CONFLICT;

  useEffect(() => {
    if (!open || !cartId) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      try {
        const result = await dispatch(getSlotsAction({ cartId, startDate: today, days: 7 })).unwrap();
        const data = result?.message ?? result;
        setSlotsData(data);
        if (data.length > 0) setSelectedDate(data[0].date);
      } catch (err: any) {
        setSlotsError(typeof err === "string" ? err : "Failed to load slots");
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
    setSelectedSlot(null);
    setConfirmOpen(false);

    return () => {
      setSlotsData([]);
      setSlotsError(null);
      setSelectedDate(null);
      setSelectedSlot(null);
    };
  }, [open, cartId, items, dispatch]);

  const { totalPrice, totalDuration } = calculateTotals(items);
  const durationText = formatDuration(totalDuration);
  const currentDaySlots = selectedDate ? (slotsData.find((d) => d.date === selectedDate)?.slots ?? []) : [];

  const handleConfirmSlot = async (paymentPreference: "pay_at_venue" | "partial_deposit" | "full_upfront") => {
    if (!cartId || !selectedDate || !selectedSlot || isCreating || isPaying) return;
    setIsCreating(true);
    try {
      const mappedSlot = {
        ...selectedSlot,
        services: (selectedSlot.services ?? []).map((s: any) => ({
          service_id: s.service_id ?? s.serviceId ?? s.service?.id ?? s.id,
          staff_id: s.staff_id ?? s.staffId ?? s.staff_options?.[0] ?? s.staff?.id,
        })),
      };
      const createResult = await dispatch(
        createBookingAction({ cartId, date: selectedDate, slot: mappedSlot, payment_preference: paymentPreference }),
      ).unwrap();

      if (createResult.action === BookingAction.ACTIVE_BOOKING_EXISTS) {
        setConfirmOpen(false);
        return;
      }

      const booking = createResult.booking;
      if (booking.payment_policy === "pay_at_venue") {
        setConfirmOpen(false);
        onClose();
        navigate("/bookings/success", { state: { bookingUuid: booking.uuid, booking }, replace: true });
        return;
      }

      setIsPaying(true);
      const paymentResult = await dispatch(createPaymentAction(booking.uuid)).unwrap();
      if (paymentResult.clientSecret) {
        setConfirmOpen(false);
        onClose();
        navigate("/checkout");
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : (err?.payload ?? err?.message ?? err?.error?.message ?? "Something went wrong. Please try again.");
      callSnack(errorMessage, "error");
      setConfirmOpen(false);
    } finally {
      setIsCreating(false);
      setIsPaying(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
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
          <Box>
            <Typography className={styles.title}>Select a Time</Typography>
            <Typography className={styles.subtitle}>Choose your preferred date &amp; slot</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" className={styles.closeBtn}>
            <CloseIcon className={styles.closeIcon} />
          </IconButton>
        </Box>

        <Box className={styles.body}>
          <SlotPanelContent
            isConflict={isConflict}
            slotsError={slotsError}
            slotsData={slotsData}
            slotsLoading={slotsLoading}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            currentDaySlots={currentDaySlots}
            onSelectDate={setSelectedDate}
            onSelectSlot={setSelectedSlot}
          />
        </Box>

        {!isConflict && (
          <Box className={styles.footer}>
            <Box className={styles.footerRow}>
              <Box className={styles.metaGroup}>
                <AccessTimeIcon className={styles.metaIcon} />
                <Typography className={styles.metaText}>{durationText}</Typography>
                <Box className={styles.dot} />
                <Typography className={styles.metaText}>
                  {items.length} service{items.length > 1 ? "s" : ""}
                </Typography>
              </Box>
              <Typography className={styles.totalPrice}>₹{totalPrice}</Typography>
            </Box>

            <Box
              onClick={selectedSlot ? () => setConfirmOpen(true) : undefined}
              className={`${styles.actionBtn} ${selectedSlot ? styles.actionBtnActive : styles.actionBtnInactive}`}
            >
              <Typography className={styles.btnText}>
                {selectedSlot ? "Book Appointment" : "Select a time slot"}
              </Typography>
              {selectedSlot && <ArrowForwardIcon className={styles.arrowForwardIcon} />}
            </Box>

            <Typography className={styles.footerNote}>You&apos;ll review details before confirming</Typography>
          </Box>
        )}
      </Drawer>

      <BookingConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSlot}
        date={selectedDate}
        slot={selectedSlot}
        totalPrice={totalPrice}
        salonPaymentPolicy={"pay_at_venue"}
        salonAllowedPaymentPolicies={salon?.allowed_payment_policies}
        salonDepositPercentage={salon?.deposit_percentage}
        totalDuration={totalDuration}
        confirming={isCreating || isPaying}
      />
    </>
  );
}
