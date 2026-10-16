import { axiosInstance } from "../../../config/axios";

export interface GetStorefrontStaffParams {
  slug: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const getStorefrontStaffService = async ({
  slug,
  ...params
}: GetStorefrontStaffParams) => {
  const response = await axiosInstance.get(`/storefront/${slug}/staff`, { params });
  return response.data;
};
