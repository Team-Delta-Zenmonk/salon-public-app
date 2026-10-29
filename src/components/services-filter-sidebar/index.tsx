"use client";
import React from "react";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { sanitizeSearchInput } from "../../common/search.utils";
import styles from "./services-filter-sidebar.module.css";

export interface CategorySanctuary {
  id: string;
  label: string;
  count: number;
}

export interface ServicesFilterSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: CategorySanctuary[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedGender: string;
  onSelectGender: (gender: string) => void;
  onReset: () => void;
  className?: string;
}

export const ServicesFilterSidebar: React.FC<ServicesFilterSidebarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  onReset,
  className,
}) => {
  const genderOptions = [
    { id: "all", label: "All Guests" },
    { id: "female", label: "Female" },
    { id: "male", label: "Male" },
    { id: "unisex", label: "Unisex" },
  ];

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.card}>
        <div>
          <label htmlFor="service-search-input" className={styles.labelCaps}>
            SEARCH RITUALS
          </label>
          <div className={styles.searchWrapper}>
            <SearchIcon className={styles.searchIcon} />
            <input
              id="service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(sanitizeSearchInput(e.target.value))}
              placeholder="Search by name, active, or ritual..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className={styles.clearBtn}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div>
          <div className={styles.headerRow}>
            <span className={clsx(styles.labelCaps, styles.labelCapsNoMargin)}>
              SERVICE SANCTUARIES
            </span>
            {(selectedCategory !== "all" || searchQuery || selectedGender !== "all") && (
              <button
                type="button"
                onClick={onReset}
                className={styles.resetBtn}
              >
                RESET ALL
              </button>
            )}
          </div>
          <ul className={styles.categoryList}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={clsx(
                      styles.categoryBtn,
                      isSelected && styles.categoryBtnActive
                    )}
                  >
                    <span className={styles.catLabel}>
                      {cat.label}
                    </span>
                    <span
                      className={clsx(
                        styles.catBadge,
                        isSelected && styles.catBadgeActive
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <hr className={styles.divider} />

        <div>
          <span className={styles.labelCaps}>
            TARGET GUEST
          </span>
          <div className={styles.genderGrid}>
            {genderOptions.map((g) => {
              const isSelected = selectedGender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectGender(g.id)}
                  className={clsx(
                    styles.genderBtn,
                    isSelected && styles.genderBtnActive
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.promoCard}>
        <div className={styles.promoTitle}>
          <AutoAwesomeIcon />
          <span>BESPOKE CONSULTATION</span>
        </div>
        <p className={styles.promoText}>
          Every hair sculpture includes a micro-digital scalp & strand elasticity diagnosis prior to chemical contact.
        </p>
      </div>
    </aside>
  );
};

export default ServicesFilterSidebar;
