import { createSlice } from "@reduxjs/toolkit";
import { clearGuestCart, getGuestCart, setGuestCart } from "./cart.utils";
import { addCartItemAction } from "./add-item/add-item.action";
import { syncGuestCartAction } from "./sync-cart/sync-cart.action";
import { getCartAction } from "./get-cart/get-cart.action";
import { createCartAction } from "./create-cart/create-cart.action";
import { removeCartItemAction } from "./remove-item/remove-item.action";
import { deleteCartAction } from "./delete-cart/delete-cart.action";
import { updateCartItemAction } from "./update-item/update-item.action";

const guestCart = getGuestCart();
const sortItems = (items: any[]) => [...items].sort((a: any, b: any) => a.id - b.id);

interface CartState {
  cartUuid: string | null;
  salonId: string | null;
  salon: any;
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
    addItemLocal(state, action) {
      const { service_id, salon } = action.payload;

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

    updateItemLocalStaff(state, action) {
      const { service_id, staff, staff_uuid, price, duration } = action.payload;
      const item = state.items.find((i: any) => i.service_id === service_id);
      if (!item) return;

      item.staff_uuid = staff_uuid;
      item.staff = staff;
      item.final_price = price ? Number.parseFloat(String(price)) : item.base_price;
      item.duration = duration ?? item.duration;

      setGuestCart({ salon: state.salon, items: state.items });
    },

    removeItemLocal(state, action) {
      const serviceId = action.payload;
      state.items = state.items.filter((i: any) => i.service_id !== serviceId);
      setGuestCart({
        salon: state.salon,
        items: state.items,
      });
    },

    clearCart(state) {
      state.cartUuid = null;
      state.salonId = null;
      state.salon = null;
      state.items = [];
      state.isGuest = false;
      state.loaded = true;

      clearGuestCart();
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createCartAction.fulfilled, (state, { payload }) => {
      state.cartUuid = payload.uuid;
      state.items = sortItems(payload.cart_items ?? []);
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;
      state.loaded = true;
    });

    builder.addCase(addCartItemAction.fulfilled, (state, { payload }) => {
      state.items = [...state.items, payload];
    });

    builder.addCase(getCartAction.fulfilled, (state, { payload }) => {
      state.loaded = true;
      if (!payload) return;

      state.cartUuid = payload.uuid;
      state.items = sortItems(payload.cart_items ?? []);
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      state.isGuest = false;
    });

    builder.addCase(removeCartItemAction.fulfilled, (state, { meta }) => {
      state.items = state.items.filter((i: any) => i.uuid !== meta.arg);
    });

    builder.addCase(updateCartItemAction.fulfilled, (state, { payload }) => {
      state.cartUuid = payload.uuid;
      state.items = sortItems(payload.cart_items ?? []);
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
    });

    builder.addCase(deleteCartAction.fulfilled, (state) => {
      state.cartUuid = null;
      state.items = [];
      state.salonId = null;
      state.salon = null;
      state.isGuest = false;
      state.loaded = true;
    });

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
  },
});

export const { addItemLocal, clearCart, removeItemLocal, updateItemLocalStaff } = cartSlice.actions;

export default cartSlice.reducer;
