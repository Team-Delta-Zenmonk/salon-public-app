import { axiosInstance } from "../../../config/axios";

export const downloadInvoiceService = async (bookingUuid: string): Promise<string> => {
  const response = await axiosInstance.get(`/invoices/booking/${bookingUuid}/download`);
  const invoiceUrl = response.data?.url;
  if (!invoiceUrl) {
    throw new Error("Invoice PDF not found");
  }
  return invoiceUrl;
};
