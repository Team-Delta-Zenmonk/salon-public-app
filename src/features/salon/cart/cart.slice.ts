import { createSlice } from "@reduxjs/toolkit";
import { clearGuestCart, getGuestCart, setGuestCart } from "./cart.utils";
import { addCartItemAction } from "./add-item/add-item.action";
import { syncGuestCartAction } from "./sync-cart/sync-cart.action";
import { getCartAction } from "./get-cart/get-cart.action";
import { createCartAction } from "./create-cart/create-cart.action";
import { removeCartItemAction } from "./remove-item/remove-item.action";
import { deleteCartAction } from "./delete-cart/delete-cart.action";

const guestCart = getGuestCart();

interface CartState {
  cartUuid: string | null;
  salonId: string | null;
  salon: any | null;
  items: any[];
  isGuest: boolean;
  loaded: boolean;
}

const initialState: CartState = {
  cartUuid: null,
  salonId: guestCart?.salon?.uuid ?? null,
  salon: guestCart?.salon ?? null,
  items: guestCart?.items ?? [],
  isGuest: !!guestCart,
  loaded: true,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /**
     * Guest-only: add item locally
     * Stores SERVER-LIKE SNAPSHOT
     */
    addItemLocal(state, action) {
      const { service_id, salon } = action.payload;

      // Switch salon → reset cart
      if (state.salonId && state.salonId !== salon.uuid) {
        state.items = [];
      }

      state.salonId = salon.uuid;
      state.salon = salon;

      const exists = state.items.find((i: any) => i.service_id === service_id);
      if (exists) return;

      state.items.push(action.payload);
      state.isGuest = true;
      state.loaded = true;

      setGuestCart({
        salon: state.salon,
        items: state.items,
      });
    },

    /**
     * Clear cart completely (logout / switch salon)
     */
    clearCart(state) {
      state.cartUuid = null;
      state.salonId = null;
      state.salon = null;
      state.items = [];
      state.isGuest = false;
      state.loaded = false;

      clearGuestCart();
    },

    /**
     * Guest-only: remove item locally
     */
    removeItemLocal(state, action) {
      const serviceId = action.payload;

      state.items = state.items.filter((i: any) => i.service_id !== serviceId);

      setGuestCart({
        salon: state.salon,
        items: state.items,
      });
    },
  },

  extraReducers: (builder) => {
    /**
     * CREATE CART → FULL CART FROM SERVER
     */
    builder.addCase(createCartAction.fulfilled, (state, { payload }) => {
      state.cartUuid = payload.uuid;
      state.items = payload.cart_items;
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;
      state.loaded = true;
    });

    /**
     * ADD ITEM (AUTH) → FULL CART
     */
    builder.addCase(addCartItemAction.fulfilled, (state, { payload }) => {
      state.items = payload.cart_items;
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;
    });

    /**
     * SYNC GUEST CART AFTER LOGIN
     */
    builder.addCase(syncGuestCartAction.fulfilled, (state, { payload }) => {
      state.loaded = true;
      if (!payload) return;

      state.cartUuid = payload.uuid;
      state.items = payload.cart_items;
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;

      clearGuestCart();
    });

    /**
     * GET CART (APP BOOT / REFRESH)
     */
    builder.addCase(getCartAction.fulfilled, (state, { payload }) => {
      state.loaded = true;
      if (!payload) return;

      state.cartUuid = payload.uuid;
      state.items = payload.cart_items;
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;
    });

    /**
     * REMOVE ITEM (AUTH) → FULL CART
     */
    builder.addCase(removeCartItemAction.fulfilled, (state, { payload }) => {
      state.items = payload.cart_items;
      state.salon = payload.salon;
    });

    /**
     * DELETE CART
     */
    builder.addCase(deleteCartAction.fulfilled, (state) => {
      state.cartUuid = null;
      state.items = [];
      state.salonId = null;
      state.salon = null;
      state.isGuest = false;
      state.loaded = true;
    });
  },
});

export const { addItemLocal, clearCart, removeItemLocal } = cartSlice.actions;

export default cartSlice.reducer;
