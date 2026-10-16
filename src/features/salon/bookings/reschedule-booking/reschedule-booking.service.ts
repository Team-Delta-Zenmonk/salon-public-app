import { axiosInstance } from "../../../../config/axios";

export interface RescheduleBookingPayload {
  slot: {
    start: string;
    end: string;
  };
  date: string;
}

export const getBookingSlotsService = async (bookingUuid: string, startDate: string, days: number = 7) => {
  const res = await axiosInstance.get(`/bookings/${bookingUuid}/available-slots`, {
    params: {
      start_date: startDate,
      days,
    },
  });
  return res.data;
};

export const rescheduleBookingService = async (bookingUuid: string, payload: RescheduleBookingPayload) => {
  const res = await axiosInstance.post(`/bookings/${bookingUuid}/reschedule`, payload);
  return res.data;
};
