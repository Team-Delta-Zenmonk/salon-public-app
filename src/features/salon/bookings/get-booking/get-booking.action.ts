import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBookingService } from "./get-booking.service";
import { getBookingType } from "./get-booking.type";

export const getBookingAction = createAsyncThunk(getBookingType, async (bookingUuid: string, thunkAPI) => {
  try {
    return await getBookingService(bookingUuid);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch booking");
  }
});
