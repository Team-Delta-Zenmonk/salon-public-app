import { useState } from "react";
import { useAppDispatch } from "../../store/hook";
import { useNavigate } from "react-router-dom";
import { cancelBookingAction } from "../../features/salon/bookings/cancel-booking/cancel-booking.action";
import { createPaymentAction } from "../../features/payments/create-payment/create-payment.action";
import { continueExistingBooking, clearBookingSession } from "../../features/salon/bookings/booking.slice";
import { callSnack } from "../../components/snackbar";
import type { ActiveBooking } from "../booking.types";

export function useActiveBookingActions() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isCancelling, setIsCancelling] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelActiveBooking = async (uuid: string) => {
    setIsCancelling(true);
    setError(null);
    try {
      await dispatch(cancelBookingAction(uuid)).unwrap();
      callSnack("Booking cancelled successfully", "success");
      dispatch(clearBookingSession());
    } catch (err: any) {
      const msg = err || "Failed to cancel booking";
      setError(msg);
      callSnack(msg, "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContinueActiveBooking = async (activeBooking: ActiveBooking) => {
    setIsContinuing(true);
    setError(null);
    try {
      dispatch(continueExistingBooking(activeBooking));
      const result = await dispatch(createPaymentAction(activeBooking.uuid)).unwrap();

      if (result.clientSecret) {
        navigate("/checkout");
      }
    } catch (err: any) {
      const msg = err || "Failed to continue booking";
      setError(msg);
      callSnack(msg, "error");
    } finally {
      setIsContinuing(false);
    }
  };

  return {
    handleCancelActiveBooking,
    handleContinueActiveBooking,
    isCancelling,
    isContinuing,
    error,
    setError,
  };
}
