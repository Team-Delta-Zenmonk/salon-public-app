import { axiosInstance } from "../../../config/axios";
import type { CustomerBookingsPage } from "../../../common/booking.types";

export const getCustomerBookingsService = async (params: {
  page: number;
  limit: number;
  status?: string;
}): Promise<CustomerBookingsPage> => {
  const response = await axiosInstance.get("/bookings/history", { params });
  return response.data.data;
};
