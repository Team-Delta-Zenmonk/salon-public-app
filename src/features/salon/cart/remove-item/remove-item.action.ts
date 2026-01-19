import { createAsyncThunk } from "@reduxjs/toolkit";
import { removeCartItemType } from "./remove-item.type";
import { removeCartItemService } from "./remove-item.service";

export const removeCartItemAction = createAsyncThunk(
  removeCartItemType,
  async (itemUuid: string, thunkAPI) => {
    try {
      return await removeCartItemService(itemUuid);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to remove item"
      );
    }
  }
);
