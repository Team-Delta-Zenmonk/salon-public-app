import { axiosInstance } from "../../../../config/axios";

export const getActiveBookingService = async (salonId?: string) => {
  const res = await axiosInstance.get("/bookings/active", {
    params: { salonId },
  });
  return res.data;
};
