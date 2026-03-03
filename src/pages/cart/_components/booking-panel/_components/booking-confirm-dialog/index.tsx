import { Dialog, DialogContent, Box, Typography, CircularProgress } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MONTH_SHORT, WEEKDAY_FULL } from "../../../../../../common/date.constants";

interface BookingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: string | null;
  slot: any | null;
  totalPrice: number;
  totalDuration: number;
  confirming: boolean;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function BookingConfirmDialog({
  open,
  onClose,
  onConfirm,
  date,
  slot,
  totalPrice,
  totalDuration,
  confirming,
}: BookingConfirmDialogProps) {
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins} min`;

  const dateObj = date ? new Date(date) : null;

  return (
    <Dialog
      open={open}
      onClose={!confirming ? onClose : undefined}
      slotProps={{
        paper: {
          className:
            "bg-(--app-surface) overflow-hidden rounded-[20px] w-[calc(100%-24px)] max-w-[420px] mx-auto border border-(--app-border)",
          style: { boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
        },
        backdrop: {
          className: "backdrop-blur-sm bg-black/50",
        },
      }}
    >
      <DialogContent className="p-0">
        <Box className="flex items-center gap-3 px-5 sm:px-6 pt-6 pb-5 border-b border-(--app-border)">
          <Box className="w-9 h-9 rounded-[10px] bg-(--app-primary-soft) border border-(--app-border) flex items-center justify-center shrink-0">
            <CheckCircleOutlineIcon className="text-(--app-primary) text-xl" />
          </Box>
          <Box>
            <Typography className="font-extrabold text-[15px] text-(--app-text) leading-tight">
              Confirm Booking
            </Typography>
            <Typography className="text-xs text-(--app-muted) mt-0.5">Review your appointment details</Typography>
          </Box>
        </Box>

        <Box className="px-5 sm:px-6 py-5 flex flex-col gap-4">
          <Box className="flex items-center gap-3">
            <Box className="w-9 h-9 rounded-[10px] bg-(--app-surface-alt) border border-(--app-border) flex items-center justify-center shrink-0">
              <CalendarMonthIcon className="text-(--app-muted) text-[17px]" />
            </Box>
            <Box>
              <Typography className="text-[10px] text-(--app-muted) font-bold uppercase tracking-[1px] mb-0.5">
                Date
              </Typography>
              <Typography className="text-sm font-bold text-(--app-text)">
                {dateObj
                  ? `${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_SHORT[dateObj.getUTCMonth()]}`
                  : "—"}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-3">
            <Box className="w-9 h-9 rounded-[10px] bg-(--app-surface-alt) border border-(--app-border) flex items-center justify-center shrink-0">
              <AccessTimeIcon className="text-(--app-muted) text-[17px]" />
            </Box>
            <Box>
              <Typography className="text-[10px] text-(--app-muted) font-bold uppercase tracking-[1px] mb-0.5">
                Time
              </Typography>
              <Typography className="text-sm font-bold text-(--app-text)">
                {slot ? `${formatTime(slot.start)} – ${formatTime(slot.end)}` : "—"}
              </Typography>
              <Typography className="text-[11px] text-(--app-muted) mt-0.5">{durationText} total</Typography>
            </Box>
          </Box>

          <Box className="flex items-center justify-between mt-1 px-4 py-4 rounded-xl bg-(--app-surface-alt) border border-(--app-border)">
            <Typography className="text-[13px] text-(--app-muted) font-medium">Total Amount</Typography>
            <Typography className="text-[22px] font-extrabold text-(--app-text) leading-none">₹{totalPrice}</Typography>
          </Box>
        </Box>

        <Box className="px-4 sm:px-6 pb-5 sm:pb-6 flex gap-2.5 sm:gap-3">
          <Box
            onClick={!confirming ? onClose : undefined}
            className={`flex-1 py-3.5 rounded-xl border-[1.5px] border-(--app-border) text-center transition-colors duration-150 ${
              confirming ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-(--app-surface-alt)"
            }`}
          >
            <Typography className="text-[13px] font-semibold text-(--app-muted)">Cancel</Typography>
          </Box>

          <Box
            onClick={!confirming ? onConfirm : undefined}
            className={`flex-2 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-150 ${
              confirming ? "bg-(--app-primary) cursor-default" : "bg-(--app-primary) cursor-pointer hover:brightness-95"
            }`}
          >
            {confirming && <CircularProgress size={15} className="text-(--app-primary-contrast)" />}
            <Typography className="text-[13px] font-bold text-(--app-primary-contrast)">
              {confirming ? "Booking..." : "Confirm Booking"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
