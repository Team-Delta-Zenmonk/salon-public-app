"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Tabs, Tab, Fade } from "@mui/material";
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
import { callSnack } from "../../components/snackbar";
import styles from "./booking.module.scss";

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
          }),
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
          }),
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
        }),
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
      <Box className="py-16 text-center bg-(--app-surface) rounded-2xl border border-(--app-primary)/15 border-dashed p-8">
        <Typography variant="h6" className="font-editorial text-xl font-bold text-(--app-text) mb-2">
          No {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} reservations found
        </Typography>
        <Typography variant="body2" className="text-xs text-(--app-muted)/70">
          {tabValue === 0
            ? "Reserve your first haute salon ceremony!"
            : `Your ${getStatusFromTab(tabValue)?.toLowerCase()} dossier is empty.`}
        </Typography>
      </Box>
    );
  };

  return (
    <Box className="min-h-screen bg-(--app-bg) text-(--app-text) py-8 sm:py-12">
      <Box className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6">
        <Box className="w-full shrink-0 mb-8">
          <Typography className="font-editorial text-3xl sm:text-4xl font-bold text-(--app-text) mb-2">
            My Dossier & Ceremonies
          </Typography>
          <Typography className="text-xs text-(--app-muted)/70 font-mono tracking-wider uppercase">
            Curated history of your luxury appointments
          </Typography>

          <Box className="border-b border-(--app-primary)/15 mt-6 mb-8">
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-indicator": { backgroundColor: "var(--app-primary)", height: 3 },
                "& .MuiTab-root": {
                  color: "var(--app-muted)/60",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  "&.Mui-selected": { color: "var(--app-primary)" },
                },
              }}
            >
              <Tab label="All" />
              <Tab label="Pending" />
              <Tab label="Confirmed" />
              <Tab label="Cancelled" />
              <Tab label="Expired" />
            </Tabs>
          </Box>
        </Box>

        <Box className="w-full">
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
                <Box className="pb-4 pt-6">
                  <Typography variant="body2" className="text-xs text-(--app-muted)/50 text-center font-mono uppercase tracking-widest">
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
        </Box>
      </Box>
    </Box>
  );
}