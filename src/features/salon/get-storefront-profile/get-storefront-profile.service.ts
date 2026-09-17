import { axiosInstance } from "../../../config/axios";

export const getStorefrontProfileService = async (slug: string) => {
  const response = await axiosInstance.get(`/storefront/${slug}/profile`);
  return response.data;
};
