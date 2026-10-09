"use client";
import { useState, useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { calculateTotals } from "../../common/cart.utils";
import { addItemLocal, removeItemLocal } from "../../features/salon/cart/cart.slice";
import EllipsisCell from "@/components/ellipse-cell";
import ServiceCard from "@/components/service-card";
import StaffCard from "@/components/staff-card";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const { totalPrice } = calculateTotals(cart.items);

  return (
    <Box className="space-y-20 pb-36 text-[#1C1C18] bg-[#FCF9F3] min-h-screen">
      <section className="relative pt-12 lg:pt-16 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[2px] bg-[#F2EEE7] border border-[#E5DFD5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C1A17]" />
              <span className="font-sans text-[10px] font-semibold text-[#766A5E] tracking-[0.14em] uppercase">
                HAUTE COIFFURE & DERMAL SANCTUARY
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1C1A17] leading-[1.08] tracking-tight">
              Tactile Quietude, <br /> Tailored Shears & Avant-Garde Beauty
            </h1>

            <EllipsisCell
              value={salon?.about || "An intimate, sanctuary-level atelier where master scissorsmiths and clinical facialists transform the sensory ritual of luxury grooming into contemporary art."}
              className="font-sans text-base sm:text-lg text-[#4B463F] max-w-2xl leading-relaxed my-2 font-normal"
            />

            <div className="flex items-center gap-3 py-2 px-3.5 rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A6B5C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A6B5C]" />
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[#1C1C18]">
                OPEN FOR BESPOKE APPOINTMENTS TODAY
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#services-menu"
                className="bg-[#1C1A17] hover:bg-[#2E2A25] text-[#FCFAF7] px-7 py-3.5 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-all flex items-center gap-2 no-underline"
              >
                <span>EXPLORE RITUAL MENU</span>
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </a>
              <button
                type="button"
                onClick={() => navigate("/specialists")}
                className="bg-transparent hover:bg-[#F2EEE7] text-[#1C1A17] border border-[#1C1A17] px-7 py-3.5 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>RESIDENT SPECIALISTS</span>
                <span className="material-symbols-outlined text-[16px]">person</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="group relative rounded-[2px] overflow-hidden border border-[#E5DFD5] bg-[#F0EEE8] aspect-[3/4] col-span-2 shadow-xs transition-all duration-300">
              {galleryImages.map((imgUrl: string, idx: number) => {
                const isVisible = idx === carouselIndex % galleryImages.length;
                return (
                  <img
                    key={`bento-1-${imgUrl}`}
                    alt="Atelier Solstice Craft"
                    src={imgUrl}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                  />
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/80 via-[#1C1A17]/30 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                <span className="font-sans text-[10px] font-semibold text-[#A88B64] uppercase tracking-[0.14em] block mb-1">COUTURE ATELIER</span>
                <h2 className="font-serif text-2xl text-[#FCFAF7] font-normal leading-snug">
                  Precision Geometry & Botanical Radiance
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5DFD5] bg-[#F6F3ED] py-16 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-3">
            <span className="font-sans text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase block">01. TRANQUIL AUTHORITY</span>
            <h3 className="font-serif text-xl text-[#1C1A17] font-medium">Composed Deliberation</h3>
            <p className="font-sans text-xs text-[#766A5E] leading-relaxed">
              Replacing urgent transactional booking software with serene, personalized consultation and spacious private suites.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-sans text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase block">02. SENSORY REFINEMENT</span>
            <h3 className="font-serif text-xl text-[#1C1A17] font-medium">Textured Aesthetics</h3>
            <p className="font-sans text-xs text-[#766A5E] leading-relaxed">
              Every detail channels organic linen, brushed bronze metals, and natural stone for an unhurried luxury tempo.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-sans text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase block">03. DISCERNING CURATION</span>
            <h3 className="font-serif text-xl text-[#1C1A17] font-medium">Bespoke Formulations</h3>
            <p className="font-sans text-xs text-[#766A5E] leading-relaxed">
              French glazes, surgical-grade shears, and Japanese scalp trichology executed by master certified artisans.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-[1440px] mx-auto w-full py-8" id="services-menu">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#E5DFD5] pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#735A37] font-sans text-[10px] font-semibold tracking-[0.14em] uppercase mb-2">
              <span className="material-symbols-outlined text-[16px]">content_cut</span>
              BESPOKE RITUAL CATALOG
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">Curated Treatment Offerings</h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#766A5E] max-w-md leading-relaxed">
            Select tailored ceremonies formulated with botanical actives, French glazes, and surgical-grade styling implements.
          </p>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-none border-b border-[#E5DFD5]/60 mb-8">
          {categorySanctuaries.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.08em] shrink-0 cursor-pointer transition-all border ${isSel
                    ? "bg-[#1C1A17] text-[#FCFAF7] border-[#1C1A17]"
                    : "bg-[#FCFAF7] text-[#766A5E] border-[#E5DFD5] hover:border-[#1C1A17] hover:text-[#1C1A17]"
                  }`}
              >
                <EllipsisCell value={cat.label} maxChars={22} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[10px] text-[#766A5E] uppercase tracking-[0.12em] font-semibold mr-2">GUEST FOCUS:</span>
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
                  className={`px-3.5 py-1.5 rounded-[2px] font-sans text-[11px] font-semibold tracking-wider transition-all cursor-pointer border ${isSel
                      ? "bg-[#A88B64] text-[#FCFAF7] border-[#A88B64]"
                      : "bg-[#F6F3ED] text-[#766A5E] border-[#E5DFD5] hover:border-[#1C1A17]"
                    }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          <div className="text-[#766A5E] font-sans text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#5A6B5C]">verified</span>
            <span>All rituals include complimentary botanical sensory rinse</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: any) => (
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
      </section>

      {staff.length > 0 && (
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto w-full py-8 border-t border-[#E5DFD5]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#E5DFD5] pb-8">
            <div>
              <div className="flex items-center gap-2 text-[#A88B64] font-sans text-[10px] font-semibold tracking-[0.14em] uppercase mb-2">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                RESIDENT ARTISANS & STYLISTS
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#1C1A17] font-normal">Meet Our Master Specialists</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/specialists")}
              className="bg-transparent text-[#1C1A17] border border-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#FCFAF7] px-6 py-3 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
            >
              <span>VIEW ALL SPECIALISTS</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.slice(0, 3).map((member: any) => (
              <StaffCard key={member.uuid || member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {cart.items.length > 0 && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center justify-between px-6 py-4 w-[calc(100%-2rem)] max-w-3xl bg-[#FCFAF7] rounded-[2px] border border-[#1C1A17] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
            <div className="w-10 h-10 rounded-[2px] bg-[#1C1A17] flex items-center justify-center text-[#FCFAF7] shrink-0">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase">ACTIVE RESERVATION</span>
                <span className="h-1 w-1 rounded-full bg-[#1C1A17]" />
                <span className="text-[11px] text-[#766A5E] font-sans">
                  {cart.items.length} Treatment{cart.items.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="font-serif text-sm text-[#1C1A17] font-medium truncate max-w-sm capitalize">
                {cart.items[0]?.name || "Selected Ritual"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full sm:w-auto bg-[#1C1A17] hover:bg-[#2E2A25] text-[#FCFAF7] px-6 py-3 rounded-[2px] font-sans text-xs font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all cursor-pointer border-0"
          >
            <span>PROCEED TO SCHEDULE (₹{totalPrice})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </aside>
      )}
    </Box>
  );
}

