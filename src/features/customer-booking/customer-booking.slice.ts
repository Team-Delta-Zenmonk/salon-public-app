import { createSlice } from "@reduxjs/toolkit";
import type { CustomerBooking } from "../../common/booking.types";
import { getCustomerBookingsAction } from "./get-customer-bookings/get-customer-bookings.action";

interface CustomerBookingState {
  bookings: CustomerBooking[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isFetchingMore: boolean;
}

const initialState: CustomerBookingState = {
  bookings: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isFetchingMore: false,
};

export const customerBookingSlice = createSlice({
  name: "customerBooking",
  initialState,
  reducers: {
    resetCustomerBookings(state) {
      state.bookings = [];
      state.total = 0;
      state.page = 1;
      state.isLoading = false;
      state.isFetchingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerBookingsAction.pending, (state, { meta }) => {
        const page = meta.arg?.page ?? 1;
        if (page === 1) {
          state.isLoading = true;
        } else {
          state.isFetchingMore = true;
        }
      })
      .addCase(getCustomerBookingsAction.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isFetchingMore = false;
        const currentPage = Number(payload.pagination.page);
        if (currentPage === 1) {
          state.bookings = payload.bookings;
        } else {
          const newBookings = payload.bookings.filter((nb) => !state.bookings.some((b) => b.uuid === nb.uuid));
          state.bookings = [...state.bookings, ...newBookings];
        }
        state.total = Number(payload.pagination.total);
        state.page = currentPage;
        state.limit = Number(payload.pagination.limit);
      })
      .addCase(getCustomerBookingsAction.rejected, (state) => {
        state.isLoading = false;
        state.isFetchingMore = false;
      });
  },
});

export const { resetCustomerBookings } = customerBookingSlice.actions;
export default customerBookingSlice.reducer;
