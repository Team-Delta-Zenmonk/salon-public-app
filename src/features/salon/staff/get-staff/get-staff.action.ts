import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStaffService } from "./get-staff.service";
import { getStaffType } from "./get-staff.type";

export const getStaffAction = createAsyncThunk(
  getStaffType,
  async ({ staffUuid, salonId }: { staffUuid: string; salonId: string }, thunkAPI) => {
    try {
      return await getStaffService(staffUuid, salonId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to fetch staff");
    }
  },
);
