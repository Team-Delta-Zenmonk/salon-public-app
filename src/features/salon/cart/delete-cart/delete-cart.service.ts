import { axiosInstance } from "../../../../config/axios";

export const deleteCartService = async (cartUuid: string) => {
  await axiosInstance.delete(`/cart/${cartUuid}`);
  return cartUuid;
};
