import { createAsyncThunk } from "@reduxjs/toolkit";
import { getServiceStaffsService } from "./get-service-staffs.service";
import { getServiceStaffsType } from "./get-service-staffs.type";

export const getServiceStaffsAction = createAsyncThunk(
  getServiceStaffsType,
  async ({ serviceUuid, salonId }: { serviceUuid: string; salonId: string }, thunkAPI) => {
    try {
      return await getServiceStaffsService(serviceUuid, salonId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch staff");
    }
  },
);
