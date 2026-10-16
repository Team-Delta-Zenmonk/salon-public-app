import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontStaffType } from "./get-storefront-staff.type";
import {
  getStorefrontStaffService,
  type GetStorefrontStaffParams,
} from "./get-storefront-staff.service";

export const getStorefrontStaffAction = createAsyncThunk(
  getStorefrontStaffType,
  async (params: GetStorefrontStaffParams, thunkAPI) => {
    try {
      return await getStorefrontStaffService(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront staff"
      );
    }
  }
);
