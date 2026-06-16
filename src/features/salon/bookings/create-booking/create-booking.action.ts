import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBookingService } from "./create-booking.service";
import { createBookingType } from "./create-booking.type";
import type { Slot } from "../../../../common/booking.types";

interface CreateBookingParams {
  cartId: string;
  date: string;
  slot: Slot;
  payment_preference?: "pay_at_venue" | "partial_deposit" | "full_upfront";
}

export const createBookingAction = createAsyncThunk(
  createBookingType,
  async ({ cartId, date, slot, payment_preference }: CreateBookingParams, thunkAPI) => {
    try {
      return await createBookingService({ cart_id: cartId, date, slot, payment_preference });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to create booking");
    }
  },
);
