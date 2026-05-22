import React, { useEffect, useState } from "react";
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
import styles from "./booking.module.scss";

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
              disabled={isProcessing}
            />
          </Box>
        </Fade>
      ));
    }

    return (
      <Box className="py-12 text-center bg-(--app-surface) rounded-2xl border border-(--app-border) border-dashed">
        <Typography variant="h6" className="text-(--app-muted) mb-1 font-semibold">
          No {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} bookings found
        </Typography>
        <Typography variant="body2" className="text-(--app-muted) opacity-80">
          {tabValue === 0
            ? "Start booking your first salon experience!"
            : `Your ${getStatusFromTab(tabValue)?.toLowerCase()} history is empty.`}
        </Typography>
      </Box>
    );
  };

  return (
    <Box className="flex flex-col h-full min-h-0 px-3 sm:px-4 lg:px-8 lg:pr-10 pt-4 sm:pt-6">
      <Box className="w-full shrink-0">
        <Typography variant="h4" className="font-extrabold text-(--app-text) mb-4 sm:mb-6">
          My Bookings
        </Typography>

        <Box className="border-b border-(--app-border) mb-6">
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            className={styles.tabs}
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Confirmed" />
            <Tab label="Cancelled" />
            <Tab label="Expired" />
          </Tabs>
        </Box>
      </Box>

      <Box className="flex-1 min-h-0 relative">
        <Box
          id="scrollable-bookings"
          className={`h-full overflow-y-auto w-full pt-2 pr-2 sm:pr-4 pl-2 ${styles.scrollableList}`}
        >
          <InfiniteScroll
            scrollableTarget="scrollable-bookings"
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
                <Box className="pb-12 pt-6">
                  <Typography variant="body2" className="text-(--app-muted) text-center font-medium opacity-60">
                    You've reached the end of your {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()}{" "}
                    bookings
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
            title="Cancel Booking?"
            description="Are you sure you want to cancel this booking? This action cannot be undone."
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