import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BookingAction, BookingPhase } from "../../../common/booking.enums";
import type { ActiveBooking, CurrentBooking } from "../../../common/booking.types";
import { getActiveBookingAction } from "./get-active-booking/get-active-booking.action";
import { createBookingAction } from "./create-booking/create-booking.action";
import { cancelBookingAction } from "./cancel-booking/cancel-booking.action";
import { createPaymentAction } from "../../payments/create-payment/create-payment.action";

interface BookingState {
  activeBooking: ActiveBooking | null;
  currentBooking: CurrentBooking | null;
  clientSecret: string | null;
  paymentId: number | null;
  bookingPhase: BookingPhase;
  paymentJustCompleted: boolean;
}

const initialState: BookingState = {
  activeBooking: null,
  currentBooking: null,
  clientSecret: null,
  paymentId: null,
  bookingPhase: BookingPhase.IDLE,
  paymentJustCompleted: false,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    setBookingPhase(state, action: PayloadAction<BookingPhase>) {
      state.bookingPhase = action.payload;
    },
    clearBookingSession(state) {
      state.currentBooking = null;
      state.clientSecret = null;
      state.paymentId = null;
      state.activeBooking = null;
      state.bookingPhase = BookingPhase.IDLE;
    },

    markPaymentCompleted(state) {
      state.paymentJustCompleted = true;
    },

    clearPaymentCompleted(state) {
      state.paymentJustCompleted = false;
    },

    clearActiveBooking(state) {
      state.activeBooking = null;
    },

    continueExistingBooking(state, action: PayloadAction<ActiveBooking>) {
      state.currentBooking = action.payload;
      state.activeBooking = null;
      state.bookingPhase = BookingPhase.PAYMENT;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getActiveBookingAction.fulfilled, (state, { payload }) => {
      state.activeBooking = payload?.data ?? null;
    });

    builder.addCase(getActiveBookingAction.rejected, (state) => {
      state.activeBooking = null;
    });

    builder.addCase(createBookingAction.fulfilled, (state, { payload }) => {
      if (payload?.action === BookingAction.ACTIVE_BOOKING_EXISTS) {
        state.activeBooking = payload.booking;
        state.bookingPhase = BookingPhase.BOOKING_CONFLICT;
        return;
      }

      if (payload?.action === BookingAction.BOOKING_CREATED) {
        state.currentBooking = payload.booking;
      }
    });

    builder.addCase(cancelBookingAction.fulfilled, (state) => {
      state.activeBooking = null;
      state.currentBooking = null;
      state.clientSecret = null;
      state.paymentId = null;
      state.bookingPhase = BookingPhase.IDLE;
    });

    builder.addCase(createPaymentAction.fulfilled, (state, { payload }) => {
      state.clientSecret = payload?.clientSecret ?? null;
      state.paymentId = payload?.paymentId ?? null;
      state.bookingPhase = BookingPhase.PAYMENT;
    });
  },
});

export const {
  setBookingPhase,
  clearBookingSession,
  clearActiveBooking,
  continueExistingBooking,
  markPaymentCompleted,
  clearPaymentCompleted,
} = bookingSlice.actions;

export default bookingSlice.reducer;
