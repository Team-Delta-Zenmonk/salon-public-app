"use client";
import React from "react";
import EllipsisCell from "@/components/ellipse-cell";
import CustomSelect from "@/components/custom-select";
import ServiceCard from "@/components/service-card";
import type { Service } from "@/common/salon.type";
import type { HomeServicesVariant } from "@/theme/layout.types";
import VerifiedIcon from "@mui/icons-material/Verified";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import styles from "../home.module.css";

export interface ServicesSectionProps {
  variant: HomeServicesVariant;
  services: Service[];
  filteredServices: Service[];
  subServicesMap: Record<string | number, Service[]>;
  categorySanctuaries: { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedGender: string;
  onSelectGender: (gender: string) => void;
  toggleCart: (service: any) => Promise<void>;
  isAdded: (serviceId: string) => boolean;
  loadingIds: string[];
}

function GridServicesLayout({
  filteredServices,
  subServicesMap,
  categorySanctuaries,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  toggleCart,
  isAdded,
  loadingIds,
}: Omit<ServicesSectionProps, "variant" | "services">) {
  return (
    <>
      <div className={styles.mobileFilterRow}>
        <CustomSelect
          label="Category:"
          value={selectedCategory}
          options={categorySanctuaries}
          onChange={onSelectCategory}
          maxChars={20}
          menuMaxChars={25}
          menuWidth={220}
        />

        <CustomSelect
          label="Guest Focus:"
          value={selectedGender}
          options={[
            { id: "all", label: "ALL" },
            { id: "female", label: "FEMALE" },
            { id: "male", label: "MALE" },
            { id: "unisex", label: "UNISEX" },
          ]}
          onChange={onSelectGender}
          maxChars={15}
          menuMaxChars={15}
          menuWidth={180}
        />
      </div>

      <div className={`${styles.catalogCategoryBar} ${styles.desktopCategoryBar}`}>
        {categorySanctuaries.map((cat) => {
          const isSel = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={isSel ? styles.catBtnSelected : styles.catBtnDefault}
            >
              <EllipsisCell value={cat.label} maxChars={22} className="capitalize" />
            </button>
          );
        })}
      </div>

      <div className={styles.filterRow}>
        <div className={`${styles.genderGroup} ${styles.desktopGenderGroup}`}>
          <span className={styles.genderLabel}>GUEST FOCUS:</span>
          {[
            { id: "all", label: "ALL" },
            { id: "female", label: "FEMALE" },
            { id: "male", label: "MALE" },
            { id: "unisex", label: "UNISEX" },
          ].map((g) => {
            const isSel = selectedGender === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGender(g.id)}
                className={isSel ? styles.genderBtnSelected : styles.genderBtnDefault}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <div className={styles.serviceComplimentaryNotice}>
          <VerifiedIcon className={styles.serviceComplimentaryIcon} />
          <span>All services include complimentary scalp cleanse and conditioning</span>
        </div>
      </div>

      <div className={styles.servicesGrid}>
        {filteredServices.map((service: any) => (
          <ServiceCard
            key={service.uuid || service.id}
            service={service}
            subServices={subServicesMap[service.id] || subServicesMap[service.uuid] || []}
            isAdded={isAdded(service.uuid || service.id)}
            isSubAdded={(subId) => isAdded(subId)}
            onToggleCart={toggleCart}
            loadingIds={loadingIds}
          />
        ))}
      </div>
    </>
  );
}

function TwoColumnListLayout({
  filteredServices,
  subServicesMap,
  categorySanctuaries,
  selectedCategory,
  onSelectCategory,
  toggleCart,
  isAdded,
  loadingIds,
}: Omit<ServicesSectionProps, "variant" | "services">) {
  return (
    <>
      <div className={styles.twoColCategoryBar}>
        {categorySanctuaries.map((cat) => {
          const isSel = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`${styles.twoColCatBtn} ${isSel ? styles.twoColCatBtnActive : ""}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className={styles.servicesGrid}>
        {filteredServices.map((service: any) => (
          <ServiceCard
            key={service.uuid || service.id}
            service={service}
            subServices={subServicesMap[service.id] || subServicesMap[service.uuid] || []}
            isAdded={isAdded(service.uuid || service.id)}
            isSubAdded={(subId) => isAdded(subId)}
            onToggleCart={toggleCart}
            loadingIds={loadingIds}
          />
        ))}
      </div>
    </>
  );
}

function CompactAccordionLayout({
  filteredServices,
  subServicesMap,
  categorySanctuaries,
  selectedCategory,
  onSelectCategory,
  toggleCart,
  isAdded,
  loadingIds,
}: Omit<ServicesSectionProps, "variant" | "services">) {
  return (
    <div>
      <div className={styles.categoryPillsContainer}>
        {categorySanctuaries.map((cat) => {
          const isSel = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`${styles.categoryPillButton} ${isSel ? styles.categoryPillButtonActive : ""}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className={styles.servicesGrid}>
        {filteredServices.map((service: any) => (
          <ServiceCard
            key={service.uuid || service.id}
            service={service}
            subServices={subServicesMap[service.id] || subServicesMap[service.uuid] || []}
            isAdded={isAdded(service.uuid || service.id)}
            isSubAdded={(subId) => isAdded(subId)}
            onToggleCart={toggleCart}
            loadingIds={loadingIds}
          />
        ))}
      </div>
    </div>
  );
}

const SERVICES_VARIANTS: Record<
  HomeServicesVariant,
  React.ComponentType<Omit<ServicesSectionProps, "variant" | "services">>
> = {
  grid: GridServicesLayout,
  "two-column-list": TwoColumnListLayout,
  "compact-accordion": CompactAccordionLayout,
};

export default function ServicesSection({ variant, ...props }: ServicesSectionProps) {
  if (!props.services || props.services.length === 0) {
    return null;
  }

  const Component = SERVICES_VARIANTS[variant] ?? SERVICES_VARIANTS.grid;

  return (
    <section className={styles.catalogSection} id="services-menu">
      <div className={styles.catalogHeader}>
        <div className={styles.catalogTitleArea}>
          <div className={styles.catalogSubBadge}>
            <ContentCutOutlinedIcon />
            OUR SERVICES MENU
          </div>
          <div className={styles.catalogContentRow}>
            <h2 className={styles.catalogHeading}>Curated Treatment Offerings</h2>
            <p className={styles.catalogDescription}>
              Choose from tailored treatments formulated with quality ingredients, gentle care, and professional styling.
            </p>
          </div>
        </div>
      </div>

      <Component {...props} />
    </section>
  );
}
