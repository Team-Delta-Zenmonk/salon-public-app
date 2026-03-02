import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSlotsService } from "./get-slots.service";
import { getSlotsType } from "./get-slots.type";

interface GetSlotsParams {
  cartId: string;
  startDate: string;
  days: number;
}

export const getSlotsAction = createAsyncThunk(
  getSlotsType,
  async ({ cartId, startDate, days }: GetSlotsParams, thunkAPI) => {
    try {
      return await getSlotsService(cartId, startDate, days);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch available slots");
    }
  },
);
