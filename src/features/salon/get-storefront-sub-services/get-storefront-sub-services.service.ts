import { axiosInstance } from "../../../config/axios";

export interface GetStorefrontSubServicesParams {
  slug: string;
  serviceUuid: string;
  page?: number;
  limit?: number;
}

export const getStorefrontSubServicesService = async ({
  slug,
  serviceUuid,
  ...params
}: GetStorefrontSubServicesParams) => {
  const response = await axiosInstance.get(`/storefront/${slug}/services/${serviceUuid}/sub-services`, {
    params,
  });
  return response.data;
};
