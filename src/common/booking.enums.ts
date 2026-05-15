export const BookingPhase = {
  IDLE: "idle",
  SLOT_SELECTION: "slot_selection",
  CONFIRMING: "confirming",
  BOOKING_CONFLICT: "booking_conflict",
  PAYMENT: "payment",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_SUCCESS: "payment_success",
} as const;

export type BookingPhase = (typeof BookingPhase)[keyof typeof BookingPhase];

export const AsyncStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type AsyncStatus = (typeof AsyncStatus)[keyof typeof AsyncStatus];

export const ExpiryUrgency = {
  NORMAL: "normal",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export type ExpiryUrgency = (typeof ExpiryUrgency)[keyof typeof ExpiryUrgency];

export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const BookingAction = {
  BOOKING_CREATED: "BOOKING_CREATED",
  ACTIVE_BOOKING_EXISTS: "ACTIVE_BOOKING_EXISTS",
} as const;

export type BookingAction = (typeof BookingAction)[keyof typeof BookingAction];
