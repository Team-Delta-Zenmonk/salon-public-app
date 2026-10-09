"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import EllipsisCell from "@/components/ellipse-cell";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import ServiceCard from "@/components/service-card";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { addItemLocal, removeItemLocal } from "../../features/salon/cart/cart.slice";
import { calculateTotals } from "../../common/cart.utils";

export default function ServicesPage() {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();
  const searchParams = useSearchParams();

  const cart = useAppSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.get("category") || "all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("curated");

  const isAdded = (serviceId: string) =>
    cart.items.some((i: any) => i.service?.uuid === serviceId || i.service_id === serviceId);

  const toggleCart = (service: any) => {
    const serviceId = service.uuid || service.id;
    if (isAdded(serviceId)) {
      dispatch(removeItemLocal(serviceId));
    } else {
      dispatch(
        addItemLocal({
          service_id: serviceId,
          name: service.name,
          base_price: service.price,
          duration: service.duration,
          salon,
          service,
        })
      );
    }
  };

  const { totalPrice } = calculateTotals(cart.items);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams?.get("search");
    if (q !== null && q !== undefined) setSearchQuery(q);
  }, [searchParams]);

  const services: any[] = useMemo(() => salon?.services || [], [salon?.services]);
  const salonCategories: any[] = useMemo(() => salon?.categories || [], [salon?.categories]);

  const rootServices = useMemo(() => services.filter((s) => s.parent_id === null), [services]);

  const subServicesMap = useMemo(() => {
    return services.reduce<Record<number, any[]>>((acc, s) => {
      if (s.parent_id) {
        acc[s.parent_id] = acc[s.parent_id] || [];
        acc[s.parent_id].push(s);
      }
      return acc;
    }, {});
  }, [services]);

  const categoryTabs = useMemo(() => {
    const list: { id: string; label: string }[] = [
      { id: "all", label: "All Services" },
    ];
    const seen = new Set<string>();

    salonCategories.forEach((cat) => {
      if (cat.name && !seen.has(cat.name.toLowerCase())) {
        seen.add(cat.name.toLowerCase());
        list.push({ id: String(cat.id || cat.uuid || cat.name).toLowerCase(), label: cat.name });
      }
    });

    services.forEach((s) => {
      if (s.category?.name && !seen.has(s.category.name.toLowerCase())) {
        seen.add(s.category.name.toLowerCase());
        list.push({ id: s.category.name.toLowerCase(), label: s.category.name });
      }
    });

    return list;
  }, [salonCategories, services]);

  const filteredServices = useMemo(() => {
    let result = rootServices.filter((service) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = service.name?.toLowerCase().includes(q);
        const matchesDesc = service.description?.toLowerCase().includes(q);
        const subs = subServicesMap[service.id] || subServicesMap[service.uuid] || [];
        const matchesSub = subs.some(
          (sub) => sub.name?.toLowerCase().includes(q) || sub.description?.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }

      if (selectedGender !== "all") {
        const sg = (service.gender || "unisex").toLowerCase();
        const target = selectedGender.toLowerCase();
        if (target === "women") {
          if (sg !== "women" && sg !== "female" && sg !== "unisex" && sg !== "gender-neutral") return false;
        } else if (target === "men") {
          if (sg !== "men" && sg !== "male" && sg !== "unisex" && sg !== "gender-neutral") return false;
        } else if (target === "gender-neutral") {
          if (sg !== "unisex" && sg !== "gender-neutral") return false;
        }
      }

      if (selectedCategory !== "all") {
        const serviceCatName = service.category?.name?.toLowerCase() || "";
        const serviceCatId = String(service.category?.id || service.category_id || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        const matchesDirect = serviceCatName.includes(target) || serviceCatId.includes(target);
        const matchesFuzzy = service.name?.toLowerCase().includes(target);
        if (!matchesDirect && !matchesFuzzy) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "duration") {
      result = [...result].sort((a, b) => (a.duration || 0) - (b.duration || 0));
    }

    return result;
  }, [rootServices, searchQuery, selectedGender, selectedCategory, sortBy, subServicesMap]);

  return (
    <div className="w-full bg-(--bg-surface) min-h-screen text-(--color-on-surface)">
      <section className="max-w-[1280px] w-full mx-auto px-4 md:px-12 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-(--color-secondary)">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-secondary)" />
              <span className="font-sans text-xs uppercase tracking-widest text-(--color-secondary) font-semibold">
                Sanctuary Menu
              </span>
              <span className="text-(--color-outline-variant)">•</span>
              <span className="font-sans text-xs text-(--color-on-surface-variant) font-medium">
                {filteredServices.length} Curated Offerings
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-(--color-on-surface) tracking-tight font-bold">
              Treatment Catalog
            </h1>
            <p className="font-sans text-sm text-(--color-on-surface-variant) leading-relaxed">
              Architectural forms, biodynamic formulations, and tranquil restorative therapies calibrated for holistic scalp health and precision styling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-[4px] font-sans text-xs uppercase tracking-wider transition-all border-0 cursor-pointer ${isActive
                      ? "bg-(--color-primary) text-(--color-on-primary) font-semibold shadow-xs"
                      : "bg-(--bg-surface-container) hover:bg-(--bg-surface-container-high) text-(--color-on-surface-variant)"
                    }`}
                >
                  <EllipsisCell value={tab.label} maxChars={12} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-(--bg-surface-container-low) py-4 border-y border-(--color-hairline)/60">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-(--color-on-surface-variant) pointer-events-none text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments by name, formula, or ritual..."
                className="w-full h-12 pl-11 pr-10 bg-(--bg-surface-container-lowest) text-(--color-on-surface) placeholder:text-(--color-outline) font-sans text-xs rounded-[4px] border border-(--color-hairline) focus:outline-none focus:ring-1 focus:ring-(--color-secondary) transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-on-surface-variant) hover:text-(--color-on-surface) bg-transparent border-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center bg-(--bg-surface-container-lowest) rounded-[4px] px-3 h-12 border border-(--color-hairline)">
              <span className="font-sans text-[10px] uppercase tracking-wider text-(--color-outline) px-1 select-none font-semibold whitespace-nowrap">
                Suitability:
              </span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-transparent text-(--color-on-surface) font-sans text-xs py-2 focus:outline-none cursor-pointer border-0"
              >
                <option value="all">All Genders</option>
                <option value="gender-neutral">Gender Neutral</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center bg-(--bg-surface-container-lowest) rounded-[4px] px-3 h-12 border border-(--color-hairline)">
              <span className="font-sans text-[10px] uppercase tracking-wider text-(--color-outline) px-1 select-none font-semibold whitespace-nowrap">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-(--color-on-surface) font-sans text-xs py-2 focus:outline-none cursor-pointer border-0"
              >
                <option value="curated">Curated Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Duration: Brief to Long</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] w-full mx-auto px-4 md:px-12 py-10 pb-32">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[4px] border border-dashed border-(--color-hairline) bg-(--bg-surface-container-lowest)">
            <ContentCutOutlinedIcon className="text-(--color-outline) text-[40px] mb-2" />
            <Typography className="font-semibold text-sm text-(--color-on-surface)">
              No treatments match your current filters
            </Typography>
            <Typography className="text-xs text-(--color-on-surface-variant) mt-1 max-w-sm mx-auto">
              Try clearing search terms or selecting another service sanctuary.
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedGender("all");
              }}
              className="mt-4 rounded-[4px] px-5 py-2 text-xs font-semibold text-(--color-on-primary) bg-(--color-primary) hover:bg-(--color-on-surface-variant) normal-case"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.uuid || service.id}
                service={service}
                subServices={subServicesMap[service.id] || subServicesMap[service.uuid] || []}
                isAdded={isAdded(service.uuid || service.id)}
                isSubAdded={(subId) => isAdded(subId)}
                onToggleCart={toggleCart}
              />
            ))}
          </div>
        )}
      </section>

      {cart.items.length > 0 && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center justify-between px-6 py-4 w-[calc(100%-2rem)] max-w-3xl bg-(--bg-surface-container-lowest) rounded-[4px] border border-(--color-primary) shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
            <div className="w-10 h-10 rounded-[4px] bg-(--color-primary) flex items-center justify-center text-(--color-on-primary) shrink-0">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-bold text-(--color-secondary) tracking-wider uppercase">
                  ACTIVE RESERVATION
                </span>
                <span className="h-1 w-1 rounded-full bg-(--color-on-surface)" />
                <span className="text-[11px] text-(--color-on-surface-variant) font-sans">
                  {cart.items.length} Treatment{cart.items.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="font-serif text-sm text-(--color-on-surface) font-medium truncate max-w-sm capitalize">
                {cart.items[0]?.name || "Selected Ritual"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full sm:w-auto bg-(--color-primary) hover:bg-(--color-on-surface-variant) text-(--color-on-primary) px-6 py-3 rounded-[4px] font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-0"
          >
            <span>PROCEED TO SCHEDULE (₹{totalPrice})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </aside>
      )}
    </div>
  );
}
