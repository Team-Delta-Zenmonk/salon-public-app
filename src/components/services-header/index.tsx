"use client";
import React from "react";
import clsx from "clsx";
import EllipsisCell from "@/components/ellipse-cell";

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
    <section
      className={clsx(
        "w-full bg-gradient-to-b from-surface-container-lowest via-surface to-surface border-b border-outline-variant/20 py-8 md:py-10 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary-container/5 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/15 border border-primary-container/40 text-primary font-label-caps text-label-caps tracking-wider uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              HAUTE APPOINTMENTS OPEN
            </span>
            <span className="text-on-surface-variant font-label-caps text-label-caps tracking-widest hidden sm:inline opacity-80">
              AUTUMN / WINTER 2026
            </span>
            {totalServicesCount !== undefined && (
              <span className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps font-semibold">
                {totalServicesCount} OFFERINGS
              </span>
            )}
          </div>

          <h1 className="font-headline-lg text-headline-lg md:text-[36px] text-on-surface tracking-tight leading-tight pt-1">
            Atelier Services &{" "}
            <span className="italic font-normal text-primary bg-clip-text">
              Haute Formulations
            </span>
          </h1>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed pt-0.5">
            Curated botanical therapies, architectural color precision, and tailored Japanese scalp rituals executed by certified master stylists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface-container-low p-4 sm:p-5 rounded-2xl border border border-(--app-border) shadow-xl shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-primary shrink-0 shadow-inner">
              {salon?.logo ? (
                <img src={salon.logo} alt={salonName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="material-symbols-outlined text-[24px]">storefront</span>
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                  ACTIVE SANCTUARY
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <p className="font-title-md text-title-md text-on-surface font-semibold truncate max-w-xs">
                <EllipsisCell value={salonName} maxLines={1} />
              </p>
              <p className="font-body-sm text-[12px] text-tertiary-fixed leading-normal truncate max-w-xs">
                {salonAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeader;
