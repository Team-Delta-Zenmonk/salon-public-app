import { Box, Typography, IconButton, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import SlotGrid from "./_components/slot-grid";
import BookingConfirmDialog from "./_components/booking-confirm-dialog";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getSlotsAction } from "../../../../features/salon/bookings/get-slots/get-slots.action";
import { createBookingAction } from "../../../../features/salon/bookings/create-booking/create-booking.action";
import BookingDateSelector from "./_components/booking-date-selector";

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
      await dispatch(createBookingAction({ cartId, date: selectedDate, slot: selectedSlot })).unwrap();
      setConfirmOpen(false);
      onClose();
      onSuccess();
    } catch {
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
              "flex flex-col bg-white overflow-hidden rounded-t-[20px] sm:rounded-[20px] sm:mb-3 sm:max-w-[520px] sm:mx-auto max-h-[92dvh] sm:max-h-[88vh]",
            style: { boxShadow: "0 -4px 40px rgba(0,0,0,0.12), 0 0 0 1px #e2e8f0" },
          },
          transition: { timeout: 320 },
        }}
        className="[&_.MuiBackdrop-root]:backdrop-blur-sm [&_.MuiBackdrop-root]:bg-black/55"
      >
        <Box className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <Box>
            <Typography className="font-extrabold text-base text-slate-900 leading-tight">Select a Time</Typography>
            <Typography className="text-xs text-slate-400 mt-0.5">Choose your preferred date & slot</Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            className="bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-[10px]"
          >
            <CloseIcon className="text-slate-500 text-base" />
          </IconButton>
        </Box>

        <Box className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slotsError ? (
            <Box className="p-8 text-center">
              <Typography className="text-[13px] text-red-500">{slotsError}</Typography>
            </Box>
          ) : (
            <>
              <Box className="pt-5 pb-4 border-b border-slate-50">
                <Typography className="text-[10px] font-bold text-slate-400 tracking-[1.5px] uppercase mb-3 px-5 block">
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
                <Typography className="text-[10px] font-bold text-slate-400 tracking-[1.5px] uppercase mb-3 px-5 block">
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

        <Box className="px-5 py-5 border-t border-slate-100 shrink-0 bg-white">
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <AccessTimeIcon className="text-slate-400 text-sm" />
              <Typography className="text-[13px] text-slate-500">{durationText}</Typography>
              <Box className="w-1 h-1 rounded-full bg-slate-300" />
              <Typography className="text-[13px] text-slate-500">
                {items.length} service{items.length > 1 ? "s" : ""}
              </Typography>
            </Box>
            <Typography className="font-extrabold text-xl text-slate-900 leading-none">₹{totalPrice}</Typography>
          </Box>

          <Box
            onClick={selectedSlot ? () => setConfirmOpen(true) : undefined}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl transition-colors duration-200 ${
              selectedSlot ? "bg-slate-900 hover:bg-slate-800 cursor-pointer" : "bg-slate-200 cursor-default"
            }`}
          >
            <Typography className={`text-sm font-bold tracking-wide ${selectedSlot ? "text-white" : "text-slate-400"}`}>
              {selectedSlot ? "Book Appointment" : "Select a time slot"}
            </Typography>
            {selectedSlot && <ArrowForwardIcon className="text-white text-base" />}
          </Box>

          <Typography className="text-[11px] text-slate-400 text-center mt-2.5 block">
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
    </>
  );
}
