"use client";
import React from "react";
import clsx from "clsx";
import { Avatar } from "@mui/material";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import EllipsisCell from "../ellipse-cell";

export interface StaffCardProps {
  member: any;
  className?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({ member, className }) => {
  const navigate = useStorefrontNavigate();
  const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Master Specialist";
  const photo = member.photos?.secure_url ?? member.photos?.url;

  return (
    <article
      className={clsx(
        "group bg-(--app-surface, #FCFAF7) rounded-[4px] border border-(--app-border, #E5DFD5) p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#A88B64]/60 w-full min-h-[380px]",
        className
      )}
    >
      <div className="space-y-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-4 mb-4">
            <Avatar
              src={photo}
              alt={fullName}
              className="w-16 h-16 rounded-[2px] border border-(--app-border, #E5DFD5) object-cover bg-(--app-surface-alt, #F2EEE7) text-(--app-text, #1C1A17) font-serif text-lg font-normal shrink-0"
            >
              {member.first_name?.[0] || "S"}
            </Avatar>

            <div className="min-w-0 flex-1">
              <EllipsisCell value={member.title || member.role || "ARTISTIC DIRECTOR"} className="font-sans text-[10px] font-semibold text-[#A88B64] uppercase tracking-[0.12em] block" maxChars={20} />
              <br />
              <EllipsisCell value={fullName} className="font-serif text-xl sm:text-2xl text-(--app-text, #1C1A17) font-medium capitalize truncate group-hover:text-[#A88B64] transition-colors mt-0.5" maxChars={10} />
              {member.rating && (
                <div className="flex items-center gap-1 text-(--app-text, #1C1A17) font-sans text-xs font-semibold mt-1">
                  <span>★ {member.rating}</span>
                  {member.reviews_count && <span className="text-(--app-muted, #766A5E) font-normal">({member.reviews_count} reviews)</span>}
                </div>
              )}
            </div>
          </div>

          <p className="font-sans text-xs text-(--app-muted, #766A5E) leading-relaxed line-clamp-3">
            {member.bio ||
              "Specialized in precision dry shears, organic balayage glazes, and scalp revitalization protocols trained at European academies."}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-(--app-border, #E5DFD5) font-sans text-[11px] text-(--app-muted, #766A5E) mt-auto">
          <span className="material-symbols-outlined text-[14px] text-[#A88B64]">schedule</span>
          <span>AVAILABLE FOR CONSULTATION TODAY</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/services?specialist=${encodeURIComponent(fullName)}`)}
        className="mt-6 w-full bg-(--app-primary) hover:bg-(--app-text)/90 text-(--app-surface) px-5 py-2.5 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.08em] flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0 shadow-xs"
      >
        <span>RESERVE WITH ARTISAN</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </article>
  );
};

export default StaffCard;
