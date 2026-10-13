import { Dialog, DialogContent, Avatar, Typography, Box, Button, CircularProgress } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./confirm-staff-dialog.module.css";

interface ConfirmStaffDialogProps {
  open: boolean;
  currentStaff: { name: string; photo?: string } | null;
  newStaff: { name: string; photo?: string } | null;
  price?: string | number;
  duration?: number;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmStaffDialog({
  open,
  currentStaff,
  newStaff,
  price,
  duration,
  loading,
  onConfirm,
  onCancel,
}: Readonly<ConfirmStaffDialogProps>) {
  const isChange = !!currentStaff;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{ paper: { className: styles.dialogPaper } }}
    >
      <DialogContent className={styles.content}>
        <Box className={styles.header}>
          <Box className={styles.iconRow}>
            {isChange ? (
              <SwapHorizIcon sx={{ color: "var(--color-primary)", fontSize: 28 }} />
            ) : (
              <PersonAddAltIcon sx={{ color: "var(--color-primary)", fontSize: 28 }} />
            )}
          </Box>
          <Typography className={styles.title}>
            {isChange ? "Change Staff?" : "Assign Staff?"}
          </Typography>
          <Typography className={styles.subtitle}>
            {isChange
              ? "This will replace your current staff selection"
              : "This staff will be assigned to this service"}
          </Typography>
        </Box>

        <Box className={styles.body}>
          {isChange ? (
            <Box className={styles.changeRow}>
              <Box className={styles.staffCol}>
                <Typography className={styles.label}>Current</Typography>
                <Avatar src={currentStaff?.photo} className={styles.avatar}>
                  {currentStaff?.name?.[0]}
                </Avatar>
                <EllipsisCell value={currentStaff?.name} className={styles.nameText} maxChars={10} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <SwapHorizIcon sx={{ fontSize: 22, color: "var(--app-muted)" }} />
              </Box>
              <Box className={styles.staffCol}>
                <Typography className={styles.label}>New</Typography>
                <Avatar src={newStaff?.photo} className={styles.avatarNew}>
                  {newStaff?.name?.[0]}
                </Avatar>
                <EllipsisCell value={newStaff?.name ?? ""} className={styles.nameText} maxChars={10} />
              </Box>
            </Box>
          ) : (
            <Box className={styles.singleStaffBox}>
              <Avatar src={newStaff?.photo} className={styles.avatarNew}>
                {newStaff?.name?.[0]}
              </Avatar>
              <EllipsisCell value={newStaff?.name ?? ""} className={styles.nameText} maxChars={10} />
            </Box>
          )}

          {(price || duration) && (
            <Box className={styles.metaGrid}>
              {price && (
                <Box className={styles.metaCard}>
                  <Typography className={styles.metaLabel}>Price</Typography>
                  <Typography className={styles.metaVal}>
                    ₹{Math.round(Number.parseFloat(String(price)))}
                  </Typography>
                </Box>
              )}
              {duration && (
                <Box className={styles.metaCard}>
                  <Typography className={styles.metaLabel}>Duration</Typography>
                  <Typography className={styles.metaVal}>{duration} min</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box className={styles.footer}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            className={styles.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={onConfirm}
            disabled={loading}
            className={styles.confirmBtn}
          >
            {loading ? <CircularProgress size={16} sx={{ color: "white", mr: 1 }} /> : null}
            {loading
              ? isChange ? "Changing..." : "Assigning..."
              : isChange ? "Change" : "Assign"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
