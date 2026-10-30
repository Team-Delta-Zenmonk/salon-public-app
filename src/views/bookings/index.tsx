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
import { RescheduleModal } from "./_components/reschedule-modal";
import CustomSelect from "@/components/custom-select";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";
import { getPaymentCompleted, clearPaymentCompleted } from "../../features/salon/cart/cart.utils";
import { useDownloadInvoice } from "../../features/customer-booking/hooks/use-download-invoice";
import { useStorefront } from "../../providers/storefront-provider";
import styles from "./bookings.module.css";

const WEBHOOK_SETTLE_DELAY_MS = 3000;

export default function Bookings() {
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();

  const { bookings, total, page, isLoading, isFetchingMore } = useAppSelector(
    (state) => state.customerBooking
  );
  const { handleCancelActiveBooking, handleContinueActiveBooking, isCancelling, isContinuing } =
    useActiveBookingActions();

  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<CustomerBooking | null>(null);

  const paymentJustDone = useRef(getPaymentCompleted());
  const salonId = salon?.uuid;

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
    dispatch(resetCustomerBookings());

    const fetchInitialData = async () => {
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
            salon_id: salonId,
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchInitialData();
  }, [dispatch, tabValue, salonId]);

  const fetchMoreData = async () => {
    if (!isLoading && !isFetchingMore && total > 0 && bookings.length < total) {
      try {
        await dispatch(
          getCustomerBookingsAction({
            page: page + 1,
            limit: 10,
            status: getStatusFromTab(tabValue),
            salon_id: salonId,
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to fetch more bookings:", err);
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

  const handleOpenReschedule = (booking: CustomerBooking) => {
    setRescheduleTarget(booking);
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = async () => {
    dispatch(resetCustomerBookings());
    try {
      await dispatch(
        getCustomerBookingsAction({
          page: 1,
          limit: 10,
          status: getStatusFromTab(tabValue),
          salon_id: salonId,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to refresh bookings after reschedule:", err);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    await handleCancelActiveBooking(selectedBooking.uuid);
    setCancelDialogOpen(false);
    setSelectedBooking(null);

    dispatch(resetCustomerBookings());
    try {
      await dispatch(
        getCustomerBookingsAction({
          page: 1,
          limit: 10,
          status: getStatusFromTab(tabValue),
          salon_id: salonId,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to refresh bookings:", err);
    }
  };

  const isProcessing = isContinuing || isCancelling;
  const { downloadInvoice: handleDownloadInvoice, downloadingUuid } = useDownloadInvoice();

  const renderBookingList = () => {
    if (isLoading) {
      return (
        <Box className={styles.listSkeletonLoaderInitial}>
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
        </Box>
      );
    }

    if (bookings.length > 0) {
      return bookings.map((booking) => (
        <Fade in key={booking.uuid} timeout={400}>
          <Box>
            <BookingCard
              booking={booking}
              onPayNow={handlePayNow}
              onCancel={handleOpenCancelDialog}
              onReschedule={handleOpenReschedule}
              onDownloadInvoice={handleDownloadInvoice}
              downloadingUuid={downloadingUuid}
              disabled={isProcessing}
            />
          </Box>
        </Fade>
      ));
    }

    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>
          No {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} bookings found
        </p>
        <p className={styles.emptySub}>
          {tabValue === 0
            ? "Book your first salon appointment today!"
            : `Your ${getStatusFromTab(tabValue)?.toLowerCase()} list is empty.`}
        </p>
      </div>
    );
  };

  return (
    <Box className={styles.bookingsPage}>
      <main className={styles.mainContainer}>
        <section className={styles.heroHeader}>
          <div className={styles.heroFlex}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.breadcrumb}>
                <span>MY ACCOUNT</span>
                <ChevronRightIcon />
                <span>BOOKINGS HISTORY</span>
              </div>
              <div className={styles.titleRow}>
                <h1 className={styles.mainTitle}>
                  My Appointments &amp; Bookings
                </h1>
                <span className={styles.badge}>
                  <VerifiedIcon />
                  QUALITY GUARANTEE
                </span>
              </div>
              <p className={styles.subtitle}>
                Review your salon appointments, scheduled services, and invoices.
              </p>
            </div>

            <div className={styles.mobileSelectWrapper}>
              <CustomSelect
                label="Status:"
                value={tabValue}
                options={[
                  { id: 0, label: "ALL" },
                  { id: 1, label: "PENDING" },
                  { id: 2, label: "CONFIRMED" },
                  { id: 3, label: "CANCELLED" },
                  { id: 4, label: "EXPIRED" },
                ]}
                onChange={(val) => setTabValue(Number(val))}
                buttonSize="md"
                maxChars={15}
                menuMaxChars={18}
                menuWidth={180}
              />
            </div>

            <div className={styles.tabGroup}>
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
                  className={`${styles.tabBtn} ${tabValue === tab.idx ? styles.tabBtnActive : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.listContainer}>
          <InfiniteScroll
            dataLength={bookings.length}
            next={fetchMoreData}
            hasMore={!isLoading && total > 0 && bookings.length < total}
            loader={
              <Box className={styles.listSkeletonLoader}>
                <BookingSkeleton />
                <BookingSkeleton />
              </Box>
            }
            endMessage={
              bookings.length > 0 && !isLoading ? (
                <Box className={styles.endMessage}>
                  <Typography variant="body2" className={styles.endMessageText}>
                    End of {tabValue === 0 ? "" : getStatusFromTab(tabValue)?.toLowerCase()} ceremonies
                  </Typography>
                </Box>
              ) : null
            }
          >
            {renderBookingList()}
            {!isLoading && bookings.length > 0 && bookings.length < total && <Box className={styles.listEndSpacer} />}
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

          <RescheduleModal
            open={rescheduleModalOpen}
            booking={rescheduleTarget}
            onClose={() => {
              setRescheduleModalOpen(false);
              setRescheduleTarget(null);
            }}
            onSuccess={handleRescheduleSuccess}
          />
        </div>
      </main>
    </Box>
  );
}