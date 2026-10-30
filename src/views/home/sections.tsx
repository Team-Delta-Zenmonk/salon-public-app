"use client";
import React from "react";
import type { HomeSectionKey, HomeLayoutConfig } from "@/theme/layout.types";
import type { Salon, Service, Staff, SalonCategory } from "@/common/salon.type";
import HeroSection from "./_components/hero-section";
import PillarsSection from "./_components/pillars-section";
import ServicesSection from "./_components/services-section";
import SpecialistsSection from "./_components/specialists-section";

export interface HomeSectionsContextData {
  salon: Salon | null;
  services: Service[];
  staff: Staff[];
  galleryImages: string[];
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
  onNavigateSpecialists: () => void;
  onExploreServices: () => void;
  onBookService?: (service: Service) => void;
  isServicesLoading?: boolean;
}

export type SectionRenderer = (
  layout: HomeLayoutConfig,
  data: HomeSectionsContextData
) => React.ReactNode;

export const HOME_SECTIONS: Record<HomeSectionKey, SectionRenderer> = {
  hero: (layout, data) => (
    <HeroSection
      salon={data.salon}
      galleryImages={data.galleryImages}
      variant={layout.heroVariant}
      onExploreServices={data.onExploreServices}
      onMeetSpecialists={data.onNavigateSpecialists}
    />
  ),
  pillars: () => <PillarsSection />,
  services: (layout, data) => {
    if (!data.services || data.services.length === 0) {
      return null;
    }
    return (
      <ServicesSection
        variant={layout.servicesVariant}
        services={data.services}
        filteredServices={data.filteredServices}
        subServicesMap={data.subServicesMap}
        categorySanctuaries={data.categorySanctuaries}
        selectedCategory={data.selectedCategory}
        onSelectCategory={data.onSelectCategory}
        selectedGender={data.selectedGender}
        onSelectGender={data.onSelectGender}
        toggleCart={data.toggleCart}
        isAdded={data.isAdded}
        loadingIds={data.loadingIds}
        onBookService={data.onBookService}
        isLoading={data.isServicesLoading}
      />
    );
  },
  specialists: (_layout, data) => (
    <SpecialistsSection
      staff={data.staff}
      onNavigateSpecialists={data.onNavigateSpecialists}
    />
  ),
};
