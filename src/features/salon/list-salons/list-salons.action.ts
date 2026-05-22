import { createAsyncThunk } from "@reduxjs/toolkit";
import { listSalonsType } from "./list-salons.type";
import { listSalonsService } from "./list-salons.service";
import type { ListSalonsQuery } from "../salon.type";

export const listSalonsAction = createAsyncThunk(
  listSalonsType,
  async (query: ListSalonsQuery | undefined, thunkAPI) => {
    try {
      const res = await listSalonsService(query);
      return res;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data || "Unable to fetch salons";
      return thunkAPI.rejectWithValue({ message: backendMessage });
    }
  },
);
