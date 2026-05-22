import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useBookingExpiry } from "../../../common/hooks/useBookingExpiry";
import { MONTH_SHORT, WEEKDAY_FULL } from "../../../common/date.constants";
import { clearBookingSession } from "../../../features/salon/bookings/booking.slice";

export function useCheckoutData() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentBooking, clientSecret } = useAppSelector((s) => s.booking);
  const { salon: cartSalon } = useAppSelector((s) => s.cart);

  const displaySalon = currentBooking?.salon || cartSalon;
  const { formattedTime, isExpired, urgency } = useBookingExpiry(currentBooking?.expires_at);

  useEffect(() => {
    if (!currentBooking || !clientSecret) {
      navigate("/cart", { replace: true });
    }
  }, [currentBooking, clientSecret, navigate]);

  const dateObj = currentBooking?.booking_date ? new Date(currentBooking.booking_date) : null;

  const dateStr = dateObj
    ? `${WEEKDAY_FULL[dateObj.getUTCDay()]}, ${dateObj.getUTCDate()} ${MONTH_SHORT[dateObj.getUTCMonth()]}`
    : "";

  const handleResetBooking = () => {
    dispatch(clearBookingSession());
    navigate("/cart");
  };

  return {
    currentBooking,
    clientSecret,
    displaySalon,
    formattedTime,
    isExpired,
    urgency,
    dateStr,
    handleResetBooking,
  };
}
