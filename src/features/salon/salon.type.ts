export type SalonCategory = {
  id: number;
  uuid?: string;
  name: string;
};

export type Salon = {
  id: number;
  uuid: string;
  name: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
  logo?: string | null;
  distance?: number | null;
  categories?: SalonCategory[];
  created_at?: string;
  updated_at?: string;
};

export type ListSalonsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  range?: number;
};

export type ListSalonsResponse = {
  total: number;
  page?: number;
  limit?: number;
  data: Salon[];
};
