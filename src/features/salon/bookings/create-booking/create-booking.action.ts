import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBookingService } from "./create-booking.service";
import { createBookingType } from "./create-booking.type";

interface SlotService {
  service_id: number;
  staff_id: number;
}

interface Slot {
  start: string;
  end: string;
  services: SlotService[];
}

interface CreateBookingParams {
  cartId: string;
  date: string;
  slot: Slot;
}

export const createBookingAction = createAsyncThunk(
  createBookingType,
  async ({ cartId, date, slot }: CreateBookingParams, thunkAPI) => {
    try {
      return await createBookingService({ cart_id: cartId, date, slot });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to create booking");
    }
  },
);
