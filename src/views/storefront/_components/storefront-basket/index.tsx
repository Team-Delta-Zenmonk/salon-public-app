import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useStorefrontNavigate } from "../../../../common/hooks/useStorefrontNavigate";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { calculateTotals } from "../../../../common/cart.utils";
import { formatDuration } from "../../../../common/date.utils";
import { removeItemLocal } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import { callSnack } from "../../../../components/snackbar";
import styles from "./storefront-basket.module.css";

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
  const navigate = useStorefrontNavigate();
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
    <Box className={styles.desktopCard}>
      <Box className={styles.header}>
        <Box className={styles.titleGroup}>
          <ShoppingBagOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />
          <Typography className={styles.title}>Selected Treatments</Typography>
        </Box>
        <Box className={styles.itemBadge}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Box>
      </Box>

      <Box className={styles.itemList}>
        {items.length === 0 ? (
          <Box className={styles.emptyBox}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-on-surface)" }}>
              Your basket is empty
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "var(--color-tertiary)", mt: "4px" }}>
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
              <Box key={itemId} className={styles.itemCard}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography className={styles.itemTitle}>{name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", mt: "4px" }}>
                    {duration && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        <AccessTimeIcon sx={{ fontSize: 12, color: "var(--color-tertiary)" }} />
                        <Typography className={styles.metaText}>{duration} min</Typography>
                      </Box>
                    )}
                    <Typography className={styles.metaText}>•</Typography>
                    <Typography className={styles.itemPrice}>₹{price}</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => handleRemove(item)} className={styles.removeBtn}>
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      {items.length > 0 && (
        <Box className={styles.footer}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--color-tertiary)" }}>
            <span>Estimated Duration</span>
            <span style={{ fontWeight: 600, color: "var(--color-on-surface)" }}>{durationText}</span>
          </Box>

          <Divider sx={{ borderColor: "var(--color-hairline)" }} />

          <Box className={styles.totalRow}>
            <Typography className={styles.totalLabel}>Total Estimated</Typography>
            <Typography className={styles.totalValue}>₹{totalPrice}</Typography>
          </Box>

          {salon?.payment_policy && (
            <Box sx={{ fontSize: 11, color: "var(--color-tertiary)", textAlign: "center", py: "4px", px: 1, borderRadius: "0.5rem", backgroundColor: "var(--bg-surface-container-low)" }}>
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
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: "1rem",
              fontWeight: 700,
              py: 1.5,
              fontSize: "0.875rem",
              letterSpacing: "0.03em",
              boxShadow: "0 4px 12px color-mix(in srgb, var(--color-primary) 20%, transparent)",
              "&:hover": { filter: "brightness(1.1)" },
              textTransform: "none",
            }}
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
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          bottom: 20,
          left: 12,
          right: 12,
          zIndex: 40,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0, pl: "4px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#34d399", animation: "pulse 2s ease infinite" }} />
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "white" }}>
                {items.length} {items.length === 1 ? "Treatment" : "Treatments"}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "white", mt: "2px" }}>
              ₹{totalPrice} <span style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>({durationText})</span>
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            onClick={handleProceed}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: "0.75rem",
              fontWeight: 700,
              px: 2,
              py: 1.25,
              fontSize: "0.75rem",
              textTransform: "none",
              flexShrink: 0,
            }}
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
