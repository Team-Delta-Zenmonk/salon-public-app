import { axiosInstance } from "../../../../config/axios";

export interface CreateCartItemPayload {
  service_id: string;
  staff_id?: string;
  price?: number;
  duration?: number;
}

export interface CreateCartPayload {
  salon_id: string;
  user_id: string;
  items: CreateCartItemPayload[];
}

export const createCartService = async (payload: CreateCartPayload) => {
  const res = await axiosInstance.post("/cart", payload);
  return res.data;
};
