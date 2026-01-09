export interface CartService {
  uuid: string;
  service_id: string;
  service_name: string;
  staff_id?: string;
  staff_name?: string;
  price: number;
  duration: number;
  sequence?: number;
}

export interface Cart {
  uuid: string;
  salon_id: string;
  services: CartService[];
  total_price: number;
  total_duration: number;
}

export interface CartState {
  cart: Cart | null;
}
