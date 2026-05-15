import { axiosInstance } from "../../../../config/axios";

export const cancelBookingService = async (bookingUuid: string) => {
  const res = await axiosInstance.post(`/bookings/${bookingUuid}/cancel`);
  return res.data;
};
