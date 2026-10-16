import { axiosInstance } from "../../../config/axios";

export interface GetStorefrontServicesParams {
  slug: string;
  page?: number;
  limit?: number;
  category_id?: number | string;
  search?: string;
  gender?: string;
}

export const getStorefrontServicesService = async ({
  slug,
  ...params
}: GetStorefrontServicesParams) => {
  const response = await axiosInstance.get(`/storefront/${slug}/services`, { params });
  return response.data;
};

