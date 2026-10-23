import { Dialog, DialogContent, Box, Typography, CircularProgress, Radio } from "@mui/material";
import { useState, useEffect } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MONTH_SHORT, WEEKDAY_FULL } from "../../../../../../common/date.constants";
import { formatTimeUTC, formatDuration } from "../../../../../../common/date.utils";
import styles from "./booking-confirm-dialog.module.css";

interface BookingConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentPreference: "pay_at_venue" | "partial_deposit" | "full_upfront") => void;
  date: string | null;
  slot: any;
  totalPrice: number;
  salonPaymentPolicy: string;
  salonAllowedPaymentPolicies?: string[];
  salonDepositPercentage?: number | null;
  hasStripeAccount: boolean;
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
  salonAllowedPaymentPolicies,
  salonDepositPercentage,
  hasStripeAccount,
  totalDuration,
  confirming,
}: Readonly<BookingConfirmDialogProps>) {
  const durationText = formatDuration(totalDuration);
  const dateObj = date ? new Date(date) : null;

  const rawAllowed = salonAllowedPaymentPolicies?.length
    ? salonAllowedPaymentPolicies
    : [salonPaymentPolicy || "pay_at_venue"];

  const stripeAccount = hasStripeAccount ?? true;
  const allowed = stripeAccount
    ? rawAllowed
    : rawAllowed.filter((p) => p === "pay_at_venue");

  const effectiveAllowed = allowed.length > 0 ? allowed : ["pay_at_venue"];

  const defaultSelection =
    effectiveAllowed.includes("full_upfront") ? "full_upfront" :
    effectiveAllowed.includes("partial_deposit") ? "partial_deposit" :
    "pay_at_venue";

  const [selectedPayment, setSelectedPayment] = useState<"pay_at_venue" | "partial_deposit" | "full_upfront">(defaultSelection);

  useEffect(() => {
    setSelectedPayment(defaultSelection);
  }, [defaultSelection, open]);

  const partialDepositAmount = salonDepositPercentage ? Math.round(totalPrice * (salonDepositPercentage / 100)) : 0;
  
  let currentDepositAmount = 0;
  if (selectedPayment === "partial_deposit") currentDepositAmount = partialDepositAmount;
  else if (selectedPayment === "full_upfront") currentDepositAmount = totalPrice;

  const isPayAtVenueDisabled = !effectiveAllowed.includes("pay_at_venue");
  const isPartialDepositDisabled = !effectiveAllowed.includes("partial_deposit") || !hasStripeAccount;
  const isFullUpfrontDisabled = !effectiveAllowed.includes("full_upfront") || !hasStripeAccount;

  return (
    <Dialog
      open={open}
      onClose={confirming ? undefined : onClose}
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: {
          className: styles.dialogBackdrop,
        },
      }}
    >
      <DialogContent className={styles.content}>
        <Box className={styles.header}>
          <Box className={styles.iconSquare}>
            <CheckCircleOutlineIcon className={styles.confirmCheckIcon} />
          </Box>
          <Box>
            <Typography className={styles.title}>
              Confirm Booking
            </Typography>
            <Typography className={styles.subtitle}>Review your appointment details</Typography>
          </Box>
        </Box>

        <Box className={styles.body}>
          <Box className={styles.row}>
            <Box className={styles.altIconSquare}>
              <CalendarMonthIcon className={styles.rowAltIcon} />
            </Box>
            <Box>
              <Typography className={styles.rowLabel}>
                Date
              </Typography>
              <Typography className={styles.rowValue}>
                {dateObj
                  ? `${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_SHORT[dateObj.getUTCMonth()]}`
                  : "—"}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.row}>
            <Box className={styles.altIconSquare}>
              <AccessTimeIcon className={styles.rowAltIcon} />
            </Box>
            <Box>
              <Typography className={styles.rowLabel}>
                Time
              </Typography>
              <Typography className={styles.rowValue}>
                {slot ? `${formatTimeUTC(slot.start)} – ${formatTimeUTC(slot.end)}` : "—"}
              </Typography>
              <Typography className={styles.durationNote}>{durationText} total</Typography>
            </Box>
          </Box>

          <Box className={styles.planSection}>
            <Typography className={styles.sectionHeader}>
              CHOOSE PAYMENT PLAN
            </Typography>

            <Box
              onClick={() => !isPayAtVenueDisabled && setSelectedPayment("pay_at_venue")}
              className={`${styles.planCard} ${
                selectedPayment === "pay_at_venue" ? styles.planCardSelected : ""
              } ${isPayAtVenueDisabled ? styles.planCardDisabled : ""}`}
            >
              <Radio 
                checked={selectedPayment === "pay_at_venue"} 
                disabled={isPayAtVenueDisabled}
                size="small" 
                className={selectedPayment === "pay_at_venue" ? styles.radioBtnSelected : styles.radioBtn}
              />
              <Box className={styles.planContent}>
                <Box className={styles.planTopRow}>
                  <Typography className={`${styles.planName} ${selectedPayment === "pay_at_venue" ? styles.planNameSelected : ""}`}>
                    Pay at Venue
                  </Typography>
                  <Typography className={styles.planPrice}>₹{totalPrice}</Typography>
                </Box>
                <Typography className={styles.planDesc}>
                  Pay nothing now, settle full amount after your slot
                </Typography>
              </Box>
            </Box>

            <Box
              onClick={() => !isPartialDepositDisabled && setSelectedPayment("partial_deposit")}
              className={`${styles.planCard} ${
                selectedPayment === "partial_deposit" ? styles.planCardSelected : ""
              } ${isPartialDepositDisabled ? styles.planCardDisabled : ""}`}
            >
              <Radio 
                checked={selectedPayment === "partial_deposit"} 
                disabled={isPartialDepositDisabled}
                size="small" 
                className={selectedPayment === "partial_deposit" ? styles.radioBtnSelected : styles.radioBtn}
              />
              <Box className={styles.planContent}>
                <Box className={styles.planTopRow}>
                  <Typography className={`${styles.planName} ${selectedPayment === "partial_deposit" ? styles.planNameSelected : ""}`}>
                    Pay {salonDepositPercentage || 0}% Deposit Now
                  </Typography>
                  <Typography className={styles.planPrice}>₹{partialDepositAmount} now</Typography>
                </Box>
                <Typography className={styles.planDesc}>
                  Secure slot immediately for ₹{partialDepositAmount}
                </Typography>
                {!hasStripeAccount && (
                  <Typography className={styles.disabledReason}>
                    Online payments temporarily unavailable for this salon
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              onClick={() => !isFullUpfrontDisabled && setSelectedPayment("full_upfront")}
              className={`${styles.planCard} ${
                selectedPayment === "full_upfront" ? styles.planCardSelected : ""
              } ${isFullUpfrontDisabled ? styles.planCardDisabled : ""}`}
            >
              <Radio 
                checked={selectedPayment === "full_upfront"} 
                disabled={isFullUpfrontDisabled}
                size="small" 
                className={selectedPayment === "full_upfront" ? styles.radioBtnSelected : styles.radioBtn}
              />
              <Box className={styles.planContent}>
                <Box className={styles.planTopRow}>
                  <Typography className={`${styles.planName} ${selectedPayment === "full_upfront" ? styles.planNameSelected : ""}`}>
                    Full Payment Upfront
                  </Typography>
                  <Typography className={styles.planPrice}>₹{totalPrice} now</Typography>
                </Box>
                <Typography className={styles.planDesc}>
                  Pay entire amount securely now for a quick check-out later
                </Typography>
                {!hasStripeAccount && (
                  <Typography className={styles.disabledReason}>
                    Online payments temporarily unavailable for this salon
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box className={styles.summaryBox}>
            <Box className={styles.summaryRow}>
              <Typography className={styles.summaryLabel}>Service Total</Typography>
              <Typography className={styles.summaryValue}>₹{totalPrice}</Typography>
            </Box>
            <Box className={styles.summaryRow}>
              <Box>
                <Typography className={styles.summaryLabel}>To Pay Now</Typography>
                {currentDepositAmount < totalPrice && (
                  <Typography className={styles.depositNote}>
                    Rest of the balance (₹{totalPrice - currentDepositAmount}) due at venue
                  </Typography>
                )}
              </Box>
              <Typography className={styles.depositValue}>₹{currentDepositAmount}</Typography>
            </Box>
            <Box className={styles.summaryRow}>
              <Typography className={styles.summaryLabel}>To Pay at Venue</Typography>
              <Typography className={styles.summaryValue}>₹{totalPrice - currentDepositAmount}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className={styles.footer}>
          <Box
            onClick={confirming ? undefined : onClose}
            className={`${styles.cancelBtn} ${confirming ? styles.cancelBtnDisabled : ""}`}
          >
            <Typography className={styles.cancelBtnText}>Cancel</Typography>
          </Box>

          <Box
            onClick={confirming ? undefined : () => onConfirm(selectedPayment)}
            className={`${styles.confirmBtn} ${confirming ? styles.confirmBtnDisabled : ""}`}
          >
            {confirming && <CircularProgress size={15} className={styles.confirmSpinner} />}
            <Typography className={styles.confirmBtnText}>
              {confirming ? "Booking..." : selectedPayment === "pay_at_venue" ? "Book Appointment" : `Pay ₹${currentDepositAmount} & Book`}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
