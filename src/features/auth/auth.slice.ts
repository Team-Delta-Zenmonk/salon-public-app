import { createSlice } from "@reduxjs/toolkit";
import { loginCustomerAction } from "./login/login.action";

const initialState = {
  customer: null as any,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.customer = null;
      state.isAuthenticated = false;
    },
    setCustomer(state, action) {
      state.customer = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginCustomerAction.fulfilled, (state, { payload }) => {
      state.customer = payload.customer;
      state.isAuthenticated = true;
    });
  },
});

export const { logout, setCustomer } = authSlice.actions;
export default authSlice.reducer;
