import { axiosInstance } from "../../../../config/axios";

export interface AddCartItemPayload {
  cart_id: string;
  service_id: string;
  staff_id?: string | null;
  base_price?: number;
  duration?: number;
}

export const addCartItemService = async (payload: AddCartItemPayload) => {
  const res = await axiosInstance.post("/cart/item", payload);
  return res.data;
};
