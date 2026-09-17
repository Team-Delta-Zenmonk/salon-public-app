import type { Gender } from "./enums/gender.enum";
import type { PaymentPolicy } from "./enums/payment-policy.enum";
import type { PriceType } from "./enums/price-type.enum";

export type { Gender } from "./enums/gender.enum";
export type { PaymentPolicy } from "./enums/payment-policy.enum";
export type { PriceType } from "./enums/price-type.enum";

export interface SalonPhoto {
  url: string;
  secure_url: string;
  public_id: string;
}

export interface Salon {
  id: number;
  uuid: string;
  name: string;
  logo: string;
  address: string;
  type: Gender;
  payment_policy: PaymentPolicy;
  deposit_percentage: number | null;
  photos: SalonPhoto[];
  services: Service[];
  staff: Staff[];
}

export interface Service {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  logo?: string;
  parent_id: number | null;
  gender: Gender;
  price_type: PriceType;
  price: number;
  duration: number;
}

export interface Staff {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  photos?: {
    secure_url: string;
  };
}
