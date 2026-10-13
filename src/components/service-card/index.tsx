"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import EllipsisCell from "@/components/ellipse-cell";
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
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasSubServices = subServices.length > 0;

  const checkSubAdded = (sub: any) => {
    const subId = sub.uuid || sub.id;
    if (isSubAdded) return isSubAdded(subId);
    return false;
  };

  const selectedSubCount = subServices.filter(checkSubAdded).length;

  const imageSrc = service.logo || service.image || service.photos?.[0]?.secure_url || service.photos?.[0]?.url;

  return (
    <article
      className={clsx(
        styles.card,
        selectedSubCount > 0 ? styles.cardWithSelected : styles.cardDefaultHover,
        className
      )}
    >
      <div className={styles.mediaWrapper}>
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
            <span className={styles.fallbackSubtext}>ATELIER RITUAL</span>
          </div>
        )}

        <div className={styles.badgeTopLeft}>
          <span className={styles.chipTag}>
            {service.gender || "Gender Neutral"}
          </span>
          <span className={styles.chipTag}>
            {service.duration || 60} Min
          </span>
        </div>

        <div className={styles.badgeBottomRight}>
          {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
        </div>
      </div>

      <div className={styles.bodyContent}>
        <div className={styles.headerInfo}>
          <h2 className={styles.serviceTitle}>
            <EllipsisCell value={service.name} maxLines={2} maxChars={30} className="capitalize" />
          </h2>
          <EllipsisCell
            value={
              service.description ||
              "Bespoke dry and wet architectural scissor carving tailored to bone contour, accompanied by an invigorating cold-pressed rosemary and jojoba detoxifying rinse."
            }
            maxLines={3}
            maxChars={120}
            className={styles.serviceDescription}
          />
        </div>

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
                              <span className={`material-symbols-outlined ${styles.subServiceBtnIcon}`}>
                                {subAdded ? "check" : "add"}
                              </span>
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
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                {expanded ? "expand_less" : "expand_more"}
              </span>
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
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    {isAdded ? "check" : "calendar_today"}
                  </span>
                  <span>{isAdded ? "RESERVED" : "ADD TO BOOKING"}</span>
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
