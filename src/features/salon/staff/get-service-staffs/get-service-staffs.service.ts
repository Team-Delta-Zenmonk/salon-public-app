import { axiosInstance } from "../../../../config/axios";

export const getServiceStaffsService = async (serviceUuid: string, salonId: string) => {
  try {
    const res = await axiosInstance.get(`/storefront/${salonId}/services/${serviceUuid}/staffs`, {
      params: { salon_id: salonId },
    });
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      const res = await axiosInstance.get(`/salons/services/${serviceUuid}/staffs`, {
        params: { salon_id: salonId },
      });
      return res.data;
    }
    throw error;
  }
};
