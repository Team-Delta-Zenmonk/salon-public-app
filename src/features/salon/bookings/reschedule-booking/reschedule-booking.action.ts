import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  rescheduleBookingService,
  getBookingSlotsService,
  type RescheduleBookingPayload,
} from "./reschedule-booking.service";
import { rescheduleBookingType, getBookingSlotsType } from "./reschedule-booking.type";

export const getBookingSlotsAction = createAsyncThunk(
  getBookingSlotsType,
  async (
    { bookingUuid, startDate, days }: { bookingUuid: string; startDate: string; days?: number },
    thunkAPI
  ) => {
    try {
      return await getBookingSlotsService(bookingUuid, startDate, days);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch available slots"
      );
    }
  }
);

export const rescheduleBookingAction = createAsyncThunk(
  rescheduleBookingType,
  async (
    { bookingUuid, payload }: { bookingUuid: string; payload: RescheduleBookingPayload },
    thunkAPI
  ) => {
    try {
      return await rescheduleBookingService(bookingUuid, payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to reschedule booking"
      );
    }
  }
);
