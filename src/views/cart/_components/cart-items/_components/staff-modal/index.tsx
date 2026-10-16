"use client";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, Avatar, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfiniteScroll from "react-infinite-scroll-component";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./staff-modal.module.css";

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  staffList: any[];
  selectedStaffId: string | null;
  onSelectStaff: (entry: any) => void;
  serviceName?: string;
  hasMore: boolean;
  onFetchMore: () => Promise<void> | void;
  loadingMore?: boolean;
}

export default function StaffModal({
  open,
  onClose,
  staffList,
  selectedStaffId,
  onSelectStaff,
  serviceName,
  hasMore,
  onFetchMore,
  loadingMore,
}: Readonly<StaffModalProps>) {
  const handleCardClick = (entry: any) => {
    onSelectStaff(entry);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { className: styles.dialogPaper } }}
    >
      <DialogContent className={styles.content}>
        <Box className={styles.header}>
          <Box className={styles.titleArea}>
            <Typography className={styles.title}>
              Select Specialist
            </Typography>
            <Typography className={styles.subtitle}>
              {serviceName ? `Choose a specialist for ${serviceName}` : "Choose your preferred specialist"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} className={styles.closeBtn}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box id="staff-modal-scroll" className={styles.scrollList}>
          <InfiniteScroll
            dataLength={staffList.length}
            next={onFetchMore}
            hasMore={hasMore}
            scrollableTarget="staff-modal-scroll"
            loader={
              <Box className={styles.loaderWrapper}>
                <CircularProgress size={24} className={styles.loader} />
              </Box>
            }
          >
            <Box className={styles.grid}>
              {staffList.map((entry: any, index: number) => {
                const staff = entry.staff;
                const isSelected = selectedStaffId === staff?.uuid;
                const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();

                return (
                  <Box
                    key={entry.uuid || staff?.uuid || `${entry.staff_id}-${index}`}
                    onClick={() => handleCardClick(entry)}
                    className={`${styles.staffCard} ${isSelected ? styles.staffCardSelected : ""}`}
                  >
                    <Avatar
                      src={staff?.photos?.secure_url ?? staff?.photos?.url}
                      className={`${styles.avatar} ${isSelected ? styles.avatarSelected : ""}`}
                    >
                      {staffName[0]}
                    </Avatar>
                    <Box className={styles.info}>
                      <EllipsisCell
                        value={staffName}
                        className={`${styles.name} ${isSelected ? styles.nameSelected : ""}`}
                        maxChars={20}
                      />
                      {entry.price && (
                        <Typography className={styles.price}>
                          ₹{Math.round(Number.parseFloat(String(entry.price)))}
                        </Typography>
                      )}
                      {isSelected && (
                        <Typography className={styles.selectedBadge}>
                          Selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </InfiniteScroll>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
