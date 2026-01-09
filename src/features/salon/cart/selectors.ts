import type { RootState } from "../../../store/store";
import type { CartService } from "./cart.types";

export const selectCart = (state: RootState) => state.cart.cart;

export const selectCartServices = (state: RootState): CartService[] => state.cart.cart?.services ?? [];

export const selectCartTotalPrice = (state: RootState): number => state.cart.cart?.total_price ?? 0;

export const selectCartTotalDuration = (state: RootState): number => state.cart.cart?.total_duration ?? 0;

export const selectCartCount = (state: RootState): number => state.cart.cart?.services.length ?? 0;

export const selectCartSalonId = (state: RootState): string | null => state.cart.cart?.salon_id ?? null;
