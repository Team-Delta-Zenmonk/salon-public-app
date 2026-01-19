import { axiosInstance } from "../../../config/axios";

export interface LoginCustomerPayload {
  token: string;
}

export const loginCustomerService = async (payload: LoginCustomerPayload) => {
  const res = await axiosInstance.post("/auth/login/customer", payload);
  return res.data;
};
