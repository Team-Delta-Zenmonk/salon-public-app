import { Dialog, DialogContent, Avatar, Typography, Box, Button, CircularProgress } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

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
      slotProps={{
        paper: {
          className: "rounded-2xl max-w-[380px] w-full mx-2",
        },
      }}
    >
      <DialogContent className="p-0 overflow-hidden">
        <Box className="bg-(--app-surface-alt) px-5 py-4 text-center border-b border-(--app-border)">
          <Box className="flex justify-center mb-2">
            {isChange ? (
              <SwapHorizIcon className="text-(--app-primary) text-[28px]" />
            ) : (
              <PersonAddAltIcon className="text-(--app-primary) text-[28px]" />
            )}
          </Box>
          <Typography className="text-(--app-text) text-[16px] font-bold">
            {isChange ? "Change Staff?" : "Assign Staff?"}
          </Typography>
          <Typography className="text-[11px] text-(--app-muted)">
            {isChange
              ? "This will replace your current staff selection"
              : "This staff will be assigned to this service"}
          </Typography>
        </Box>

        <Box className="px-5 py-4">
          {isChange ? (
            <Box className="flex items-center justify-between gap-3">
              <Box className="flex flex-col items-center gap-1.5 flex-1">
                <Typography className="text-(--app-muted) uppercase tracking-wide text-[10px] font-semibold">
                  Current
                </Typography>
                <Avatar src={currentStaff?.photo} className="w-13 h-13 border-2 border-(--app-border)">
                  {currentStaff?.name?.[0]}
                </Avatar>
                <Typography className="text-(--app-text) font-semibold text-center text-xs max-w-20 truncate">
                  {currentStaff?.name}
                </Typography>
              </Box>

              <Box className="flex flex-col items-center">
                <SwapHorizIcon className="text-(--app-muted) text-[22px]" />
              </Box>

              <Box className="flex flex-col items-center gap-1.5 flex-1">
                <Typography className="text-(--app-muted) uppercase tracking-wide text-[10px] font-semibold">
                  New
                </Typography>
                <Avatar src={newStaff?.photo} className="w-13 h-13 border-2 border-(--app-primary)">
                  {newStaff?.name?.[0]}
                </Avatar>
                <Typography className="text-(--app-text) font-bold text-center text-xs max-w-20 truncate">
                  {newStaff?.name}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className="flex flex-col items-center gap-2 py-2">
              <Avatar src={newStaff?.photo} className="w-15 h-15 border-2 border-(--app-primary)">
                {newStaff?.name?.[0]}
              </Avatar>
              <Typography className="text-(--app-text) text-sm font-bold">{newStaff?.name}</Typography>
            </Box>
          )}

          {(price || duration) && (
            <Box className="flex gap-3 mt-4">
              {price && (
                <Box className="flex-1 bg-(--app-surface-alt) border border-(--app-border) rounded-xl p-3 text-center">
                  <Typography className="text-(--app-muted) block text-[10px] uppercase tracking-wide">Price</Typography>
                  <Typography className="text-(--app-text) text-sm font-extrabold">
                    ₹{Math.round(Number.parseFloat(String(price)))}
                  </Typography>
                </Box>
              )}
              {duration && (
                <Box className="flex-1 bg-(--app-surface-alt) border border-(--app-border) rounded-xl p-3 text-center">
                  <Typography className="text-(--app-muted) block text-[10px] uppercase tracking-wide">Duration</Typography>
                  <Typography className="text-(--app-text) text-sm font-extrabold">{duration} min</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box className="flex gap-2 px-5 pb-5">
          <Button
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl font-semibold border-(--app-border) text-(--app-muted) hover:border-(--app-primary) hover:bg-(--app-primary-soft) normal-case"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl font-bold normal-case"
          >
            {loading ? <CircularProgress size={16} className="text-white mr-2" /> : null}
            {loading ? (isChange ? "Changing..." : "Assigning...") : (isChange ? "Change" : "Assign")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
