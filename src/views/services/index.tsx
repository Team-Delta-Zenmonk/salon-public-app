"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
import EllipsisCell from "@/components/ellipse-cell";
import CustomSelect from "@/components/custom-select";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStorefront } from "../../providers/storefront-provider";
import ServiceCard from "@/components/service-card";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getStorefrontServicesAction } from "../../features/salon/get-storefront-services/get-storefront-services.action";
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

  const [servicesList, setServicesList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  const salonCategories: any[] = useMemo(() => salon?.categories || [], [salon?.categories]);

  const fetchServicesData = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (!salon?.slug) return;
    if (isInitial) setIsLoadingInitial(true);

    try {
      const categoryParam =
        selectedCategory && selectedCategory !== "all"
          ? salonCategories.find(
              (c: any) =>
                String(c.id).toLowerCase() === selectedCategory.toLowerCase() ||
                String(c.uuid).toLowerCase() === selectedCategory.toLowerCase() ||
                c.name?.toLowerCase() === selectedCategory.toLowerCase()
            )?.id
          : undefined;

      const res = await dispatch(
        getStorefrontServicesAction({
          slug: salon.slug,
          page: pageNum,
          limit: 10,
          search: searchQuery.trim() || undefined,
          category_id: categoryParam,
          gender: selectedGender !== "all" ? selectedGender : undefined,
        })
      ).unwrap();

      const newServices = res.services || [];
      if (pageNum === 1) {
        setServicesList(newServices);
      } else {
        setServicesList((prev) => {
          const existingIds = new Set(prev.map((s: any) => s.uuid || s.id));
          return [...prev, ...newServices.filter((s: any) => !existingIds.has(s.uuid || s.id))];
        });
      }

      setPage(pageNum);
      setTotalCount(res.pagination?.total ?? newServices.length);
      setHasMore(res.pagination?.hasMore ?? (newServices.length === 10));
    } catch (err: any) {
      console.error("Failed to fetch storefront services:", err);
    } finally {
      if (isInitial) setIsLoadingInitial(false);
    }
  }, [dispatch, salon?.slug, selectedCategory, salonCategories, searchQuery, selectedGender]);

  useEffect(() => {
    fetchServicesData(1, true);
  }, [fetchServicesData]);

  const loadMoreServices = () => {
    if (!hasMore) return;
    fetchServicesData(page + 1, false);
  };

  const subServicesMap = useMemo(() => {
    return servicesList.reduce<Record<string | number, any[]>>((acc, s) => {
      if (s.children && s.children.length > 0) {
        acc[s.id] = s.children;
        acc[s.uuid] = s.children;
      }
      return acc;
    }, {});
  }, [servicesList]);

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

    return list;
  }, [salonCategories]);

  const sortedServices = useMemo(() => {
    let result = [...servicesList];
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "duration") {
      result.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    }
    return result;
  }, [servicesList, sortBy]);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.sanctuaryTag}>
              <span className={styles.tagDot} />
              <span className={styles.tagLabel}>
                Services Menu
              </span>
              <span>•</span>
              <span className={styles.tagCount}>
                {totalCount} Services Available
              </span>
            </div>
            <h1 className={styles.title}>
              Treatment Catalog
            </h1>
            <p className={styles.description}>
              Explore precision haircuts, coloring, restorative hair treatments, and relaxing skincare tailored for you.
            </p>
          </div>

          <div className={styles.mobileCategorySelect}>
            <CustomSelect
              label="Category:"
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
              <SearchIcon className={styles.searchIcon} />
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
                  <CloseIcon />
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
        {isLoadingInitial ? (
          <Box className={styles.loadingBox}>
            <CircularProgress size={36} />
          </Box>
        ) : sortedServices.length === 0 ? (
          <div className={styles.emptyState}>
            <ContentCutOutlinedIcon className={styles.emptyIcon} />
            <Typography className={styles.emptyTitle}>
              No treatments match your current filters
            </Typography>
            <Typography className={styles.emptyDesc}>
              Try clearing search terms or selecting another service category.
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
          <InfiniteScroll
            dataLength={sortedServices.length}
            next={loadMoreServices}
            hasMore={hasMore}
            loader={
              <Box className={styles.scrollLoaderBox}>
                <CircularProgress size={28} />
              </Box>
            }
            scrollThreshold={0.8}
            style={{ overflow: "visible" }}
          >
            <div className={styles.servicesGrid}>
              {sortedServices.map((service) => (
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
          </InfiniteScroll>
        )}
      </section>

      <ReservationFloatingBar />
    </div>
  );
}
