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
          <ShoppingBagOutlinedIcon className={styles.basketHeaderIcon} />
          <Typography className={styles.title}>Selected Treatments</Typography>
        </Box>
        <Box className={styles.itemBadge}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Box>
      </Box>

      <Box className={styles.itemList}>
        {items.length === 0 ? (
          <Box className={styles.emptyBox}>
            <Typography className={styles.emptyTitle}>
              Your basket is empty
            </Typography>
            <Typography className={styles.emptySubtitle}>
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
                <Box className={styles.itemDetailsCol}>
                  <Typography className={styles.itemTitle}>{name}</Typography>
                  <Box className={styles.itemMetaRow}>
                    {duration && (
                      <Box className={styles.itemDurationGroup}>
                        <AccessTimeIcon className={styles.itemDurationIcon} />
                        <Typography className={styles.metaText}>{duration} min</Typography>
                      </Box>
                    )}
                    <Typography className={styles.metaText}>•</Typography>
                    <Typography className={styles.itemPrice}>₹{price}</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => handleRemove(item)} className={styles.removeBtn}>
                  <DeleteOutlineIcon className={styles.itemDeleteIcon} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      {items.length > 0 && (
        <Box className={styles.footer}>
          <Box className={styles.durationRow}>
            <span>Estimated Duration</span>
            <span className={styles.durationValue}>{durationText}</span>
          </Box>

          <Divider className={styles.basketDivider} />

          <Box className={styles.totalRow}>
            <Typography className={styles.totalLabel}>Total Estimated</Typography>
            <Typography className={styles.totalValue}>₹{totalPrice}</Typography>
          </Box>

          {salon?.payment_policy && (
            <Box className={styles.policyNotice}>
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
            endIcon={<ArrowForwardIcon className={styles.floatingBtnIcon} />}
            className={styles.desktopContinueBtn}
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
      <Box className={styles.floatingContainer}>
        <Box className={styles.floatingBox}>
          <Box className={styles.floatingInfoCol}>
            <Box className={styles.floatingHeaderRow}>
              <Box className={styles.floatingPulseDot} />
              <Typography className={styles.floatingTreatmentCount}>
                {items.length} {items.length === 1 ? "Treatment" : "Treatments"}
              </Typography>
            </Box>
            <Typography className={styles.floatingPriceText}>
              ₹{totalPrice} <span className={styles.floatingDurationSpan}>({durationText})</span>
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            onClick={handleProceed}
            endIcon={<ArrowForwardIcon className={styles.floatingBtnIcon} />}
            className={styles.floatingBookBtn}
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
