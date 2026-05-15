import { axiosInstance } from "../../../../config/axios";

import type { CreateBookingPayload } from "../../../../common/booking.types";

export const createBookingService = async (payload: CreateBookingPayload) => {
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
};
