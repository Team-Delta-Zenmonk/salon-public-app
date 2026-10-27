"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import EllipsisCell from "@/components/ellipse-cell";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAppThemeMode } from "@/theme/theme-provider";
import SubServicesModal from "./sub-services-modal";
import { getDiscountedPrice } from "@/common/discount.utils";
import styles from "./service-card.module.css";

export interface ServiceCardProps {
  service: any;
  subServices?: any[];
  isAdded?: boolean;
  isSubAdded?: (subId: string) => boolean;
  onToggleCart?: (item: any) => void;
  assignedStaff?: any;
  loadingIds?: string[];
  className?: string;
  designVariant?: "editorial" | "archVault" | "floatingGlass";
  showSubServices?: boolean;
  onBookNow?: (service: any) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  subServices = [],
  isAdded = false,
  isSubAdded,
  onToggleCart,
  assignedStaff,
  loadingIds = [],
  className,
  designVariant,
  showSubServices = true,
  onBookNow,
}) => {
  const { themeId } = useAppThemeMode();
  const [modalOpen, setModalOpen] = useState(false);
  const activeDesign: "editorial" | "archVault" | "floatingGlass" =
    designVariant ||
    (themeId === "obsidianFlame"
      ? "archVault"
      : themeId === "lightGothic"
      ? "floatingGlass"
      : "editorial");
  const hasSubServices = subServices.length > 0;

  const checkSubAdded = (sub: any) => {
    const subId = typeof sub === "object" && sub !== null ? sub.uuid || sub.id : sub;
    if (isSubAdded && subId) return isSubAdded(subId);
    return false;
  };

  const selectedSubCount = subServices.filter(checkSubAdded).length;

  const imageSrc = service.logo || service.image || service.photos?.[0]?.secure_url || service.photos?.[0]?.url;

  const designClass =
    activeDesign === "archVault"
      ? styles.archVaultCard
      : activeDesign === "floatingGlass"
      ? styles.floatingGlassCard
      : styles.editorialCard;

  const themeClass =
    themeId === "obsidianFlame"
      ? styles.themeObsidianFlame
      : themeId === "lightGothic"
      ? styles.themeLightGothic
      : styles.themeCrimsonShear;

  return (
    <article
      className={clsx(
        styles.card,
        !showSubServices && styles.cardCompact,
        themeClass,
        designClass,
        selectedSubCount > 0 ? styles.cardWithSelected : styles.cardDefaultHover,
        className
      )}
    >
      {activeDesign === "archVault" ? (
        <div className={styles.archVaultServiceWrapper}>
          <div className={styles.archVaultWindowFrame}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={service.name || "Service Treatment"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                className={styles.serviceImage}
                unoptimized
              />
            ) : (
              <div className={styles.fallbackContainer}>
                <span className={styles.fallbackLetter}>{service.name?.[0] || "S"}</span>
                <span className={styles.fallbackSubtext}>ARCHITECTURAL SANCTUARY</span>
              </div>
            )}
            <div className={styles.archVaultImageOverlay} />
            <div className={styles.archVaultPricePill}>
              {(() => {
                const discountInfo = getDiscountedPrice(service);
                return discountInfo.hasDiscount ? (
                  <>
                    <span className={styles.originalPriceCrossed}>
                      ₹{discountInfo.originalPrice}
                    </span>
                    <span>
                      {service.price_type === "from" ? `From ₹${discountInfo.finalPrice}` : `₹${discountInfo.finalPrice}`}
                    </span>
                  </>
                ) : (
                  service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`
                );
              })()}
            </div>
          </div>

          <div className={styles.archVaultServiceDetails}>
            <div className={styles.archVaultBadgeRow}>
              {(() => {
                const discountInfo = getDiscountedPrice(service);
                return discountInfo.hasDiscount && discountInfo.discountBadge ? (
                  <span className={styles.discountBadge}>
                    {discountInfo.discountBadge}
                  </span>
                ) : null;
              })()}
              <span className={clsx(styles.chipTag, styles.genderChipHighlight)}>
                {service.gender ? `${service.gender.toUpperCase()}` : "GENDER NEUTRAL"}
              </span>
              <span className={styles.chipTag}>{service.duration || 60} MIN</span>
            </div>
            {service.name && (
              <h2 className={styles.archVaultServiceTitle}>
                <EllipsisCell value={service.name} maxLines={2} maxChars={40} className="capitalize" />
              </h2>
            )}
            {service.description && (
              <div className={styles.archVaultDescriptionBox}>
                <EllipsisCell
                  value={service.description}
                  maxLines={2}
                  maxChars={110}
                  className={styles.serviceDescription}
                />
              </div>
            )}
          </div>
        </div>
      ) : activeDesign === "floatingGlass" ? (
        <div className={styles.floatingGlassServiceWrapper}>
          <div className={styles.floatingGlassSplitHeader}>
            <div className={styles.floatingGlassThumbnail}>
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={service.name || "Service Treatment"}
                  fill
                  sizes="120px"
                  className={styles.serviceImage}
                  unoptimized
                />
              ) : (
                <div className={styles.fallbackContainer}>
                  <span className={styles.fallbackLetter}>{service.name?.[0] || "S"}</span>
                </div>
              )}
            </div>

            <div className={styles.floatingGlassDetails}>
              <div className={styles.glassBadgeRow}>
                {(() => {
                  const discountInfo = getDiscountedPrice(service);
                  return discountInfo.hasDiscount && discountInfo.discountBadge ? (
                    <span className={styles.discountBadge}>
                      {discountInfo.discountBadge}
                    </span>
                  ) : null;
                })()}
                <span className={clsx(styles.chipTag, styles.genderChipHighlight)}>
                  {service.gender ? service.gender.toUpperCase() : "GENDER NEUTRAL"}
                </span>
                <span className={styles.chipTag}>{service.duration || 60} MIN</span>
              </div>
              <h2 className={styles.serviceTitle}>
                <EllipsisCell value={service.name} maxLines={2} maxChars={22} className="capitalize" />
              </h2>
              <div className={styles.glassPricePill}>
                {(() => {
                  const discountInfo = getDiscountedPrice(service);
                  return discountInfo.hasDiscount ? (
                    <>
                      <span className={styles.originalPriceCrossed}>
                        ₹{discountInfo.originalPrice}
                      </span>
                      <span>
                        {service.price_type === "from" ? `From ₹${discountInfo.finalPrice}` : `₹${discountInfo.finalPrice}`}
                      </span>
                    </>
                  ) : (
                    service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`
                  );
                })()}
              </div>
            </div>
          </div>

          <div className={styles.bodyContent}>
            <EllipsisCell
              value={
                service.description ||
                "Bespoke dry and wet architectural scissor carving tailored to bone contour, accompanied by an invigorating cold-pressed rinse."
              }
              maxLines={2}
              maxChars={90}
              className={styles.serviceDescription}
            />
          </div>
        </div>
      ) : (
        <div className={styles.editorialServiceWrapper}>
          <div className={styles.editorialHeaderArea}>
            <div className={styles.editorialBadgeRow}>
              <span className={styles.editorialMonogram}>✦ ATELIER SELECTION</span>
              <div className={styles.editorialMetaTags}>
                {(() => {
                  const discountInfo = getDiscountedPrice(service);
                  return discountInfo.hasDiscount && discountInfo.discountBadge ? (
                    <span className={styles.discountBadge}>
                      {discountInfo.discountBadge}
                    </span>
                  ) : null;
                })()}
                <span className={clsx(styles.chipTag, styles.genderChipHighlight)}>
                  {service.gender ? service.gender.toUpperCase() : "GENDER NEUTRAL"}
                </span>
                <span className={styles.chipTag}>{service.duration || 60} MIN</span>
              </div>
            </div>

            <div className={styles.editorialTitlePriceRow}>
              <h2 className={styles.editorialTitle}>
                <EllipsisCell value={service.name} maxLines={2} maxChars={28} className="capitalize" />
              </h2>
              <div className={styles.editorialPriceTag}>
                {(() => {
                  const discountInfo = getDiscountedPrice(service);
                  return discountInfo.hasDiscount ? (
                    <>
                      <span className={styles.originalPriceCrossed}>
                        ₹{discountInfo.originalPrice}
                      </span>
                      <span>
                        {service.price_type === "from" ? `From ₹${discountInfo.finalPrice}` : `₹${discountInfo.finalPrice}`}
                      </span>
                    </>
                  ) : (
                    service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`
                  );
                })()}
              </div>
            </div>

            <EllipsisCell
              value={
                service.description ||
                "Bespoke dry and wet architectural scissor carving tailored to bone contour, accompanied by an invigorating cold-pressed rosemary and jojoba detoxifying rinse."
              }
              maxLines={2}
              maxChars={110}
              className={styles.serviceDescription}
            />
          </div>

          <div className={styles.editorialPhotoStrip}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={service.name || "Service Treatment"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                className={styles.serviceImage}
                unoptimized
              />
            ) : (
              <div className={styles.fallbackContainer}>
                <span className={styles.fallbackLetter}>{service.name?.[0] || "S"}</span>
                <span className={styles.fallbackSubtext}>SIGNATURE RITUAL</span>
              </div>
            )}
            <div className={styles.editorialGenderTag}>
              {service.gender || "Gender Neutral"}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardActionsContainer}>
        {showSubServices ? (
          <div className={styles.footerBar}>
            <div className={styles.guaranteeText}>
              <strong className={styles.guaranteeStrong}>Atelier Guarantee:</strong> Full consultation included
            </div>

            {hasSubServices ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={clsx(
                  styles.footerOptionsBtn,
                  selectedSubCount > 0 ? styles.footerOptionsBtnSelected : styles.footerOptionsBtnDefault
                )}
              >
                <span>OPTIONS ({subServices.length})</span>
                {selectedSubCount > 0 && (
                  <span className={styles.footerOptionsCount}>
                    {selectedSubCount} SELECTED
                  </span>
                )}
              </button>
            ) : service.parent_id !== null ? (
              <button
                type="button"
                disabled={loadingIds.includes(service.uuid || service.id)}
                onClick={() => onToggleCart?.(service)}
                className={clsx(
                  styles.footerReserveBtn,
                  loadingIds.includes(service.uuid || service.id) && styles.footerReserveBtnDisabled,
                  isAdded ? styles.footerReserveBtnReserved : styles.footerReserveBtnAdd
                )}
              >
                {loadingIds.includes(service.uuid || service.id) ? (
                  <>
                    <span className={`${styles.spinner} ${styles.spinnerLg}`} />
                    <span>{isAdded ? "REMOVING..." : "ADDING..."}</span>
                  </>
                ) : (
                  <>
                    {isAdded ? (
                      <RemoveIcon />
                    ) : (
                      <AddIcon />
                    )}
                    <span>{isAdded ? "REMOVE" : "ADD"}</span>
                  </>
                )}
              </button>
            ) : (
              <span className={styles.selectSubPrompt}>
                SELECT A SUB-SERVICE ABOVE
              </span>
            )}
          </div>
        ) : (
          <div className={styles.footerBar}>
            <div className={styles.guaranteeText}>
              <strong className={styles.guaranteeStrong}>Atelier Guarantee:</strong> Full consultation included
            </div>
            <button
              type="button"
              onClick={() => onBookNow?.(service)}
              className={clsx(styles.footerReserveBtn, styles.footerReserveBtnAdd)}
            >
              <CalendarTodayIcon />
              <span>BOOK NOW</span>
            </button>
          </div>
        )}
      </div>

      {hasSubServices && (
        <SubServicesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceName={service.name || "Service Treatment"}
          subServices={subServices}
          isSubAdded={checkSubAdded}
          onToggleCart={onToggleCart}
          loadingIds={loadingIds}
        />
      )}
    </article>
  );
};

export default ServiceCard;
