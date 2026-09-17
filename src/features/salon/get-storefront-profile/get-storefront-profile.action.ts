import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontProfileType } from "./get-storefront-profile.type";
import { getStorefrontProfileService } from "./get-storefront-profile.service";

export const getStorefrontProfileAction = createAsyncThunk(
  getStorefrontProfileType,
  async (slug: string, thunkAPI) => {
    try {
      return await getStorefrontProfileService(slug);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront profile"
      );
    }
  }
);
