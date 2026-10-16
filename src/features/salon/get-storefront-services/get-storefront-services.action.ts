import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontServicesType } from "./get-storefront-services.type";
import {
  getStorefrontServicesService,
  type GetStorefrontServicesParams,
} from "./get-storefront-services.service";

export const getStorefrontServicesAction = createAsyncThunk(
  getStorefrontServicesType,
  async (params: GetStorefrontServicesParams, thunkAPI) => {
    try {
      return await getStorefrontServicesService(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront services"
      );
    }
  }
);
