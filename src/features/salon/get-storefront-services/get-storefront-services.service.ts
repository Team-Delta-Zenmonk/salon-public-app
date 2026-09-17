import { axiosInstance } from "../../../config/axios";

export const getStorefrontServicesService = async (slug: string) => {
  const response = await axiosInstance.get(`/storefront/${slug}/services`);
  return response.data;
};
