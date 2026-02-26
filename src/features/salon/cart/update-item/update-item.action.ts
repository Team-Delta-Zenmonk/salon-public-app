import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateCartItemService } from "./update-item.service";
import { updateCartItemType } from "./update-item.type";

export const updateCartItemAction = createAsyncThunk(
  updateCartItemType,
  async ({ itemUuid, staffUuid }: { itemUuid: string; staffUuid: string }, thunkAPI) => {
    try {
      return await updateCartItemService(itemUuid, staffUuid);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to update item");
    }
  },
);
