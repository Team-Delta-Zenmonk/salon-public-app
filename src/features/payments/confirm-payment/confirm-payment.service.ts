import { axiosInstance } from "../../../config/axios";

export const confirmPaymentService = async (payload: { stripe_payment_intent_id: string }) => {
  const res = await axiosInstance.post("/payments/confirm-payment", payload);
  return res.data;
};