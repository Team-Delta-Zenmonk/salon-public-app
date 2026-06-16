import { Dialog, DialogContent, Box, Typography, CircularProgress, Radio } from "@mui/material";
import { useState, useEffect } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MONTH_SHORT, WEEKDAY_FULL } from "../../../../../../common/date.constants";
import { formatTimeUTC, formatDuration } from "../../../../../../common/date.utils";

interface BookingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentPreference: "pay_at_venue" | "partial_deposit" | "full_upfront") => void;
  date: string | null;
  slot: any;
  totalPrice: number;
  salonPaymentPolicy: string;
  salonDepositPercentage?: number | null;
  totalDuration: number;
  confirming: boolean;
}

export default function BookingConfirmDialog({
  open,
  onClose,
  onConfirm,
  date,
  slot,
  totalPrice,
  salonPaymentPolicy,
  salonDepositPercentage,
  totalDuration,
  confirming,
}: Readonly<BookingConfirmDialogProps>) {
  const durationText = formatDuration(totalDuration);
  const dateObj = date ? new Date(date) : null;

  const defaultSelection =
    salonPaymentPolicy === "full_upfront" ? "full_upfront" :
    salonPaymentPolicy === "partial_deposit" ? "partial_deposit" :
    "pay_at_venue";

  const [selectedPayment, setSelectedPayment] = useState<"pay_at_venue" | "partial_deposit" | "full_upfront">(defaultSelection);

  useEffect(() => {
    setSelectedPayment(defaultSelection);
  }, [salonPaymentPolicy, open]);

  const partialDepositAmount = salonDepositPercentage ? Math.round(totalPrice * (salonDepositPercentage / 100)) : 0;
  
  let currentDepositAmount = 0;
  if (selectedPayment === "partial_deposit") currentDepositAmount = partialDepositAmount;
  else if (selectedPayment === "full_upfront") currentDepositAmount = totalPrice;

  const isPayAtVenueDisabled = salonPaymentPolicy === "partial_deposit" || salonPaymentPolicy === "full_upfront";
  const isPartialDepositDisabled = salonPaymentPolicy === "pay_at_venue" || salonPaymentPolicy === "full_upfront";

  return (
    <Dialog
      open={open}
      onClose={confirming ? undefined : onClose}
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
                {slot ? `${formatTimeUTC(slot.start)} – ${formatTimeUTC(slot.end)}` : "—"}
              </Typography>
              <Typography className="text-[11px] text-(--app-muted) mt-0.5">{durationText} total</Typography>
            </Box>
          </Box>

          <Box className="flex flex-col gap-3 mt-1">
            <Typography className="text-[10px] font-bold text-(--app-muted) tracking-[1.5px] uppercase">
              CHOOSE PAYMENT PLAN
            </Typography>

            {/* Pay at Venue */}
            <Box
              onClick={() => !isPayAtVenueDisabled && setSelectedPayment("pay_at_venue")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] transition-colors ${
                selectedPayment === "pay_at_venue" ? "border-(--app-primary) bg-(--app-primary-soft)" : "border-(--app-border) bg-(--app-surface)"
              } ${isPayAtVenueDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Radio 
                checked={selectedPayment === "pay_at_venue"} 
                disabled={isPayAtVenueDisabled}
                size="small" 
                className={`p-0 ${selectedPayment === "pay_at_venue" ? "text-(--app-primary)" : "text-(--app-muted)"}`}
              />
              <Box className="flex-1">
                <Box className="flex items-center justify-between">
                  <Typography className={`text-sm font-bold ${selectedPayment === "pay_at_venue" ? "text-(--app-primary)" : "text-(--app-text)"}`}>
                    Pay at Venue
                  </Typography>
                  <Typography className="text-sm font-extrabold text-(--app-text)">₹{totalPrice}</Typography>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5">
                  Pay nothing now, settle full amount after your slot
                </Typography>
              </Box>
            </Box>

            {/* Partial Deposit */}
            <Box
              onClick={() => !isPartialDepositDisabled && setSelectedPayment("partial_deposit")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] transition-colors ${
                selectedPayment === "partial_deposit" ? "border-(--app-primary) bg-(--app-primary-soft)" : "border-(--app-border) bg-(--app-surface)"
              } ${isPartialDepositDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Radio 
                checked={selectedPayment === "partial_deposit"} 
                disabled={isPartialDepositDisabled}
                size="small" 
                className={`p-0 ${selectedPayment === "partial_deposit" ? "text-(--app-primary)" : "text-(--app-muted)"}`}
              />
              <Box className="flex-1">
                <Box className="flex items-center justify-between">
                  <Typography className={`text-sm font-bold ${selectedPayment === "partial_deposit" ? "text-(--app-primary)" : "text-(--app-text)"}`}>
                    Pay {salonDepositPercentage || 0}% Deposit Now
                  </Typography>
                  <Typography className="text-sm font-extrabold text-(--app-text)">₹{partialDepositAmount} now</Typography>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5">
                  Secure slot immediately for ₹{partialDepositAmount}
                </Typography>
              </Box>
            </Box>

            {/* Full Upfront */}
            <Box
              onClick={() => setSelectedPayment("full_upfront")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] transition-colors ${
                selectedPayment === "full_upfront" ? "border-(--app-primary) bg-(--app-primary-soft)" : "border-(--app-border) bg-(--app-surface)"
              } cursor-pointer`}
            >
              <Radio 
                checked={selectedPayment === "full_upfront"} 
                size="small" 
                className={`p-0 ${selectedPayment === "full_upfront" ? "text-(--app-primary)" : "text-(--app-muted)"}`}
              />
              <Box className="flex-1">
                <Box className="flex items-center justify-between">
                  <Typography className={`text-sm font-bold ${selectedPayment === "full_upfront" ? "text-(--app-primary)" : "text-(--app-text)"}`}>
                    Full Payment Upfront
                  </Typography>
                  <Typography className="text-sm font-extrabold text-(--app-text)">₹{totalPrice} now</Typography>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5">
                  Pay entire amount securely now for a quick check-out later
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="flex flex-col gap-2 mt-1 px-4 py-4 rounded-xl bg-(--app-surface-alt) border border-(--app-border)">
            <Box className="flex items-center justify-between">
              <Typography className="text-[13px] text-(--app-muted) font-medium">Service Total</Typography>
              <Typography className="text-[14px] font-extrabold text-(--app-text) leading-none">₹{totalPrice}</Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Box>
                <Typography className="text-[13px] text-(--app-muted) font-medium">To Pay Now</Typography>
                {currentDepositAmount < totalPrice && (
                  <Typography className="text-[10px] text-[#9A7B4F] mt-0.5 italic">
                    Rest of the balance (₹{totalPrice - currentDepositAmount}) due at venue
                  </Typography>
                )}
              </Box>
              <Typography className="text-[18px] font-extrabold text-[#9A7B4F] leading-none">₹{currentDepositAmount}</Typography>
            </Box>
            <Box className="flex items-center justify-between">
              <Typography className="text-[13px] text-(--app-muted) font-medium">To Pay at Venue</Typography>
              <Typography className="text-[14px] font-extrabold text-(--app-text) leading-none">₹{totalPrice - currentDepositAmount}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="px-4 sm:px-6 pb-5 sm:pb-6 flex gap-2.5 sm:gap-3">
          <Box
            onClick={confirming ? undefined : onClose}
            className={`flex-1 py-3.5 rounded-xl border-[1.5px] border-(--app-border) text-center transition-colors duration-150 ${
              confirming ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-(--app-surface-alt)"
            }`}
          >
            <Typography className="text-[13px] font-semibold text-(--app-muted)">Cancel</Typography>
          </Box>

          <Box
            onClick={confirming ? undefined : () => onConfirm(selectedPayment)}
            className={`flex-2 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-150 ${
              confirming ? "bg-(--app-primary) cursor-default" : "bg-(--app-primary) cursor-pointer hover:brightness-95"
            }`}
          >
            {confirming && <CircularProgress size={15} className="text-(--app-primary-contrast)" />}
            <Typography className="text-[13px] font-bold text-(--app-primary-contrast)">
              {confirming ? "Booking..." : selectedPayment === "pay_at_venue" ? "Book Appointment" : `Pay ₹${currentDepositAmount} & Book`}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
