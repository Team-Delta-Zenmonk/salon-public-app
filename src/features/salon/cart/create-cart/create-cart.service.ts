import { axiosInstance } from "../../../../config/axios";

export interface CreateCartPayload {
  salon_id: string;
  user_id: string;
  items: {
    service_id: string;
    staff_id?: string | null;
    base_price?: number;
    duration?: number;
  }[];
}

export const createCartService = async (payload: CreateCartPayload) => {
  const res = await axiosInstance.post("/cart", payload);
  return res.data;
};
