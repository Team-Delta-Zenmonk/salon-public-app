import React, { useState, useEffect, useRef } from "react";
import { useStorefrontNavigate } from "@/common/hooks/useStorefrontNavigate";
import { useAppSelector } from "@/store/hook";
import { calculateTotals } from "@/common/cart.utils";
import type { RootState } from "@/store/store";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EllipsisCell from "../ellipse-cell";
import styles from "./reservation-floating-bar.module.css";

export interface ReservationFloatingBarProps {
  className?: string;
}

export const ReservationFloatingBar: React.FC<ReservationFloatingBarProps> = ({
  className = "",
}) => {
  const navigate = useStorefrontNavigate();
  const cart = useAppSelector((state: RootState) => state.cart);
  const [isDismissed, setIsDismissed] = useState(false);

  const itemsSignature = JSON.stringify(
    (cart.items || []).map((item: any) => ({
      id: item.id || item.service_id,
      staff_uuid: item.staff_uuid || item.staff?.uuid,
      service_id: item.service_id,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  const prevSignatureRef = useRef(itemsSignature);

  useEffect(() => {
    if (prevSignatureRef.current !== itemsSignature) {
      prevSignatureRef.current = itemsSignature;
      setIsDismissed(false);
    }
  }, [itemsSignature]);

  if (!cart.items || cart.items.length === 0 || isDismissed) {
    return null;
  }

  const { totalPrice } = calculateTotals(cart.items);
  const firstItemName = cart.items[0]?.name || cart.items[0]?.service?.name || "Selected Service";

  return (
    <aside className={`${styles.bar} ${className}`}>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss booking bar"
        className={styles.dismissButton}
      >
        <CloseIcon className={styles.dismissIcon} />
      </button>

      <div className={styles.infoContainer}>
        <div className={styles.bagIconContainer}>
          <ShoppingBagOutlinedIcon className={styles.bagIcon} />
        </div>
        <div className={styles.details}>
          <div className={styles.badgeRow}>
            <span className={styles.badgeLabel}>
              ACTIVE BOOKING
            </span>
            <span className={styles.dot} />
            <span className={styles.countText}>
              {cart.items.length} Service{cart.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <EllipsisCell value={firstItemName} maxChars={10} className={styles.serviceName} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/cart")}
        className={styles.ctaButton}
      >
        <span>CONTINUE TO BOOKING (₹{totalPrice})</span>
        <ArrowForwardIcon className={styles.arrowIcon} />
      </button>
    </aside>
  );
};

export default ReservationFloatingBar;
