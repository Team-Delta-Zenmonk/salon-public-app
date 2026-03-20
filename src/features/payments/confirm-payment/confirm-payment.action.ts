import { createAsyncThunk } from "@reduxjs/toolkit";
import { confirmPaymentService } from "./confirm-payment.service";
import { confirmPaymentType } from "./confirm-payment.type";
 
interface ConfirmPaymentParams {
  bookingId: string;
  paymentIntentId: string;
}
 
export const confirmPaymentAction = createAsyncThunk(
  confirmPaymentType,
   async ({ paymentIntentId }: { paymentIntentId: string }, thunkAPI) => {
    try {
      return await confirmPaymentService({
        stripe_payment_intent_id: paymentIntentId,
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to confirm payment"
      );
    }
  }
);
