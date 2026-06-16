import type { Salon } from "./salon.type";

export interface CartServiceSnapshot {
  uuid: string;
  name: string;
  logo?: string;
  gender: string;
  duration: number;
  price: number;
}

export interface CartItem {
  uuid?: string;
  service_id: string;
  base_price: number;
  final_price: number;
  duration: number;
  service: CartServiceSnapshot;
}

export interface CartState {
  cartUuid: string | null;
  salonId: string | null;
  salon: Pick<Salon, "uuid" | "name" | "logo" | "address" | "type" | "payment_policy" | "deposit_percentage"> | null;
  items: CartItem[];
  isGuest: boolean;
  loaded: boolean;
}
