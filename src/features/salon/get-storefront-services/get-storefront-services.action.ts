import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontServicesType } from "./get-storefront-services.type";
import { getStorefrontServicesService } from "./get-storefront-services.service";

export const getStorefrontServicesAction = createAsyncThunk(
  getStorefrontServicesType,
  async (slug: string, thunkAPI) => {
    try {
      return await getStorefrontServicesService(slug);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront services"
      );
    }
  }
);
