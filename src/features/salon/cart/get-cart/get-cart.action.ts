import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartService } from "./get-cart.service";
import { getCartType } from "./get-cart.type";

export const getCartAction = createAsyncThunk(
  getCartType,
  async (
    arg: string | { customerUuid: string; salonId?: string },
    thunkAPI
  ) => {
    try {
      const customerUuid = typeof arg === "string" ? arg : arg.customerUuid;
      const salonId = typeof arg === "string" ? undefined : arg.salonId;
      return await getCartService(customerUuid, salonId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);
