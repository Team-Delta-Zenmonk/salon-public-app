import React from "react";
import clsx from "clsx";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./services-header.module.css";

export interface ServicesHeaderProps {
  salon?: any;
  totalServicesCount?: number;
  className?: string;
  onExploreClick?: () => void;
}

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  salon,
  totalServicesCount,
  className,
  onExploreClick,
}) => {
  const salonName = salon?.name || "Flagship Atelier — Main Studio";
  const salonAddress = salon?.address || "Flagship Suite & Bespoke Sanctuary";

  return (
    <section className={clsx(styles.headerSection, className)}>
      <div className={styles.container}>
        <div className={styles.titleColumn}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              <span className={styles.pulseDot} />
              HAUTE APPOINTMENTS OPEN
            </span>
            <span className={styles.seasonText}>
              AUTUMN / WINTER 2026
            </span>
            {totalServicesCount !== undefined && (
              <span className={styles.countBadge}>
                {totalServicesCount} OFFERINGS
              </span>
            )}
          </div>

          <h1 className={styles.heading}>
            Atelier Services &{" "}
            <span className={styles.italicAccent}>
              Haute Formulations
            </span>
          </h1>

          <p className={styles.description}>
            Curated botanical therapies, architectural color precision, and tailored Japanese scalp rituals executed by certified master stylists.
          </p>
        </div>

        <div className={styles.sanctuaryCard}>
          <div className={styles.cardLeft}>
            <div className={styles.logoBox}>
              {salon?.logo ? (
                <img src={salon.logo} alt={salonName} className={styles.logoImg} />
              ) : (
                <StorefrontIcon className={styles.logoIcon} />
              )}
            </div>
            <div className={styles.cardText}>
              <div className={styles.activeLabel}>
                ACTIVE SANCTUARY
              </div>
              <EllipsisCell value={salonName} maxChars={15} maxLines={1} className={styles.salonTitle} />
              <EllipsisCell value={salonAddress} maxChars={20} maxLines={1} className={styles.addressText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeader;
