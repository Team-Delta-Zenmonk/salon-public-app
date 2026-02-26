import { axiosInstance } from "../../../../config/axios";

export const getServiceStaffService = async (serviceUuid: string, salonId: string) => {
  const res = await axiosInstance.get(`/salons/services/${serviceUuid}/staffs`, {
    params: { salon_id: salonId },
  });
  return res.data;
};
