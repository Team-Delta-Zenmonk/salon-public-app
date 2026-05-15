import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCustomerBookingsService } from "./get-customer-bookings.service";
import { getCustomerBookingsType } from "./get-customer-bookings.type";

export const getCustomerBookingsAction = createAsyncThunk(
  getCustomerBookingsType,
  async (params: { page: number; limit: number; status?: string }, thunkAPI) => {
    try {
      return await getCustomerBookingsService(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch bookings");
    }
  },
);
