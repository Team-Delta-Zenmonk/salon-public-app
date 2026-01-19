import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartService } from "./get-cart.service";
import { getCartType } from "./get-cart.type";

export const getCartAction = createAsyncThunk(
  getCartType,
  async (customerUuid: string, thunkAPI) => {
    try {
      return await getCartService(customerUuid);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);
