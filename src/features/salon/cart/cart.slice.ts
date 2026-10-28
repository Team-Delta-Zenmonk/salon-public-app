import { createSlice } from "@reduxjs/toolkit";
import { clearGuestCart, getGuestCart, setGuestCart } from "./cart.utils";
import { addCartItemAction } from "./add-item/add-item.action";
import { syncGuestCartAction } from "./sync-cart/sync-cart.action";
import { getCartAction } from "./get-cart/get-cart.action";
import { createCartAction } from "./create-cart/create-cart.action";
import { removeCartItemAction } from "./remove-item/remove-item.action";
import { deleteCartAction } from "./delete-cart/delete-cart.action";
import { updateCartItemAction } from "./update-item/update-item.action";
import { logout } from "../../auth/auth.slice";

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
  salonId: null,
  salon: null,
  items: [],
  isGuest: true,
  loaded: false,
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

    setCartSalon(state, action) {
      if (action.payload) {
        if (!state.salon) {
          state.salon = action.payload;
          state.salonId = action.payload.uuid;
        } else if (state.salon.uuid === action.payload.uuid) {
          state.salon = {
            ...state.salon,
            ...action.payload,
          };
        }
      }
    },

    initializeGuestCart(state) {
      if (state.loaded) return;
      const guestCart = getGuestCart();
      if (guestCart) {
        state.salonId = guestCart.salon?.uuid ?? null;
        state.salon = guestCart.salon ?? null;
        state.items = guestCart.items ?? [];
        state.isGuest = true;
      }
      state.loaded = true;
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
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      setGuestCart({ salon: state.salon, items: state.items });
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      state.isGuest = false;
      state.loaded = true;
    });

    builder.addCase(addCartItemAction.fulfilled, (state, { payload }) => {
      state.items = [...state.items, payload];
    });

    builder.addCase(getCartAction.fulfilled, (state, { payload }) => {
      state.loaded = true;
      if (!payload) {
        state.cartUuid = null;
        state.salonId = null;
        state.salon = null;
        state.items = [];
        clearGuestCart();
        return;
      }

      state.cartUuid = payload.uuid;
      state.items = sortItems(payload.cart_items ?? []);
      state.salonId = payload.salon.uuid;
      state.salon = payload.salon;
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      setGuestCart({ salon: state.salon, items: state.items });
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
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
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      setGuestCart({ salon: state.salon, items: state.items });
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
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
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      setGuestCart({ salon: state.salon, items: state.items });
      if (state.salon && state.salon.has_stripe_account === undefined) {
        const policies = state.salon.allowed_payment_policies || [];
        state.salon.has_stripe_account = policies.some((p: string) => p !== "pay_at_venue");
      }
      state.isGuest = false;

      clearGuestCart();
    });

    builder.addCase(logout, (state) => {
      state.cartUuid = null;
      state.salonId = null;
      state.salon = null;
      state.items = [];
      state.isGuest = true;
      state.loaded = false;

      clearGuestCart();
    });
  },
});

export const {
  addItemLocal,
  initializeGuestCart,
  clearCart,
  removeItemLocal,
  updateItemLocalStaff,
  setCartSalon,
} = cartSlice.actions;

export default cartSlice.reducer;
