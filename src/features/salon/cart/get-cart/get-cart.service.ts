import { axiosInstance } from "../../../../config/axios";

export const getCartService = async (customerUuid: string, salonId?: string) => {
  const res = await axiosInstance.get(`/customers/${customerUuid}/cart`, {
    params: salonId ? { salon_id: salonId } : undefined,
  });
  return res.data;
};