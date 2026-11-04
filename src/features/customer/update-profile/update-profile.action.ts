import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateCustomerProfileService,
  type UpdateCustomerProfilePayload,
} from "./update-profile.service";

export const updateCustomerProfileAction = createAsyncThunk(
  "customer/updateProfile",
  async (payload: UpdateCustomerProfilePayload, thunkAPI) => {
    try {
      const response = await updateCustomerProfileService(payload);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to update profile"
      );
    }
  }
);
