import { axiosInstance } from "../../../../config/axios";

export const removeCartItemService = async (itemUuid: string) => {
  const res = await axiosInstance.delete(`/cart/item/${itemUuid}`);
  return res.data;
};
