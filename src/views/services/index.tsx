"use client";
import { useState, useMemo, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import EllipsisCell from "@/components/ellipse-cell";
import CustomSelect from "@/components/custom-select";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import { useStorefront } from "../../providers/storefront-provider";
import ServiceCard from "@/components/service-card";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { addItemLocal, removeItemLocal } from "../../features/salon/cart/cart.slice";
import { addCartItemAction } from "../../features/salon/cart/add-item/add-item.action";
import { removeCartItemAction } from "../../features/salon/cart/remove-item/remove-item.action";
import { deleteCartAction } from "../../features/salon/cart/delete-cart/delete-cart.action";
import { createCartAction } from "../../features/salon/cart/create-cart/create-cart.action";
import { getCartAction } from "../../features/salon/cart/get-cart/get-cart.action";
import { calculateTotals } from "../../common/cart.utils";
import { callSnack } from "../../components/snackbar";
import ReservationFloatingBar from "@/components/reservation-floating-bar";

import styles from "./services.module.css";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();
  const searchParams = useSearchParams();

  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams?.get("category") || "all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("curated");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const isAdded = (serviceId: string) =>
    cart.items.some((i: any) => i.service?.uuid === serviceId || i.service_id === serviceId);

  const toggleCart = async (service: any) => {
    const serviceId = service.uuid || service.id;
    if (loadingIds.includes(serviceId)) return;

    if (isAdded(serviceId)) {
      if (!isAuthenticated) {
        dispatch(removeItemLocal(serviceId));
        callSnack("Removed from cart", "info");
        return;
      }

      const cartItem = cart.items.find(
        (i: any) => i.service?.uuid === serviceId || i.service_id === serviceId,
      );

      if (cart.cartUuid && cartItem?.uuid) {
        setLoadingIds((prev) => [...prev, serviceId]);
        try {
          if (cart.items.length === 1) {
            await dispatch(deleteCartAction(cart.cartUuid)).unwrap();
          } else {
            await dispatch(removeCartItemAction(cartItem.uuid)).unwrap();
          }
          if (customer?.uuid) {
            await dispatch(getCartAction(customer.uuid));
          }
          callSnack("Removed from cart", "info");
        } catch (error: any) {
          callSnack(error?.message || "Failed to remove item", "error");
        } finally {
          setLoadingIds((prev) => prev.filter((id) => id !== serviceId));
        }
      } else {
        dispatch(removeItemLocal(serviceId));
        callSnack("Removed from cart", "info");
      }
    } else {
      if (!isAuthenticated) {
        dispatch(
          addItemLocal({
            service_id: serviceId,
            name: service.name,
            base_price: service.price,
            duration: service.duration,
            salon,
            service,
          }),
        );
        callSnack("Added to cart", "success");
        return;
      }

      const payload = {
        service_id: service.uuid,
        duration: service.duration,
        name: service.name,
        base_price: service.price,
      };

      setLoadingIds((prev) => [...prev, serviceId]);
      try {
        if (cart.cartUuid) {
          await dispatch(addCartItemAction({ cart_id: cart.cartUuid, ...payload })).unwrap();
          await dispatch(getCartAction(customer.uuid));
          callSnack("Added to cart", "success");
        } else if (salon?.uuid) {
          await dispatch(createCartAction({ salon_id: salon.uuid, user_id: customer.uuid, items: [payload] })).unwrap();
          await dispatch(getCartAction(customer.uuid));
          callSnack("Cart created and item added", "success");
        }
      } catch (error: any) {
        callSnack(error?.message || "Failed to add item", "error");
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== serviceId));
      }
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
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.sanctuaryTag}>
              <span className={styles.tagDot} />
              <span className={styles.tagLabel}>
                Sanctuary Menu
              </span>
              <span>•</span>
              <span className={styles.tagCount}>
                {filteredServices.length} Curated Offerings
              </span>
            </div>
            <h1 className={styles.title}>
              Treatment Catalog
            </h1>
            <p className={styles.description}>
              Architectural forms, biodynamic formulations, and tranquil restorative therapies calibrated for holistic scalp health and precision styling.
            </p>
          </div>

          <div className={styles.mobileCategorySelect}>
            <CustomSelect
              label="Sanctuary:"
              value={selectedCategory}
              options={categoryTabs}
              onChange={(val) => setSelectedCategory(val)}
              className={styles.fullWidthSelect}
              buttonSize="sm"
              maxChars={20}
              menuMaxChars={30}
              menuWidth={240}
            />
          </div>

          <div className={styles.desktopCategoryTabs}>
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={isActive ? styles.categoryTabActive : styles.categoryTabInactive}
                >
                  <EllipsisCell value={tab.label} maxChars={12} className="capitalize" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.filterBarSection}>
        <div className={styles.filterBarContainer}>
          <div className={styles.filterGrid}>
            <div className={styles.searchBoxCol}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments by name, formula, or ritual..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.clearSearchBtn}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                </button>
              )}
            </div>

            <div className={styles.selectGenderCol}>
              <CustomSelect
                label="Suitability:"
                value={selectedGender}
                options={[
                  { id: "all", label: "All Genders" },
                  { id: "gender-neutral", label: "Gender Neutral" },
                  { id: "women", label: "Women" },
                  { id: "men", label: "Men" },
                ]}
                onChange={(val) => setSelectedGender(val)}
                buttonSize="lg"
                rounded="4px"
                maxChars={18}
                menuMaxChars={20}
                menuWidth={200}
              />
            </div>

            <div className={styles.selectSortCol}>
              <CustomSelect
                label="Sort:"
                value={sortBy}
                options={[
                  { id: "curated", label: "Curated Order" },
                  { id: "price-asc", label: "Price: Low to High" },
                  { id: "price-desc", label: "Price: High to Low" },
                  { id: "duration", label: "Duration: Brief to Long" },
                ]}
                onChange={(val) => setSortBy(val)}
                buttonSize="lg"
                rounded="4px"
                maxChars={20}
                menuMaxChars={24}
                menuWidth={220}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        {filteredServices.length === 0 ? (
          <div className={styles.emptyState}>
            <ContentCutOutlinedIcon className={styles.emptyIcon} />
            <Typography className={styles.emptyTitle}>
              No treatments match your current filters
            </Typography>
            <Typography className={styles.emptyDesc}>
              Try clearing search terms or selecting another service sanctuary.
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedGender("all");
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={styles.servicesGrid}>
            {filteredServices.map((service) => (
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
        )}
      </section>

      <ReservationFloatingBar />
    </div>
  );
}
