import { Box, Typography, IconButton, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import SlotGrid from "./_components/slot-grid";
import BookingConfirmDialog from "./_components/booking-confirm-dialog";
import PaymentSheetDialog from "./_components/payment-sheet-dialog";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getSlotsAction } from "../../../../features/salon/bookings/get-slots/get-slots.action";
import { createBookingAction } from "../../../../features/salon/bookings/create-booking/create-booking.action";
import { createPaymentAction } from "../../../../features/payments/create-payment/create-payment.action";
import BookingDateSelector from "./_components/booking-date-selector";
import { callSnack } from "../../../../components/snackbar";

interface BookingPanelProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingPanel({ open, onClose, onSuccess }: BookingPanelProps) {
  const dispatch = useAppDispatch();
  const { cartUuid: cartId, items } = useAppSelector((s) => s.cart);

  const [slotsData, setSlotsData] = useState<{ date: string; slots: any[] }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  const totalPrice = items.reduce((sum: number, i: any) => sum + (i.final_price ?? i.base_price ?? 0), 0);
  const totalDuration = items.reduce((sum: number, i: any) => sum + (i.duration ?? 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins} min`;

  if (open && !hasFetched && cartId) {
    setHasFetched(true);
    setSlotsLoading(true);
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    dispatch(getSlotsAction({ cartId, startDate: today, days: 7 }))
      .unwrap()
      .then((result) => {
        const data = result?.message ?? result;
        setSlotsData(data);
        if (data.length > 0) setSelectedDate(data[0].date);
      })
      .catch((err: any) => setSlotsError(typeof err === "string" ? err : "Failed to load slots"))
      .finally(() => setSlotsLoading(false));
  }

  if (!open && hasFetched) {
    setHasFetched(false);
    setSlotsData([]);
    setSlotsError(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  const currentDaySlots = selectedDate ? (slotsData.find((d) => d.date === selectedDate)?.slots ?? []) : [];

  const onConfirmBooking = async () => {
    if (!cartId || !selectedDate || !selectedSlot) return;
    setConfirming(true);
    try {
      const normalizedSlot = {
        ...selectedSlot,
        services: selectedSlot.services.map((s: any) => ({
          service_id: s.service_id,
          staff_id: s.staff_id ?? s.staff_options?.[0],
        })),
      };

      const booking = await dispatch(createBookingAction({ cartId, date: selectedDate, slot: normalizedSlot })).unwrap();

      // Step 2: Create Payment Intent
      const paymentData = await dispatch(createPaymentAction(booking.uuid)).unwrap();

      setClientSecret(paymentData.clientSecret);
      setCreatedBooking(booking);
      setConfirmOpen(false);
      setPaymentOpen(true);

      // We don't call onClose() yet, we wait for payment success
    } catch (err: any) {
      console.error("Booking failed:", err);
      const errorMessage = typeof err === 'string' ? err : err?.message || "Failed to create booking";

      if (errorMessage.toLowerCase().includes("staff is not available") ||
        errorMessage.toLowerCase().includes("slot not available")) {
        callSnack(errorMessage, "error");
      } else {
        callSnack(errorMessage, "error");
      }
      setConfirmOpen(false);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            className:
              "flex flex-col bg-(--app-surface) overflow-hidden rounded-t-[20px] sm:rounded-[20px] sm:mb-3 sm:max-w-[560px] sm:mx-auto max-h-[94dvh] sm:max-h-[88vh] border border-(--app-border)",
          },
          transition: { timeout: 320 },
        }}
        className="[&_.MuiBackdrop-root]:backdrop-blur-sm [&_.MuiBackdrop-root]:bg-black/55"
      >
        <Box className="flex items-center justify-between px-4 sm:px-5 pt-5 pb-4 border-b border-(--app-border) shrink-0">
          <Box>
            <Typography className="font-extrabold text-base text-(--app-text) leading-tight">Select a Time</Typography>
            <Typography className="text-xs text-(--app-muted) mt-0.5">Choose your preferred date & slot</Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            className="bg-(--app-surface-alt) border border-(--app-border) hover:bg-(--app-bg) rounded-[10px]"
          >
            <CloseIcon className="text-(--app-muted) text-base" />
          </IconButton>
        </Box>

        <Box className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slotsError ? (
            <Box className="p-8 text-center">
              <Typography className="text-[13px] text-red-500">{slotsError}</Typography>
            </Box>
          ) : (
            <>
              <Box className="pt-5 pb-4 border-b border-(--app-border)">
                <Typography className="text-[10px] font-bold text-(--app-muted) tracking-[1.5px] uppercase mb-3 px-5 block">
                  Select Date
                </Typography>
                <BookingDateSelector
                  days={slotsData}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  loading={slotsLoading}
                />
              </Box>

              <Box className="pt-5">
                <Typography className="text-[10px] font-bold text-(--app-muted) tracking-[1.5px] uppercase mb-3 px-5 block">
                  Available Times
                </Typography>
                <SlotGrid
                  slots={currentDaySlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  loading={slotsLoading}
                  selectedDate={selectedDate}
                />
              </Box>
            </>
          )}
        </Box>

        <Box className="px-4 sm:px-5 py-5 border-t border-(--app-border) shrink-0 bg-(--app-surface)">
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <AccessTimeIcon className="text-(--app-muted) text-sm" />
              <Typography className="text-[13px] text-(--app-muted)">{durationText}</Typography>
              <Box className="w-1 h-1 rounded-full bg-(--app-border)" />
              <Typography className="text-[13px] text-(--app-muted)">
                {items.length} service{items.length > 1 ? "s" : ""}
              </Typography>
            </Box>
            <Typography className="font-extrabold text-xl text-(--app-text) leading-none">₹{totalPrice}</Typography>
          </Box>

          <Box
            onClick={selectedSlot ? () => setConfirmOpen(true) : undefined}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl transition-colors duration-200 ${selectedSlot
              ? "bg-(--app-primary) hover:brightness-95 cursor-pointer"
              : "bg-(--app-surface-alt) cursor-default"
              }`}
          >
            <Typography
              className={`text-sm font-bold tracking-wide ${selectedSlot ? "text-(--app-primary-contrast)" : "text-(--app-muted)"
                }`}
            >
              {selectedSlot ? "Book Appointment" : "Select a time slot"}
            </Typography>
            {selectedSlot && <ArrowForwardIcon className="text-(--app-primary-contrast) text-base" />}
          </Box>

          <Typography className="text-[11px] text-(--app-muted) text-center mt-2.5 block">
            You'll review details before confirming
          </Typography>
        </Box>
      </Drawer>

      <BookingConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmBooking}
        date={selectedDate}
        slot={selectedSlot}
        totalPrice={totalPrice}
        totalDuration={totalDuration}
        confirming={confirming}
      />

      {clientSecret && createdBooking && (
        <PaymentSheetDialog
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          clientSecret={clientSecret}
          booking={createdBooking}
        />
      )}
    </>
  );
}
