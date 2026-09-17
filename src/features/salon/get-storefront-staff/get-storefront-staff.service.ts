import { axiosInstance } from "../../../config/axios";

export const getStorefrontStaffService = async (slug: string) => {
  const response = await axiosInstance.get(`/storefront/${slug}/staff`);
  return response.data;
};
