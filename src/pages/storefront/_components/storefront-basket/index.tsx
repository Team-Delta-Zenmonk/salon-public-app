import { Box, Typography, Button, IconButton, Divider } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { calculateTotals } from "../../../../common/cart.utils";
import { formatDuration } from "../../../../common/date.utils";
import { removeItemLocal } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import { callSnack } from "../../../../components/snackbar";

interface StorefrontBasketProps {
  salon: any;
  variant?: "desktop-card" | "mobile-floating" | "both";
  onProceed?: () => void;
}

export default function StorefrontBasket({
  salon,
  variant = "both",
  onProceed,
}: Readonly<StorefrontBasketProps>) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const items = cart.items || [];
  const { totalPrice, totalDuration } = calculateTotals(items);
  const durationText = formatDuration(totalDuration);

  const handleRemove = async (item: any) => {
    try {
      if (!isAuthenticated) {
        dispatch(removeItemLocal(item.service_id || item.service?.uuid));
        callSnack("Removed from basket", "info");
        return;
      }

      if (item.uuid) {
        await dispatch(removeCartItemAction(item.uuid)).unwrap();
        callSnack("Removed from basket", "info");
      }
    } catch {
      callSnack("Failed to remove item", "error");
    }
  };

  const handleProceed = () => {
    if (onProceed) {
      onProceed();
    } else {
      navigate("/cart");
    }
  };

  const renderDesktopCard = () => (
    <Box className="hidden lg:block w-full sticky top-24 rounded-3xl border border-(--app-border) bg-(--app-surface) shadow-[0_16px_40px_rgba(15,23,42,0.08)] overflow-hidden">
      <Box className="px-5 py-4 border-b border-(--app-border) bg-(--app-surface-alt) flex items-center justify-between">
        <Box className="flex items-center gap-2.5">
          <ShoppingBagOutlinedIcon className="text-(--app-primary) text-[20px]" />
          <Typography className="font-bold text-sm text-(--app-text)">Selected Treatments</Typography>
        </Box>
        <Box className="px-2.5 py-0.5 rounded-full bg-(--app-primary-soft) text-(--app-primary) font-bold text-xs">
          {items.length} {items.length === 1 ? "item" : "items"}
        </Box>
      </Box>

      <Box className="p-4 max-h-[380px] overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <Box className="py-10 px-4 text-center">
            <Typography className="text-sm font-semibold text-(--app-text)">Your basket is empty</Typography>
            <Typography className="text-xs text-(--app-muted) mt-1">
              Select any treatment to begin booking your appointment.
            </Typography>
          </Box>
        ) : (
          items.map((item: any) => {
            const name = item.name || item.service?.name || "Treatment";
            const price = item.final_price ?? item.base_price ?? item.service?.price ?? 0;
            const duration = item.duration ?? item.service?.duration;
            const itemId = item.uuid || item.service_id || item.service?.uuid;

            return (
              <Box
                key={itemId}
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-(--app-surface-alt)/60 border border-(--app-border)/80 hover:border-(--app-primary)/30 transition-all duration-200"
              >
                <Box className="min-w-0 flex-1">
                  <Typography className="text-xs font-bold text-(--app-text) truncate">{name}</Typography>
                  <Box className="flex items-center gap-2 mt-1 text-[11px] text-(--app-muted)">
                    {duration && (
                      <Box className="flex items-center gap-0.5">
                        <AccessTimeIcon className="text-[12px]" />
                        <span>{duration} min</span>
                      </Box>
                    )}
                    <span>•</span>
                    <span className="font-semibold text-(--app-text)">₹{price}</span>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemove(item)}
                  className="text-(--app-muted) hover:text-red-500 -mr-1 -mt-1"
                >
                  <DeleteOutlineIcon className="text-[16px]" />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      {items.length > 0 && (
        <Box className="p-5 border-t border-(--app-border) bg-(--app-surface) space-y-3">
          <Box className="flex items-center justify-between text-xs text-(--app-muted)">
            <span>Estimated Duration</span>
            <span className="font-semibold text-(--app-text)">{durationText}</span>
          </Box>

          <Divider className="border-(--app-border)" />

          <Box className="flex items-center justify-between">
            <Typography className="text-xs font-semibold text-(--app-muted)">Total Estimated</Typography>
            <Typography className="text-xl font-extrabold text-(--app-text)">₹{totalPrice}</Typography>
          </Box>

          {salon?.payment_policy && (
            <Box className="text-[11px] text-(--app-muted) text-center py-1 px-2 rounded-lg bg-(--app-surface-alt)">
              {salon.payment_policy === "pay_at_venue"
                ? "✓ Pay at venue after your appointment"
                : salon.payment_policy === "partial_deposit"
                ? `Requires ${salon.deposit_percentage || 20}% deposit at checkout`
                : "Full payment required to book"}
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleProceed}
            endIcon={<ArrowForwardIcon className="text-[16px]" />}
            className="rounded-2xl font-bold py-3 text-sm tracking-wide bg-(--app-primary) hover:brightness-110 shadow-lg shadow-(--app-primary)/20"
          >
            Continue to Book
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderMobileFloating = () => {
    if (items.length === 0) return null;

    return (
      <Box className="lg:hidden fixed bottom-4 left-3 right-3 z-40">
        <Box className="p-3 rounded-2xl border border-white/20 bg-black/90 backdrop-blur-xl shadow-[0_18px_36px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3 text-white">
          <Box className="min-w-0 pl-1">
            <Box className="flex items-center gap-1.5">
              <Box className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Typography className="text-xs font-bold text-white truncate">
                {items.length} {items.length === 1 ? "Treatment" : "Treatments"}
              </Typography>
            </Box>
            <Typography className="text-base font-extrabold text-white mt-0.5">
              ₹{totalPrice} <span className="text-[10px] font-normal text-white/70">({durationText})</span>
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            onClick={handleProceed}
            endIcon={<ArrowForwardIcon className="text-[16px]" />}
            className="rounded-xl font-bold px-4 py-2.5 text-xs bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110 shrink-0"
          >
            Book Now
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <>
      {(variant === "desktop-card" || variant === "both") && renderDesktopCard()}
      {(variant === "mobile-floating" || variant === "both") && renderMobileFloating()}
    </>
  );
}
