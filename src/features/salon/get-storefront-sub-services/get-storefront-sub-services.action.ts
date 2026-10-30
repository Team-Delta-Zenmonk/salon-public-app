import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorefrontSubServicesType } from "./get-storefront-sub-services.type";
import {
  getStorefrontSubServicesService,
  type GetStorefrontSubServicesParams,
} from "./get-storefront-sub-services.service";

export const getStorefrontSubServicesAction = createAsyncThunk(
  getStorefrontSubServicesType,
  async (params: GetStorefrontSubServicesParams, thunkAPI) => {
    try {
      return await getStorefrontSubServicesService(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to fetch storefront sub-services"
      );
    }
  }
);
