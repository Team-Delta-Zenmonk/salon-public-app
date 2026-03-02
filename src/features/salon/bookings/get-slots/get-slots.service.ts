import { axiosInstance } from "../../../../config/axios";

export const getSlotsService = async (cartId: string, startDate: string, days: number) => {
  const res = await axiosInstance.get("/customers/available-slots", {
    params: {
      cart_id: cartId,
      start_date: startDate,
      days,
    },
  });
  return res.data;
};
