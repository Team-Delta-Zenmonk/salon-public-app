import { axiosInstance } from "../../../../config/axios";

interface SlotService {
  service_id: number;
  staff_id: number;
}

interface Slot {
  start: string;
  end: string;
  services: SlotService[];
}

interface CreateBookingPayload {
  cart_id: string;
  date: string;
  slot: Slot;
}

export const createBookingService = async (payload: CreateBookingPayload) => {
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
};
