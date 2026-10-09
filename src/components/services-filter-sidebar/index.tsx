"use client";
import React from "react";
import clsx from "clsx";

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
    <aside className={clsx("space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-none", className)}>
      <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-(--app-border) panel-rim shadow-xl space-y-6">
        <div>
          <label htmlFor="service-search-input" className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase block mb-2 font-bold">
            SEARCH RITUALS
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              search
            </span>
            <input
              id="service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, active, or ritual..."
              className="w-full pl-10 pr-9 py-3 bg-surface rounded-xl border border-outline-variant/40 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface bg-transparent border-0 cursor-pointer p-1"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase font-bold">
              SERVICE SANCTUARIES
            </span>
            {(selectedCategory !== "all" || searchQuery || selectedGender !== "all") && (
              <button
                type="button"
                onClick={onReset}
                className="font-label-caps text-label-caps text-primary bg-transparent border-0 cursor-pointer uppercase hover:underline font-bold"
              >
                RESET ALL
              </button>
            )}
          </div>
          <ul className="space-y-1.5 p-0 m-0 list-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left cursor-pointer border-0",
                      isSelected
                        ? "bg-(--app-primary-soft) text-(--app-primary) border-l-4 border-(--app-primary) font-bold shadow-xs"
                        : "bg-transparent text-on-surface-variant hover:bg-surface-container/80 hover:text-on-surface"
                    )}
                  >
                    <span className="font-body-md text-body-md capitalize truncate mr-2">
                      {cat.label}
                    </span>
                    <span
                      className={clsx(
                        "font-label-caps text-label-caps px-2.5 py-0.5 rounded-full shrink-0",
                        isSelected
                          ? "bg-primary text-on-primary font-extrabold"
                          : "bg-surface-container-high text-on-surface-variant"
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

        <hr className="border-outline-variant/20 my-2" />

        <div>
          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase block mb-3 font-bold">
            TARGET GUEST
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {genderOptions.map((g) => {
              const isSelected = selectedGender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectGender(g.id)}
                  className={clsx(
                    "px-3 py-2.5 rounded-xl font-label-md text-label-md transition-all text-center cursor-pointer",
                    isSelected
                      ? "bg-(--app-primary-soft) border border-(--app-primary) text-(--app-primary) font-bold shadow-xs"
                      : "bg-transparent border border-outline-variant/30 text-on-surface-variant hover:border-primary/60 hover:text-on-surface"
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface-container-low border border-(--app-border) panel-rim relative overflow-hidden shadow-md">
        <div className="flex items-center gap-2 mb-2 text-primary font-label-caps text-label-caps tracking-widest uppercase font-bold">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>BESPOKE CONSULTATION</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Every hair sculpture includes a micro-digital scalp & strand elasticity diagnosis prior to chemical contact.
        </p>
      </div>
    </aside>
  );
};

export default ServicesFilterSidebar;
