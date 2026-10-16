import { axiosInstance } from "../../../../config/axios";

export const getServiceStaffsService = async (
  serviceUuid: string,
  salonId: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const res = await axiosInstance.get(`/storefront/${salonId}/services/${serviceUuid}/staffs`, {
      params: { salon_id: salonId, page, limit },
    });
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      const res = await axiosInstance.get(`/salons/services/${serviceUuid}/staffs`, {
        params: { salon_uuid: salonId, salon_id: salonId, page, limit },
      });
      return res.data;
    }
    throw error;
  }
};
