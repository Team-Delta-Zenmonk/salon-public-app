import type { Gender } from "./enums/gender.enum";
import type { PaymentPolicy } from "./enums/payment-policy.enum";
import type { PriceType } from "./enums/price-type.enum";

export type { Gender } from "./enums/gender.enum";
export type { PaymentPolicy } from "./enums/payment-policy.enum";
export type { PriceType } from "./enums/price-type.enum";

export interface SalonPhoto {
  url: string;
  secure_url: string;
  public_id?: string;
}

export interface BusinessDayHours {
  start_time?: string;
  end_time?: string;
  open?: string;
  close?: string;
  is_closed?: boolean;
}

export interface SalonCategory {
  id?: number;
  uuid?: string;
  name: string;
  logo?: string;
}

export interface Salon {
  id?: number;
  uuid: string;
  name: string;
  slug?: string;
  about?: string;
  logo?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  map_link?: string;
  type?: string;
  phone?: string;
  email?: string;
  business_hours?: Record<string, BusinessDayHours | string | any>;
  photos?: SalonPhoto[] | string[];
  allowed_payment_policies?: string[];
  payment_policy?: PaymentPolicy;
  deposit_percentage?: number | null;
  is_accepting_bookings?: boolean;
  categories?: SalonCategory[];
  services?: Service[];
  staff?: Staff[];
  holidays?: any[];
}

export interface Service {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  logo?: string;
  parent_id: number | null;
  category_id?: number | null;
  category?: SalonCategory;
  gender?: Gender | string;
  price_type?: PriceType | string;
  price: number;
  duration: number;
  is_active?: boolean;
}

export interface Staff {
  id?: number;
  uuid: string;
  first_name: string;
  last_name?: string;
  title?: string;
  role?: string;
  gender?: Gender | string;
  photos?: {
    url?: string;
    secure_url?: string;
  };
  is_active?: boolean;
}
