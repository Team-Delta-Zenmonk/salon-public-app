import { useState, useCallback } from "react";
import { downloadInvoiceService } from "../download-invoice/download-invoice.service";
import { callSnack } from "../../../components/snackbar";

export const useDownloadInvoice = () => {
  const [downloadingUuid, setDownloadingUuid] = useState<string | null>(null);

  const downloadInvoice = useCallback(async (bookingOrUuid: string | { uuid: string } | undefined) => {
    const bookingUuid = typeof bookingOrUuid === "string" ? bookingOrUuid : bookingOrUuid?.uuid;

    if (!bookingUuid) {
      callSnack("Booking identifier not found", "error");
      return;
    }

    setDownloadingUuid(bookingUuid);
    try {
      const url = await downloadInvoiceService(bookingUuid);
      if (url) {
        window.open(url, "_blank");
      } else {
        callSnack("Your invoice is being generated. Please check back in a moment!", "info");
      }
    } catch (err: any) {
      console.error("Failed to download invoice:", err);
      callSnack("Your invoice is being generated. Please check back in a moment!", "info");
    } finally {
      setDownloadingUuid(null);
    }
  }, []);

  return { downloadInvoice, downloadingUuid };
};
