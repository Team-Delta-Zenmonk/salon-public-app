import { axiosInstance } from "../../../../config/axios";

export const getCartService = async (customerUuid: string) => {
  const res = await axiosInstance.get(`/customers/${customerUuid}/cart`);
  return res.data;
};