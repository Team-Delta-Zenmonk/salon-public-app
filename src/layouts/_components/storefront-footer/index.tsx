import React from "react";
import Link from "next/link";
import Image from "next/image";
import EllipsisCell from "@/components/ellipse-cell";
import { useStorefront } from "../../../providers/storefront-provider";

export default function StorefrontFooter() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "ATELIER SOLSTICE";

  return (
    <footer className="mt-auto bg-(--app-surface-alt) border-t border-(--app-border) py-8 text-(--app-text) font-sans">
      <div className="px-4 md:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-(--app-border)">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {salon?.logo ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-(--app-surface) p-0.5 shrink-0 border border-(--app-border) relative">
                  <Image
                    className="object-cover rounded-full"
                    src={salon.logo}
                    alt={salonName}
                    fill
                    sizes="32px"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-(--app-primary) text-(--app-bg) font-editorial flex items-center justify-center text-xs tracking-wider shrink-0">
                  {salonName.charAt(0)}
                </div>
              )}
              <EllipsisCell
                value={salonName}
                maxChars={20}
                className="font-editorial text-lg font-bold text-(--app-text) tracking-wider"
              />
            </div>
            <EllipsisCell
              value={
                salon?.about ||
                "The epicenter of luxury coiffure and bespoke dermal treatments."
              }
              maxChars={100}
              maxLines={2}
              className="text-xs text-(--app-muted) leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-(--app-champagne) tracking-[0.2em] uppercase">
              Etiquette Charter
            </span>
            <p className="text-xs text-(--app-muted) leading-relaxed">
              Mobile devices on silent mode. 24-hour advance cancellation requested for private appointments.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-(--app-champagne) tracking-[0.2em] uppercase">
              Flagship Atelier
            </span>
            <div className="text-xs text-(--app-muted) leading-relaxed">
              <EllipsisCell
                value={salon?.address || "484 Avenue Montaigne, Flagship Studio"}
                className="block"
              />
              <br />
              <EllipsisCell
                value={
                  salon?.phone
                    ? `Concierge: ${salon.phone}`
                    : "Concierge: concierge@ateliersolstice.com"
                }
                className="block font-medium text-(--app-text) mt-0.5"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full pt-4 gap-3 text-xs text-(--app-muted)">
          <span className="text-center md:text-left text-[11px]">
            © {new Date().getFullYear()}{" "}
            <EllipsisCell
              value={salonName}
              className="font-editorial text-(--app-text) font-semibold tracking-wider"
              maxChars={20}
            />
            . All Rights Reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px]">
            <Link
              href="/services"
              className="text-(--app-muted) hover:text-(--app-text) tracking-wider uppercase transition-colors"
            >
              Services
            </Link>
            <Link
              href="/specialists"
              className="text-(--app-muted) hover:text-(--app-text) tracking-wider uppercase transition-colors"
            >
              Artisans
            </Link>
            <Link
              href="/cart"
              className="text-(--app-muted) hover:text-(--app-text) tracking-wider uppercase transition-colors"
            >
              Concierge Bag
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
