export type Gender = "male" | "female" | "unisex";

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
  price_type: "from" | "fixed";
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
