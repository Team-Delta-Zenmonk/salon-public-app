import { axiosInstance } from "../../../config/axios";
import type { ServiceGender } from "../../../common/enums/gender.enum";

export interface GetStorefrontServicesParams {
  slug: string;
  page?: number;
  limit?: number;
  category_id?: number | string;
  search?: string;
  gender?: ServiceGender | string;
}

export const getStorefrontServicesService = async ({
  slug,
  ...params
}: GetStorefrontServicesParams) => {
  const response = await axiosInstance.get(`/storefront/${slug}/services`, { params });
  return response.data;
};

