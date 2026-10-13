"use client";
import { useState, useMemo, useEffect } from "react";
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
import EllipsisCell from "@/components/ellipse-cell";
import CustomSelect from "@/components/custom-select";
import ServiceCard from "@/components/service-card";
import StaffCard from "@/components/staff-card";
import ReservationFloatingBar from "@/components/reservation-floating-bar";

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

  const services: any[] = useMemo(() => salon?.services || [], [salon?.services]);
  const staff: any[] = useMemo(() => salon?.staff || [], [salon?.staff]);
  const photos: any[] = useMemo(() => salon?.photos || [], [salon?.photos]);
  const salonCategories: any[] = useMemo(() => salon?.categories || [], [salon?.categories]);

  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const galleryImages = useMemo(() => {
    const urls = photos.map((p) => p?.secure_url || p?.url).filter(Boolean);
    return urls.length > 0 ? urls : FALLBACK_PHOTOS;
  }, [photos]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const rootServices = useMemo(() => services.filter((s: any) => s.parent_id === null), [services]);

  const subServicesMap = useMemo(() => {
    return services.reduce<Record<string | number, any[]>>((acc, s) => {
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

  const filteredServices = useMemo(() => {
    return rootServices.filter((s) => {
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

  return (
    <Box className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.dot} />
              <span className={styles.badgeText}>
                PREMIUM HAIR &amp; SKIN CARE
              </span>
            </div>

            <h1 className={styles.heroHeading}>
              Expert Styling, <br /> Precision Haircuts &amp; Modern Beauty
            </h1>

            <div className={styles.heroAboutWrapper}>
              <EllipsisCell
                value={salon?.about || "A relaxing, premium salon where expert stylists and skincare professionals provide quality beauty and grooming services tailored to you."}
                className={styles.heroAboutText}
                maxLines={5}
                maxChars={200}
              />
            </div>

            <div className={styles.statusCard}>
              <span className={styles.pulseWrapper}>
                <span className={styles.pulseRing} />
                <span className={styles.pulseDot} />
              </span>
              <span className={styles.statusText}>
                OPEN FOR APPOINTMENTS TODAY
              </span>
            </div>

            <div className={styles.heroActions}>
              <a
                href="#services-menu"
                className={styles.primaryCta}
              >
                <span>EXPLORE SERVICES</span>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_downward</span>
              </a>
              <button
                type="button"
                onClick={() => navigate("/specialists")}
                className={styles.secondaryBtn}
              >
                <span>MEET OUR SPECIALISTS</span>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>person</span>
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.bentoCard}>
              {galleryImages.map((imgUrl: string, idx: number) => {
                const isVisible = idx === carouselIndex % galleryImages.length;
                return (
                  <img
                    key={`bento-1-${imgUrl}`}
                    alt="Salon Showcase"
                    src={imgUrl}
                    className={styles.bentoImage}
                    style={{ opacity: isVisible ? 1 : 0, zIndex: isVisible ? 10 : 0 }}
                  />
                );
              })}
              <div className={styles.bentoOverlay} />
              <div className={styles.bentoContent}>
                <span className={styles.bentoSub}>PREMIUM SALON</span>
                <h2 className={styles.bentoTitle}>
                  Precision Styling &amp; Healthy Hair Care
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <span className={styles.pillarNum}>01. COMFORT &amp; CARE</span>
            <h3 className={styles.pillarTitle}>Relaxing Atmosphere</h3>
            <p className={styles.pillarDesc}>
              Enjoy a peaceful, personalized consultation in spacious, clean, and comfortable private styling stations.
            </p>
          </div>
          <div className={styles.pillarCard}>
            <span className={styles.pillarNum}>02. PREMIUM QUALITY</span>
            <h3 className={styles.pillarTitle}>Modern Aesthetics</h3>
            <p className={styles.pillarDesc}>
              Every detail is designed to give you a calm, unhurried, and comfortable salon visit every single time.
            </p>
          </div>
          <div className={styles.pillarCard}>
            <span className={styles.pillarNum}>03. EXPERT STYLISTS</span>
            <h3 className={styles.pillarTitle}>Quality Products</h3>
            <p className={styles.pillarDesc}>
              Top-grade hair treatments, professional styling tools, and scalp care provided by certified hair specialists.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection} id="services-menu">
        <div className={styles.catalogHeader}>
          <div className={styles.catalogTitleArea}>
            <div className={styles.catalogSubBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>content_cut</span>
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

        <div className={styles.mobileFilterRow}>
          <CustomSelect
            label="Category:"
            value={selectedCategory}
            options={categorySanctuaries}
            onChange={(val) => setSelectedCategory(val)}
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
            onChange={(val) => setSelectedGender(val)}
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
                onClick={() => setSelectedCategory(cat.id)}
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
                  onClick={() => setSelectedGender(g.id)}
                  className={isSel ? styles.genderBtnSelected : styles.genderBtnDefault}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--app-muted)", fontSize: "0.75rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--app-secondary, #5A6B5C)" }}>verified</span>
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
      </section>

      {staff.length > 0 && (
        <section className={styles.catalogSection} style={{ borderTop: "1px solid var(--app-border)" }}>
          <div className={styles.catalogHeader}>
            <div className={styles.catalogTitleArea}>
              <div className={styles.catalogSubBadge}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>workspace_premium</span>
                EXPERT STYLISTS &amp; SPECIALISTS
              </div>
              <div className={styles.catalogContentRow}>
                <h2 className={styles.catalogHeading}>Meet Our Master Specialists</h2>
                <button
                  type="button"
                  onClick={() => navigate("/specialists")}
                  className={styles.secondaryBtn}
                >
                  <span>VIEW ALL SPECIALISTS</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.servicesGrid}>
            {staff.slice(0, 3).map((member: any) => (
              <StaffCard key={member.uuid || member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      <ReservationFloatingBar />
    </Box>
  );
}

