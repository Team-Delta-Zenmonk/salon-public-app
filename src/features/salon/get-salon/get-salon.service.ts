import { axiosInstance } from "../../../config/axios";

export const getSalonService = async (uuid: string) => {
  const response = await axiosInstance.get(`/salons/${uuid}`);
  return response.data;
};
