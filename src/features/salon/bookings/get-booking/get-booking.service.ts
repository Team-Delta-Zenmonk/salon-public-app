import { axiosInstance } from "../../../../config/axios";

export const getBookingService = async (bookingUuid: string) => {
  const res = await axiosInstance.get(`/bookings/${bookingUuid}`);
  return res.data;
};
