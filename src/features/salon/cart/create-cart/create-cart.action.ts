import { createAsyncThunk } from "@reduxjs/toolkit";
import { createCartService, type CreateCartPayload } from "./create-cart.service";
import { createCartType } from "./create-cart.type";


export const createCartAction = createAsyncThunk(
  createCartType,
  async (payload: CreateCartPayload, thunkAPI) => {
    try {
      return await createCartService(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to create cart"
      );
    }
  }
);
