import { createAsyncThunk } from "@reduxjs/toolkit";
import { getGuestCart, clearGuestCart } from "../cart.utils";
import { createCartService } from "../create-cart/create-cart.service";
import { syncGuestCartType } from "./sync-cart.type";

export const syncGuestCartAction = createAsyncThunk(
  syncGuestCartType,
  async ({ userId }: { userId: string }, thunkAPI) => {
    try {
      const guestCart = getGuestCart();
      if (!guestCart?.items?.length) return null;

      const payload = {
        salon_id: guestCart.salon?.uuid,
        user_id: userId,
        items: guestCart.items.map((item: any) => ({
          service_id: item.service_id,
          base_price: item.base_price,
          duration: item.duration,
          staff_id: item.staff_uuid ?? undefined,
        })),
      };

      const cart = await createCartService(payload);

      clearGuestCart();
      return cart;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || "Failed to sync cart");
    }
  }
);
