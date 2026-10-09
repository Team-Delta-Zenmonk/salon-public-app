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
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  subServices = [],
  isAdded = false,
  isSubAdded,
  onToggleCart,
  assignedStaff,
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
        "flex flex-col justify-between bg-(--bg-surface-container-lowest) rounded-[4px] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(28,26,23,0.06)] border border-(--color-hairline)",
        selectedSubCount > 0 ? "border-(--color-secondary) ring-1 ring-(--color-secondary)" : "hover:border-(--color-bronze-accent)/50",
        className
      )}
    >
      <div className="relative w-full h-56 bg-(--bg-surface-container) overflow-hidden group">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={service.name || "Service Treatment"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-(--bg-surface-container) text-(--color-on-surface) font-serif p-4 text-center">
            <span className="text-3xl font-normal tracking-widest">{service.name?.[0] || "S"}</span>
            <span className="text-[10px] tracking-[0.15em] font-sans text-(--color-tertiary) uppercase mt-1">ATELIER RITUAL</span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span className="px-3 py-1 bg-(--bg-surface-container-lowest)/90 backdrop-blur-sm text-(--color-on-surface) font-sans text-[10px] font-bold uppercase tracking-widest rounded-[4px] border border-(--color-hairline)">
            {service.gender || "Gender Neutral"}
          </span>
          <span className="px-3 py-1 bg-(--bg-surface-container-lowest)/90 backdrop-blur-sm text-(--color-on-surface) font-sans text-[10px] font-bold uppercase tracking-widest rounded-[4px] border border-(--color-hairline)">
            {service.duration || 60} Min
          </span>
        </div>

        <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-(--color-primary) text-(--color-on-primary) font-serif text-lg font-bold rounded-[4px] shadow-sm z-10">
          {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-(--color-on-surface) font-medium leading-snug tracking-tight capitalize">
            <EllipsisCell value={service.name} maxLines={2} maxChars={30} />
          </h2>
          <EllipsisCell
            value={
              service.description ||
              "Bespoke dry and wet architectural scissor carving tailored to bone contour, accompanied by an invigorating cold-pressed rosemary and jojoba detoxifying rinse."
            }
            maxLines={3}
            maxChars={120}
            className="font-sans text-xs text-(--color-on-surface-variant) leading-relaxed"
          />
        </div>

        {hasSubServices ? (
          <div className="mt-4 pt-4 bg-(--bg-surface-container-low) p-4 rounded-[4px] space-y-3 border border-(--color-hairline)/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-secondary)">
                BOOKABLE SUB-SERVICES ({subServices.length})
              </span>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-[10px] font-bold text-(--color-outline) hover:text-(--color-on-surface) bg-transparent border-0 cursor-pointer uppercase transition-colors"
              >
                {selectedSubCount > 0 ? `${selectedSubCount} selected` : expanded ? "Hide" : "Show All"}
              </button>
            </div>

            {expanded && (
              <div className="space-y-2 pt-1">
                {subServices.map((sub: any) => {
                  const subAdded = checkSubAdded(sub);
                  return (
                    <div
                      key={sub.uuid || sub.id}
                      className={clsx(
                        "flex items-center justify-between p-3 rounded-[4px] border transition-all",
                        subAdded
                          ? "bg-(--bg-surface-container-lowest) border-(--color-secondary) shadow-xs"
                          : "bg-(--bg-surface-container-lowest) hover:bg-(--bg-surface-container) border-(--color-hairline)"
                      )}
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-semibold text-(--color-on-surface) capitalize truncate">
                            {sub.name}
                          </span>
                          {sub.duration && (
                            <span className="text-[10px] font-sans text-(--color-outline) bg-(--bg-surface-container-high) px-1.5 py-0.5 rounded-[2px] shrink-0">
                              {sub.duration} min
                            </span>
                          )}
                        </div>
                        {sub.description && (
                          <p className="text-[11px] text-(--color-on-surface-variant) font-sans mt-0.5 line-clamp-1">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-sans text-xs font-bold text-(--color-secondary)">
                          ₹{sub.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleCart?.(sub)}
                          className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-sans text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer border-0",
                            subAdded
                              ? "bg-(--color-secondary) text-(--color-on-secondary)"
                              : "bg-(--color-primary) hover:bg-(--color-on-surface-variant) text-(--color-on-primary)"
                          )}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {subAdded ? "check" : "add"}
                          </span>
                          <span>{subAdded ? "BOOKED" : "ADD"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 pt-3 text-xs text-(--color-outline) italic">
            No sub-services available for this category.
          </div>
        )}

        <div className="mt-6 pt-3 flex items-center justify-between gap-4 border-t border-(--color-hairline)">
          <div className="text-xs text-(--color-outline)">
            <strong className="font-semibold text-(--color-on-surface)">Atelier Guarantee:</strong> Full consultation included
          </div>

          {hasSubServices ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-[4px] font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border shrink-0",
                selectedSubCount > 0
                  ? "bg-(--color-secondary) text-(--color-on-secondary) border-(--color-secondary)"
                  : "bg-(--bg-surface-container) hover:bg-(--bg-surface-container-high) text-(--color-on-surface) border-(--color-hairline)"
              )}
            >
              <span className="material-symbols-outlined text-[16px]">
                {selectedSubCount > 0 ? "task_alt" : expanded ? "expand_less" : "expand_more"}
              </span>
              <span>
                {selectedSubCount > 0
                  ? `${selectedSubCount} SUB-SERVICE${selectedSubCount > 1 ? "S" : ""} BOOKED`
                  : expanded
                  ? "HIDE OPTIONS"
                  : "SELECT SUB-SERVICE"}
              </span>
            </button>
          ) : service.parent_id !== null ? (
            <button
              type="button"
              onClick={() => onToggleCart?.(service)}
              className={clsx(
                "flex items-center gap-2 px-5 py-3 rounded-[4px] font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-0 shrink-0",
                isAdded
                  ? "bg-(--color-secondary) text-(--color-on-secondary) shadow-xs"
                  : "bg-(--color-primary) hover:bg-(--color-on-surface-variant) text-(--color-on-primary)"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAdded ? "check" : "calendar_today"}
              </span>
              <span>{isAdded ? "RESERVED" : "ADD TO BOOKING"}</span>
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-(--color-outline) uppercase tracking-wider">
              SELECT A SUB-SERVICE ABOVE
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
