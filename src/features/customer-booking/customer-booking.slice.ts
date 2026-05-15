import { createSlice } from "@reduxjs/toolkit";
import type { CustomerBooking } from "../../common/booking.types";
import { getCustomerBookingsAction } from "./get-customer-bookings/get-customer-bookings.action";

interface CustomerBookingState {
  bookings: CustomerBooking[];
  total: number;
  page: number;
  limit: number;
}

const initialState: CustomerBookingState = {
  bookings: [],
  total: 0,
  page: 1,
  limit: 10,
};

export const customerBookingSlice = createSlice({
  name: "customerBooking",
  initialState,
  reducers: {
    resetCustomerBookings(state) {
      state.bookings = [];
      state.total = 0;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomerBookingsAction.fulfilled, (state, { payload }) => {
      const currentPage = Number(payload.pagination.page);
      if (currentPage === 1) {
        state.bookings = payload.bookings;
      } else {
        const newBookings = payload.bookings.filter((nb) => !state.bookings.find((b) => b.uuid === nb.uuid));
        state.bookings = [...state.bookings, ...newBookings];
      }
      state.total = Number(payload.pagination.total);
      state.page = currentPage;
      state.limit = Number(payload.pagination.limit);
    });
  },
});

export const { resetCustomerBookings } = customerBookingSlice.actions;
export default customerBookingSlice.reducer;
