import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPaymentType } from "./create-payment.type";
import { createPaymentService } from "./create-payment.service";

export const createPaymentAction = createAsyncThunk(
  createPaymentType,
  async (bookingId: string, thunkAPI) => {
    try {
      return await createPaymentService(bookingId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to create payment intent"
      );
    }
  }
);
