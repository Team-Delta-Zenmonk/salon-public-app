import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCartType } from "./delete-cart.type";
import { deleteCartService } from "./delete-cart.service";

export const deleteCartAction = createAsyncThunk(
  deleteCartType,
  async (cartUuid: string, thunkAPI) => {
    try {
      return await deleteCartService(cartUuid);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to delete cart"
      );
    }
  }
);
