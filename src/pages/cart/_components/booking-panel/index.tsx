import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SlotGrid from "./_components/slot-grid";
import BookingConfirmDialog from "./_components/booking-confirm-dialog";
import ActiveBookingConflictCard from "./_components/active-booking-conflict-card";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { formatDuration } from "../../../../common/date.utils";
import { calculateTotals } from "../../../../common/cart.utils";
import { getSlotsAction } from "../../../../features/salon/bookings/get-slots/get-slots.action";
import { createBookingAction } from "../../../../features/salon/bookings/create-booking/create-booking.action";
import { createPaymentAction } from "../../../../features/payments/create-payment/create-payment.action";
import { BookingAction, BookingPhase, AsyncStatus } from "../../../../common/booking.enums";
import BookingDateSelector from "./_components/booking-date-selector";
import { callSnack } from "../../../../components/snackbar";
import { useNavigate } from "react-router-dom";

interface BookingPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingPanel({ open, onClose }: BookingPanelProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartUuid: cartId, items } = useAppSelector((s) => s.cart);
  const { bookingPhase } = useAppSelector((s) => s.booking);

  const [slotsData, setSlotsData] = useState<{ date: string; slots: any[] }[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
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
      // Cleanup on close
      setSlotsData([]);
      setSlotsError(null);
      setSelectedDate(null);
      setSelectedSlot(null);
    };
  }, [open, cartId, dispatch]);

  const { totalPrice, totalDuration } = calculateTotals(items);

  const durationText = formatDuration(totalDuration);

  const currentDaySlots = selectedDate ? (slotsData.find((d) => d.date === selectedDate)?.slots ?? []) : [];

  const handleConfirmSlot = async () => {
    if (!cartId || !selectedDate || !selectedSlot || isCreating || isPaying) return;

    setIsCreating(true);
    setLocalError(null);

    try {
      const mappedSlot = {
        ...selectedSlot,
        services: (selectedSlot.services || []).map((s: any) => ({
          service_id: s.service_id ?? s.serviceId ?? s.service?.id ?? s.id,
          staff_id: s.staff_id ?? s.staffId ?? (s.staff_options && s.staff_options[0]) ?? s.staff?.id,
        })),
      };

      const createResult = await dispatch(
        createBookingAction({
          cartId,
          date: selectedDate,
          slot: mappedSlot,
        }),
      ).unwrap();

      if (createResult.action === BookingAction.ACTIVE_BOOKING_EXISTS) {
        setConfirmOpen(false);
        return;
      }

      setIsPaying(true);
      const paymentResult = await dispatch(createPaymentAction(createResult.booking.uuid)).unwrap();

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
          {isConflict ? (
            <ActiveBookingConflictCard />
          ) : slotsError ? (
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

        {!isConflict && (
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
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl transition-colors duration-200 ${
                selectedSlot
                  ? "bg-(--app-primary) hover:brightness-95 cursor-pointer"
                  : "bg-(--app-surface-alt) cursor-default"
              }`}
            >
              <Typography
                className={`text-sm font-bold tracking-wide ${
                  selectedSlot ? "text-(--app-primary-contrast)" : "text-(--app-muted)"
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
        )}
      </Drawer>

      <BookingConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSlot}
        date={selectedDate}
        slot={selectedSlot}
        totalPrice={totalPrice}
        totalDuration={totalDuration}
        confirming={isCreating || isPaying}
      />
    </>
  );
}
