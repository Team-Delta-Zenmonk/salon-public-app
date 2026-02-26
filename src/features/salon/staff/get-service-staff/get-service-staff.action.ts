import { createAsyncThunk } from "@reduxjs/toolkit";
import { getServiceStaffService } from "./get-service-staff.service";
import { getServiceStaffType } from "./get-service-staff.type";

export const getServiceStaffAction = createAsyncThunk(
  getServiceStaffType,
  async ({ serviceUuid, salonId }: { serviceUuid: string; salonId: string }, thunkAPI) => {
    try {
      return await getServiceStaffService(serviceUuid, salonId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch staff");
    }
  },
);
