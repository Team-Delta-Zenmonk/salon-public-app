export interface BookingService {
  id: number;
  service_id: number;
  staff_id: number;
  sequence: number;
  offset_minutes: number;
  duration_minutes: number;
  price: number;
  start_time: string;
  end_time: string;
  service?: { name: string };
}

export interface BookingSalon {
  name: string;
  logo?: string;
  address?: string;
  type?: string;
}

export interface ActiveBooking {
  uuid: string;
  booking_start_time: string;
  booking_end_time: string;
  booking_date: string;
  expires_at: string;
  total_price: number;
  total_duration: number;
  status: string;
  payment_policy?: "pay_at_venue" | "partial_deposit" | "full_upfront";
  deposit_amount?: number;
  amount_paid_online?: number;
  salon?: BookingSalon;
  booking_services?: BookingService[];
}

export interface CurrentBooking {
  uuid: string;
  total_price: number;
  total_duration: number;
  booking_start_time: string;
  booking_end_time: string;
  booking_date: string;
  expires_at: string;
  status: string;
  payment_policy?: "pay_at_venue" | "partial_deposit" | "full_upfront";
  deposit_amount?: number;
  amount_paid_online?: number;
  salon?: BookingSalon;
  booking_services?: BookingService[];
}

export interface CreateBookingResult {
  action: string;
  booking: CurrentBooking;
}

export interface CreatePaymentResult {
  clientSecret: string;
  paymentId: number;
}

export interface CustomerBooking {
  uuid: string;
  total_price: number;
  total_duration: number;
  booking_start_time: string;
  booking_end_time: string;
  booking_date: string;
  expires_at: string | null;
  status: string;
  payment_policy?: "pay_at_venue" | "partial_deposit" | "full_upfront";
  deposit_amount?: number;
  amount_paid_online?: number;
  salon: BookingSalon;
  booking_services: BookingService[];
  created_at: string;
}

export interface CustomerBookingsPage {
  bookings: CustomerBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface SlotService {
  service_id: number;
  staff_id: number;
}

export interface Slot {
  start: string;
  end: string;
  services: SlotService[];
}

export interface CreateBookingPayload {
  cart_id: string;
  date: string;
  slot: Slot;
  payment_preference?: "pay_at_venue" | "partial_deposit" | "full_upfront";
}
