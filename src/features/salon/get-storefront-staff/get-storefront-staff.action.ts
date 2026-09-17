import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontStaffType } from "./get-storefront-staff.type";
import { getStorefrontStaffService } from "./get-storefront-staff.service";

export const getStorefrontStaffAction = createAsyncThunk(
  getStorefrontStaffType,
  async (slug: string, thunkAPI) => {
    try {
      return await getStorefrontStaffService(slug);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront staff"
      );
    }
  }
);
