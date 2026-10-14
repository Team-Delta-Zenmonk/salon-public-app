"use client";
import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { addItemLocal, removeItemLocal } from "../../features/salon/cart/cart.slice";
import { addCartItemAction } from "../../features/salon/cart/add-item/add-item.action";
import { removeCartItemAction } from "../../features/salon/cart/remove-item/remove-item.action";
import { deleteCartAction } from "../../features/salon/cart/delete-cart/delete-cart.action";
import { createCartAction } from "../../features/salon/cart/create-cart/create-cart.action";
import { getCartAction } from "../../features/salon/cart/get-cart/get-cart.action";
import { callSnack } from "../../components/snackbar";
import ReservationFloatingBar from "@/components/reservation-floating-bar";
import { ThemedSections } from "@/components/themed-sections";
import { useAppThemeMode } from "@/theme/theme-provider";
import { HOME_SECTIONS, type HomeSectionsContextData } from "./sections";
import styles from "./home.module.css";

const FALLBACK_PHOTOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDg4fWQGY7q01kQEu7Azo-ZxML-xjADF9Algitpt7Ou5sct21_1ua4IwDBx4jGE1pKbAzk6X4b7Tc3z055WSJ-jWOYfOUxzhwKfGYwhm6m4_IHkLoBbjPFJiXN8PaaPHxG56I1j5s0IwbflHjDOE3nSfXTxCTCukrnB2J2fhzv7PJVD2Cvoap0pFNZB9Ju8Jito4BmDcyjiVxQt9eMTS3aoL8UFBE7oamYkIWM52o4E00IFOp6Ie-skBv75NSxqd3h6gB6P_J4FHEU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMkai6tqROm_DonJ_7nSmEjMzHFcmPJmUMfjP1sVIpqOtPImAtz70lBJCodNCeDqojEQm4L1jcmAdG3RqYu-Sgtqtbrr2FSquSgP5if7Vyz2sRcyzD9DJ8C19QuCSwqfDmaVWJgEPWTlB7YSjFEEgrHUdIAMqlagl_kBx8qXcgLQ0dWeWMqILJo5yCvRfa_Zyj8wdnuNZRiE3x0Dii-W70sbseI2Ozcm6paYV-LffI7W_QHG1Tl5H70D0-iV2HhWI9l_EyZdZvA4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrw5TTPmKj4iyxLRJcfvYzsFy0Is8HDNZX88J0zbU17I2S5PfH8IJe9mM5LMYSJUJ8h9yIUzxv9-xSoZtrvPUnqiBtZ0rdCNqzmUXephKg8iOIOA-PJz9Y5ZEcNCzRdQ3euTyBVjoc-ZnRCr62fTqc3xjU3S0-Mp_n8P4116iDauWQYLlvDL6Oxx1FHl3BDFFeK38FvLfGRC-iVB47xq8P2bPbGLwimA7bZf6Oxg3tIO-N3DinnhUdsZcVqi7FGIWBtdNowsqgES4",
];

export default function HomePage() {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();
  const { layout } = useAppThemeMode();

  const services = useMemo(() => salon?.services || [], [salon?.services]);
  const staff = useMemo(() => salon?.staff || [], [salon?.staff]);
  const photos = useMemo(() => salon?.photos || [], [salon?.photos]);
  const salonCategories = useMemo(() => salon?.categories || [], [salon?.categories]);

  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const galleryImages = useMemo(() => {
    const urls = (photos as any[]).map((p) => p?.secure_url || p?.url).filter(Boolean);
    return urls.length > 0 ? urls : FALLBACK_PHOTOS;
  }, [photos]);

  const rootServices = useMemo(
    () => services.filter((s: any) => s.parent_id === null),
    [services]
  );

  const subServicesMap = useMemo(() => {
    return services.reduce<Record<string | number, any[]>>((acc, s: any) => {
      if (s.parent_id) {
        acc[s.parent_id] = acc[s.parent_id] || [];
        acc[s.parent_id].push(s);
      }
      return acc;
    }, {});
  }, [services]);

  const categorySanctuaries = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "all", label: "All Services" }];
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
        (i: any) => i.service?.uuid === serviceId || i.service_id === serviceId
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
          })
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
          await dispatch(
            createCartAction({ salon_id: salon.uuid, user_id: customer.uuid, items: [payload] })
          ).unwrap();
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

  const filteredServices = useMemo(() => {
    return rootServices.filter((s: any) => {
      if (selectedGender !== "all") {
        const sg = s.gender?.toLowerCase() || "unisex";
        if (sg !== "unisex" && sg !== selectedGender) return false;
      }
      if (selectedCategory !== "all") {
        const catName = s.category?.name?.toLowerCase() || "";
        const catId = String(s.category?.id || s.category_id || "").toLowerCase();
        if (selectedCategory !== catName && selectedCategory !== catId && !catName.includes(selectedCategory)) {
          return false;
        }
      }
      return true;
    });
  }, [rootServices, selectedGender, selectedCategory]);

  const contextData: HomeSectionsContextData = {
    salon,
    services,
    staff,
    galleryImages,
    filteredServices,
    subServicesMap,
    categorySanctuaries,
    selectedCategory,
    onSelectCategory: setSelectedCategory,
    selectedGender,
    onSelectGender: setSelectedGender,
    toggleCart,
    isAdded,
    loadingIds,
    onNavigateSpecialists: () => navigate("/specialists"),
    onExploreServices: () => {
      const el = document.getElementById("services-menu");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  };

  return (
    <Box className={styles.pageContainer}>
      <ThemedSections page="home" registry={HOME_SECTIONS} data={contextData} />
      <ReservationFloatingBar />
    </Box>
  );
}
