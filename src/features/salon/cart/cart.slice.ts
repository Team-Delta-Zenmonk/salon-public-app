import { createSlice } from "@reduxjs/toolkit";
import type { CartState } from "./cart.types";

const initialState: CartState = {
  cart: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
    },

    clearCart(state) {
      state.cart = null;
    },
  },
  extraReducers: () => {},
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
