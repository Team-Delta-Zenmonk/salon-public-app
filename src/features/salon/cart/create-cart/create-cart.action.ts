import { createAsyncThunk } from "@reduxjs/toolkit";
import { createCartType } from "./create-cart.type";
import { createCartService, type CreateCartPayload } from "./create-cart.service";
import { setCart } from "../cart.slice";

export const createCartAction = createAsyncThunk(
  createCartType, 
  async (payload: CreateCartPayload, thunkAPI) => {
    try {
      const res = await createCartService(payload);
      thunkAPI.dispatch(setCart(res));
      return res;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data || "Unable to create cart";
      return thunkAPI.rejectWithValue({
        message: backendMessage,
      });
    } 
  }
);
