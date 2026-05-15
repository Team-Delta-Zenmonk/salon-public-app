import { createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveBookingService } from "./get-active-booking.service";
import { getActiveBookingType } from "./get-active-booking.type";

export const getActiveBookingAction = createAsyncThunk(
  getActiveBookingType,
  async (salonId: string | undefined, thunkAPI) => {
    try {
      return await getActiveBookingService(salonId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch active booking");
    }
  },
);
