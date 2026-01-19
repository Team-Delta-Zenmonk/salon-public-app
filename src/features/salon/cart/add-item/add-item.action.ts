import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCartItemService, type AddCartItemPayload } from "./add-item.service";
import { addCartItemType } from "./add-item.type";

export const addCartItemAction = createAsyncThunk(
  addCartItemType,
  async (payload: AddCartItemPayload, thunkAPI) => {
    try {
      return await addCartItemService(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);
