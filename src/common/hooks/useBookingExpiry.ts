import { useEffect, useState, useCallback, useRef } from "react";
import { ExpiryUrgency } from "../booking.enums";

interface UseBookingExpiryReturn {
  secondsLeft: number;
  isExpired: boolean;
  formattedTime: string;
  urgency: ExpiryUrgency;
}

const GRACE_PERIOD_SECONDS = 60;

export function useBookingExpiry(expiresAt: string | null | undefined): UseBookingExpiryReturn {
  const computeSecondsLeft = useCallback(() => {
    if (!expiresAt) return 0;
    const backendExpiry = new Date(expiresAt).getTime();
    const displayExpiry = backendExpiry - GRACE_PERIOD_SECONDS * 1000;
    return Math.max(0, Math.floor((displayExpiry - Date.now()) / 1000));
  }, [expiresAt]);

  const [secondsLeft, setSecondsLeft] = useState(computeSecondsLeft);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft());

    if (!expiresAt) return;

    const initial = computeSecondsLeft();
    if (initial <= 0) return;

    intervalRef.current = setInterval(() => {
      const remaining = computeSecondsLeft();
      setSecondsLeft(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expiresAt, computeSecondsLeft]);

  const isExpired = secondsLeft <= 0;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

  let urgency: ExpiryUrgency;
  if (secondsLeft <= 0) urgency = ExpiryUrgency.CRITICAL;
  else if (secondsLeft <= 60) urgency = ExpiryUrgency.CRITICAL;
  else if (secondsLeft <= 120) urgency = ExpiryUrgency.WARNING;
  else urgency = ExpiryUrgency.NORMAL;

  return { secondsLeft, isExpired, formattedTime, urgency };
}
