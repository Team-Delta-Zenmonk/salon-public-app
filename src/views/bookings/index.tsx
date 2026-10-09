"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Fade } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getCustomerBookingsAction } from "../../features/customer-booking/get-customer-bookings/get-customer-bookings.action";
import { resetCustomerBookings } from "../../features/customer-booking/customer-booking.slice";
import { BookingCard } from "./_components/booking-card";
import { BookingSkeleton } from "./_components/booking-skeleton";
import { useActiveBookingActions } from "../../common/hooks/useActiveBookingActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { BookingStatus } from "../../common/booking.enums";
import type { CustomerBooking } from "../../common/booking.types";
import { ConfirmationDialog } from "../../components/dialogs";
import { getPaymentCompleted, clearPaymentCompleted } from "../../features/salon/cart/cart.utils";
import { useDownloadInvoice } from "../../features/customer-booking/hooks/use-download-invoice";

const WEBHOOK_SETTLE_DELAY_MS = 3000;

export default function Bookings() {
  const dispatch = useAppDispatch();

  const { bookings, total, page } = useAppSelector((state) => state.customerBooking);
  const { handleCancelActiveBooking, handleContinueActiveBooking, isCancelling, isContinuing } =
    useActiveBookingActions();

  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const paymentJustDone = useRef(getPaymentCompleted());

  const getStatusFromTab = (index: number) => {
    switch (index) {
      case 1:
        return BookingStatus.PENDING;
      case 2:
        return BookingStatus.CONFIRMED;
      case 3:
        return BookingStatus.CANCELLED;
      case 4:
        return BookingStatus.EXPIRED;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      dispatch(resetCustomerBookings());

      if (paymentJustDone.current) {
        paymentJustDone.current = false;
        clearPaymentCompleted();
        await new Promise((resolve) => setTimeout(resolve, WEBHOOK_SETTLE_DELAY_MS));
      }

      try {
        await dispatch(
          getCustomerBookingsAction({
            page: 1,
            limit: 10,
            status: getStatusFromTab(tabValue),
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [dispatch, tabValue]);

  const fetchMoreData = async () => {
    if (!isFetchingMore && total > 0 && bookings.length < total) {
      setIsFetchingMore(true);
      try {
        await dispatch(
          getCustomerBookingsAction({
            page: page + 1,
            limit: 10,
            status: getStatusFromTab(tabValue),
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to fetch more bookings:", err);
      } finally {
        setIsFetchingMore(false);
      }
    }
  };

  const handlePayNow = async (booking: CustomerBooking) => {
    handleContinueActiveBooking(booking as any);
  };

  const handleOpenCancelDialog = (booking: CustomerBooking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    await handleCancelActiveBooking(selectedBooking.uuid);
    setCancelDialogOpen(false);
    setSelectedBooking(null);

    setIsLoading(true);
    dispatch(resetCustomerBookings());
    try {
      await dispatch(
        getCustomerBookingsAction({
          page: 1,
          limit: 10,
          status: getStatusFromTab(tabValue),
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to refresh bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessing = isContinuing || isCancelling;
  const { downloadInvoice: handleDownloadInvoice, downloadingUuid } = useDownloadInvoice();

  const renderBookingList = () => {
    if (isLoading) {
      return (
        <Box className="space-y-4">
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
        </Box>
      );
    }

    if (bookings.length > 0) {
      return bookings.map((booking, index) => (
        <Fade in key={booking.uuid} style={{ transitionDelay: `${(index % 10) * 30}ms` }} timeout={400}>
          <Box>
            <BookingCard
              booking={booking}
              onPayNow={handlePayNow}
              onCancel={handleOpenCancelDialog}
              onDownloadInvoice={handleDownloadInvoice}
              downloadingUuid={downloadingUuid}
              disabled={isProcessing}
            />
          </Box>
        </Fade>
      ));
    }

    return (
      <div className="py-20 text-center bg-[#FCFAF7] rounded-[2px] border border-[#E5DFD5] border-dashed p-8">
        <p className="font-serif text-2xl font-medium text-[#1C1A17] mb-2">
          No {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} reservations found
        </p>
        <p className="font-sans text-xs text-[#766A5E]">
          {tabValue === 0
            ? "Reserve your first haute salon ceremony!"
            : `Your ${getStatusFromTab(tabValue)?.toLowerCase()} dossier is empty.`}
        </p>
      </div>
    );
  };

  return (
    <Box className="min-h-screen bg-[#FCF9F3] text-[#1C1C18] py-10 font-sans">
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-12 space-y-8">
        <section className="relative overflow-hidden rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5] p-6 md:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#735A37] font-sans text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span>CLIENT SUITE</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>RESERVATION DOSSIER</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1A17] font-normal">
                  My Dossier & Ceremonies
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[2px] bg-[#F2EEE7] border border-[#E5DFD5] text-[#1C1A17] font-sans text-[10px] font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-[#A88B64]">verified</span>
                  MASTER GUARANTEE
                </span>
              </div>
              <p className="font-sans text-xs text-[#766A5E] max-w-2xl leading-relaxed">
                Curated historical archive of your luxury salon appointments, treatments, and invoice receipts.
              </p>
            </div>

            <div className="flex items-center self-start md:self-center bg-[#FCFAF7] p-1 rounded-[2px] border border-[#E5DFD5] flex-wrap gap-1">
              {[
                { label: "ALL", idx: 0 },
                { label: "PENDING", idx: 1 },
                { label: "CONFIRMED", idx: 2 },
                { label: "CANCELLED", idx: 3 },
                { label: "EXPIRED", idx: 4 },
              ].map((tab) => (
                <button
                  key={tab.idx}
                  type="button"
                  onClick={() => setTabValue(tab.idx)}
                  className={`px-3.5 py-2 rounded-[2px] font-sans text-[11px] font-semibold tracking-wider transition-all border-0 cursor-pointer ${
                    tabValue === tab.idx
                      ? "bg-[#1C1A17] text-[#FCFAF7]"
                      : "text-[#766A5E] hover:text-[#1C1A17] bg-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full">
          <InfiniteScroll
            dataLength={bookings.length}
            next={fetchMoreData}
            hasMore={total > 0 && bookings.length < total}
            loader={
              <Box className="mt-4 space-y-4">
                <BookingSkeleton />
                <BookingSkeleton />
              </Box>
            }
            endMessage={
              bookings.length > 0 && !isLoading ? (
                <Box className="pb-4 pt-6 text-center">
                  <Typography variant="body2" className="text-[10px] text-[#766A5E] font-sans uppercase tracking-[0.14em] font-semibold">
                    End of {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} ceremonies
                  </Typography>
                </Box>
              ) : null
            }
          >
            {renderBookingList()}
            {!isLoading && bookings.length > 0 && bookings.length < total && <Box className="h-6 w-full" />}
          </InfiniteScroll>

          <ConfirmationDialog
            open={cancelDialogOpen}
            title="Cancel Reservation?"
            description="Are you sure you want to cancel this ceremony? This action cannot be undone."
            confirmText="Yes, Cancel"
            cancelText="No, Keep It"
            color="error"
            loading={isCancelling}
            onConfirm={handleConfirmCancel}
            onClose={() => setCancelDialogOpen(false)}
          />
        </div>
      </main>
    </Box>
  );
}