import { createAsyncThunk } from "@reduxjs/toolkit";
import { cancelBookingService } from "./cancel-booking.service";
import { cancelBookingType } from "./cancel-booking.type";

export const cancelBookingAction = createAsyncThunk(cancelBookingType, async (bookingUuid: string, thunkAPI) => {
  try {
    return await cancelBookingService(bookingUuid);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to cancel booking");
  }
});
