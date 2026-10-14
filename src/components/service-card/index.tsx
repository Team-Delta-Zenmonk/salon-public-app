"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import EllipsisCell from "@/components/ellipse-cell";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAppThemeMode } from "@/theme/theme-provider";
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
}) => {
  const { themeId } = useAppThemeMode();
  const [expanded, setExpanded] = useState(true);
  const activeDesign: "editorial" | "archVault" | "floatingGlass" =
    designVariant ||
    (themeId === "obsidianFlame"
      ? "archVault"
      : themeId === "lightGothic"
      ? "floatingGlass"
      : "editorial");
  const hasSubServices = subServices.length > 0;

  const checkSubAdded = (sub: any) => {
    const subId = sub.uuid || sub.id;
    if (isSubAdded) return isSubAdded(subId);
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
              {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
            </div>
          </div>

          <div className={styles.archVaultServiceDetails}>
            <div className={styles.archVaultBadgeRow}>
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
                <span className={clsx(styles.chipTag, styles.genderChipHighlight)}>
                  {service.gender ? service.gender.toUpperCase() : "GENDER NEUTRAL"}
                </span>
                <span className={styles.chipTag}>{service.duration || 60} MIN</span>
              </div>
              <h2 className={styles.serviceTitle}>
                <EllipsisCell value={service.name} maxLines={2} maxChars={22} className="capitalize" />
              </h2>
              <div className={styles.glassPricePill}>
                {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
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
                {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
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

        {hasSubServices ? (
          <div className={styles.subServicesSection}>
            <div className={styles.subServicesHeader}>
              <div>
                <span className={styles.subServicesTitle}>
                  BOOKABLE SUB-SERVICES ({subServices.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={styles.toggleExpandBtn}
              >
                {expanded ? "Hide" : "Show All"}
              </button>
            </div>

            {expanded && (
              <div className={styles.subServicesList}>
                {subServices.map((sub: any) => {
                  const subAdded = checkSubAdded(sub);
                  const subId = sub.uuid || sub.id;
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
                          <EllipsisCell value={sub.name} maxChars={10} className={styles.subServiceName} />
                          {sub.duration && (
                            <EllipsisCell value={`${sub.duration} min`} maxChars={10} className={styles.subServiceDuration} />
                          )}
                        </div>
                        {sub.description && (
                          <EllipsisCell value={sub.description} maxChars={10} className={styles.subServiceDesc} />
                        )}
                      </div>

                      <div className={styles.subServiceActions}>
                        <span className={styles.subServicePrice}>
                          ₹{sub.price}
                        </span>
                        <button
                          type="button"
                          disabled={isSubLoading}
                          onClick={() => onToggleCart?.(sub)}
                          className={clsx(
                            styles.subServiceBtn,
                            isSubLoading && styles.subServiceBtnDisabled,
                            subAdded ? styles.subServiceBtnBooked : styles.subServiceBtnAdd
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
                                <CheckIcon className={styles.subServiceBtnIcon} />
                              ) : (
                                <AddIcon className={styles.subServiceBtnIcon} />
                              )}
                              <span>{subAdded ? "BOOKED" : "ADD"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptySubServices}>
            No sub-services available for this category.
          </div>
        )}

        <div className={styles.footerBar}>
          <div className={styles.guaranteeText}>
            <strong className={styles.guaranteeStrong}>Atelier Guarantee:</strong> Full consultation included
          </div>

          {hasSubServices ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={clsx(
                styles.footerOptionsBtn,
                selectedSubCount > 0 ? styles.footerOptionsBtnSelected : styles.footerOptionsBtnDefault
              )}
            >
              {expanded ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
              <span>{expanded ? "HIDE OPTIONS" : "SHOW OPTIONS"}</span>
              {selectedSubCount > 0 && (
                <span className={styles.footerOptionsCount}>
                  {selectedSubCount}
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
                    <CheckIcon />
                  ) : (
                    <CalendarTodayIcon />
                  )}
                  <span>{isAdded ? "ADDED" : "ADD TO BOOKING"}</span>
                </>
              )}
            </button>
          ) : (
            <span className={styles.selectSubPrompt}>
              SELECT A SUB-SERVICE ABOVE
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
