import { axiosInstance } from "../../../config/axios";

export const createPaymentService = async (bookingId: string) => {
  const res = await axiosInstance.post("/payments/create-payment", {
    booking_id: bookingId,
  });
  return res.data;
};
