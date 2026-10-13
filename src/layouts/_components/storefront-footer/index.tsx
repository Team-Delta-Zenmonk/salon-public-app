"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import EllipsisCell from "@/components/ellipse-cell";
import { useStorefront } from "../../../providers/storefront-provider";
import styles from "./storefront-footer.module.css";

export default function StorefrontFooter() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "ATELIER SOLSTICE";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.brandRow}>
              {salon?.logo ? (
                <div className={styles.logoWrapper}>
                  <Image
                    style={{ objectFit: "cover", borderRadius: "9999px" }}
                    src={salon.logo}
                    alt={salonName}
                    fill
                    sizes="32px"
                    unoptimized
                  />
                </div>
              ) : (
                <div className={styles.logoFallback}>
                  {salonName.charAt(0)}
                </div>
              )}
              <EllipsisCell
                value={salonName}
                maxChars={20}
                className={styles.brandTitle}
              />
            </div>
            <EllipsisCell
              value={
                salon?.about ||
                "The epicenter of luxury coiffure and bespoke dermal treatments."
              }
              maxChars={100}
              maxLines={2}
              className={styles.aboutText}
            />
          </div>

          <div className={styles.columnNarrow}>
            <span className={styles.sectionBadge}>
              Etiquette Charter
            </span>
            <p className={styles.aboutText}>
              Mobile devices on silent mode. 24-hour advance cancellation requested for private appointments.
            </p>
          </div>

          <div className={styles.columnNarrow}>
            <span className={styles.sectionBadge}>
              Flagship Atelier
            </span>
            <div className={styles.addressBlock}>
              <EllipsisCell
                value={salon?.address || "484 Avenue Montaigne, Flagship Studio"}
                className={styles.addressBlock}
              />
              <EllipsisCell
                value={
                  salon?.phone
                    ? `Concierge: ${salon.phone}`
                    : "Concierge: concierge@ateliersolstice.com"
                }
                className={styles.phoneText}
              />
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()}{" "}
            <EllipsisCell
              value={salonName}
              className={styles.brandNameCopyright}
              maxChars={20}
            />
            . All Rights Reserved.
          </span>
          <div className={styles.linkGroup}>
            <Link
              href="/services"
              className={styles.footerLink}
            >
              Services
            </Link>
            <Link
              href="/specialists"
              className={styles.footerLink}
            >
              Artisans
            </Link>
            <Link
              href="/cart"
              className={styles.footerLink}
            >
              Concierge Bag
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
