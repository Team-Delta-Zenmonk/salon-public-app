"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EllipsisCell from "@/components/ellipse-cell";
import InfiniteScroll from "react-infinite-scroll-component";
import clsx from "clsx";
import { getDiscountedPrice } from "@/common/discount.utils";
import styles from "./sub-services-modal.module.css";

const PAGE_SIZE = 10;

export interface SubServicesModalProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
  subServices: any[];
  isSubAdded: (subId: string) => boolean;
  onToggleCart?: (sub: any) => void;
  loadingIds?: string[];
}

export const SubServicesModal: React.FC<SubServicesModalProps> = ({
  open,
  onClose,
  serviceName,
  subServices = [],
  isSubAdded,
  onToggleCart,
  loadingIds = [],
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open, subServices]);

  const displayedSubServices = useMemo(() => {
    return subServices.slice(0, page * PAGE_SIZE);
  }, [subServices, page]);

  const hasMore = displayedSubServices.length < subServices.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: { className: styles.backdrop },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.iconCircle}>
            <ContentCutOutlinedIcon className={styles.titleIcon} />
          </div>
          <div>
            <Typography className={styles.titleHeading}>
              <EllipsisCell value={serviceName} maxChars={10} className="capitalize" />
            </Typography>
            <div className={styles.subtitle}>
              Bookable Sub-Services ({subServices.length})
            </div>
          </div>
        </div>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          className={styles.closeButton}
        >
          <CloseIcon className={styles.closeIcon} />
        </IconButton>
      </DialogTitle>

      <DialogContent id="sub-services-modal-scroll-target" className={styles.dialogContent}>
        {subServices.length === 0 ? (
          <div className={styles.emptyState}>
            No sub-services available for this treatment.
          </div>
        ) : (
          <InfiniteScroll
            dataLength={displayedSubServices.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="sub-services-modal-scroll-target"
            loader={
              <Box className={styles.scrollLoaderBox}>
                <CircularProgress size={24} />
              </Box>
            }
            scrollThreshold={0.8}
            style={{ overflow: "visible" }}
          >
            <div className={styles.subServicesList}>
              {displayedSubServices.map((sub: any) => {
                const subId = sub.uuid || sub.id;
                const subAdded = isSubAdded(subId);
                const isSubLoading = loadingIds.includes(subId);

                return (
                  <div
                    key={subId}
                    className={clsx(
                      styles.subServiceItem,
                      subAdded ? styles.subServiceItemActive : styles.subServiceItemDefault
                    )}
                  >
                    <div className={styles.subServiceInfo}>
                      <div className={styles.subServiceNameRow}>
                        <EllipsisCell
                          value={sub.name}
                          maxChars={25}
                          className={styles.subServiceName}
                        />
                        {sub.duration && (
                          <span className={styles.subServiceDuration}>
                            {sub.duration} min
                          </span>
                        )}
                      </div>
                      {sub.description && (
                        <EllipsisCell
                          value={sub.description}
                          maxLines={2}
                          maxChars={80}
                          className={styles.subServiceDesc}
                        />
                      )}
                    </div>

                    <div className={styles.subServiceActions}>
                      {(() => {
                        const discountInfo = getDiscountedPrice(sub);
                        return discountInfo.hasDiscount ? (
                          <div className={styles.discountPriceRow}>
                            <span className={styles.originalPriceCrossed}>
                              ₹{discountInfo.originalPrice}
                            </span>
                            <span className={styles.subServicePrice}>
                              ₹{discountInfo.finalPrice}
                            </span>
                            {discountInfo.discountBadge && (
                              <span className={styles.discountBadge}>
                                {discountInfo.discountBadge}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={styles.subServicePrice}>₹{sub.price}</span>
                        );
                      })()}
                      <button
                        type="button"
                        disabled={isSubLoading}
                        onClick={() => onToggleCart?.(sub)}
                        className={clsx(
                          styles.subServiceBtn,
                          isSubLoading && styles.subServiceBtnDisabled,
                          subAdded ? styles.subServiceBtnRemove : styles.subServiceBtnAdd
                        )}
                      >
                        {isSubLoading ? (
                          <>
                            <span className={styles.spinner} />
                            <span>{subAdded ? "REMOVING..." : "ADDING..."}</span>
                          </>
                        ) : (
                          <>
                            {subAdded ? (
                              <RemoveIcon className={styles.subServiceBtnIcon} />
                            ) : (
                              <AddIcon className={styles.subServiceBtnIcon} />
                            )}
                            <span>{subAdded ? "REMOVE" : "ADD"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubServicesModal;
