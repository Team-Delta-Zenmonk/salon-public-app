import { BookingStatus, ExpiryUrgency as EU } from "./booking.enums";
import type { ExpiryUrgency } from "./booking.enums";

export function getUrgencyColor(urgency: ExpiryUrgency): string {
  if (urgency === EU.CRITICAL) return "var(--app-error, #ef4444)";
  if (urgency === EU.WARNING) return "var(--app-warning, #f59e0b)";
  return "var(--app-primary)";
}

export const getBookingStatusConfig = (status: string) => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return {
        label: "Confirmed",
        color: "#10b981",
      };
    case BookingStatus.PENDING:
      return {
        label: "Pending",
        color: "#f59e0b",
      };
    case BookingStatus.COMPLETED:
      return {
        label: "Completed",
        color: "#3b82f6",
      };
    case BookingStatus.CANCELLED:
      return {
        label: "Cancelled",
        color: "#f43f5e",
      };
    case BookingStatus.EXPIRED:
      return {
        label: "Expired",
        color: "#71717a",
      };
    default:
      return {
        label: status,
        color: "#71717a",
      };
  }
};

export function isBookingCancelable(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
  return d.getTime() - now.getTime() >= TWO_HOURS_IN_MS;
}

export function isBookingPast(iso: string): boolean {
  const d = new Date(iso);
  return d.getTime() < Date.now();
}
