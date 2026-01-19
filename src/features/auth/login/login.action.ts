import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginCustomerType } from "./login.type";
import { loginCustomerService, type LoginCustomerPayload } from "./login.service";

export const loginCustomerAction = createAsyncThunk(
  loginCustomerType,
  async (payload: LoginCustomerPayload, thunkAPI) => {
    try {
      const res = await loginCustomerService(payload);
      return res;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.response?.data || "Login failed";

      return thunkAPI.rejectWithValue({ message: backendMessage });
    }
  }
);
