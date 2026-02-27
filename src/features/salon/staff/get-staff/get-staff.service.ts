import { axiosInstance } from "../../../../config/axios";

export const getStaffService = async (staffUuid: string, salonId: string) => {
  const res = await axiosInstance.get(`/salons/staffs/${staffUuid}`, {
    params: { salon_id: salonId },
  });
  return res.data;
};
