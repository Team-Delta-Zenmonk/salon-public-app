import { axiosInstance } from "../../../../config/axios";

export const updateCartItemService = async (itemUuid: string, staffUuid: string | null) => {
  const res = await axiosInstance.put(`/cart/item/${itemUuid}`, { staff_id: staffUuid });
  return res.data;
};
