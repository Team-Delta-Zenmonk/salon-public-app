"use client";
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useStorefront } from "../../providers/storefront-provider";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import EllipsisCell from "../../components/ellipse-cell";

export default function AboutPage() {
  const { salon } = useStorefront();
  const navigate = useStorefrontNavigate();

  const salonName = salon?.name || "CRIMSON & SHEAR";
  const displayAbout =
    salon?.about ||
    "Where avant-garde French scissorcraft meets bespoke sensorial Japanese hair rituals in our flagship sanctuary. A temple of stillness, structural precision, and couture aesthetic transformation.";

  const staffList: any[] = useMemo(() => salon?.staff || [], [salon?.staff]);
  const photosList: any[] = useMemo(() => salon?.photos || [], [salon?.photos]);

  const masterStaff = staffList[0] || {};
  const masterStaffName =
    `${masterStaff.first_name || ""} ${masterStaff.last_name || ""}`.trim() || "Elena Vance";
  const masterStaffRole = masterStaff.role || "Creative Director & Master Colorist";
  const masterStaffPhoto =
    masterStaff.photo ||
    masterStaff.avatar_url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAX6QCWXq_pvD_I6LPuEZ6btUb_0Y93-5znXqv2ZYqIdJsWKvemCvEvkmiKYjLudDEcYJhFiSF8_1XqRgYLj5vgturGfYcBBMqIJ4RSkMUTmaYpj2kehJ3imaXTZoB6ZAyzlxpGw0Mn0gFJqneXPziRoJC3Ph3yZ26y5K1lPgFjDx4YEgXeOT3XukmqZ9hfFmv-_ksWiRIUE-9EJaYy9Znr7Z8QlBGuLEdjs_FjhXaXdAhN4lY1pUPk1SXcaRgq_BcOgeOkghBAgjw";

  const galleryImages = useMemo(() => {
    const urls = photosList.map((p) => p?.secure_url || p?.url).filter(Boolean);
    return {
      main:
        urls[0] ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9QIWTV1FAIXLEkhN9TJ7aF_c2oPYekDUVJcYRCbZK0deuJDpFeHgHM-ztgplMlIRm_fHUKMVzATyAVX0Lyc6MbeDxAIuPLbTpbYQo3GaRu4q_hc829OHgm8uGvFz3lRvRaPEt0My_wuXwM43mWQVWmnXyuE1cezgXCV2ztRgwcOdAh5cG0q_ExJwdBehyo1_3g08VnDR7FuZU4aUAnL0LmAROONMPgIF6sVTe7pO5zVnFbg-Oz7RMj4atJRirlVUzWCOqS0cMtww",
      sub1:
        urls[1] ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7blU2KNhjQmMSiGdU_1IjuSMq9qY2yUKr4-lJ9yzEk1rfGPVjLtjsgrQIqRY9qqPCa7-MBe8FDaHjNLKt3XMId5JR4SgM6aQvg-Desoz_mMcwkuJuGk6S8qJo4iTcm1x4L7KLtE6A6kzw5XXy5R3wdqULsMTLBJdqnWhn91Io0aSyOTm44P-PZU8CZILf2IBdHLB3obcw3YZC2uBODCSrB3EQhmal4i6k35V8nT5Hw8vUqD0xejmIM8HmsXEjN9_jdEgj0ln-tLk",
      sub2:
        urls[2] ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCE3KNpru3EYIdtizn9B23A8YovKYZ6ZFH-ipg6MbNzL5SkHRoRXqkIN9ybFM4oh9c5XxgJZBvb-S4vV-ztkl6tg0_t6CUxrRps7-wmi1f_GF3OMqbaop00IZoIBnMfzmpDM430oPo9IP49aA2FgtMOSNChAx1iuNFL65ov81NdlmmO0rJ5A59KwLZBZup4H35ILZbZoHHscQ4CDgXo1T8Q_61gUSdLjapp1AyICEwPHcD837ZI90eYR7_7rzlVCX94WEknvVdN5b0",
    };
  }, [photosList]);

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const formatHours = (day: string) => {
    const raw = salon?.business_hours?.[day] ?? salon?.business_hours?.[day.slice(0, 3)];
    if (!raw) {
      if (day === "friday" || day === "saturday") return "9:00 AM – 9:30 PM";
      if (day === "sunday") return "11:00 AM – 6:00 PM";
      return "10:00 AM – 8:30 PM";
    }
    if (typeof raw === "string") return raw;
    if (raw.is_closed) return "Closed";
    const start = raw.start_time || raw.open || "10:00 AM";
    const end = raw.end_time || raw.close || "8:30 PM";
    return `${start} – ${end}`;
  };

  const mapUrl =
    salon?.map_link ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      salon?.address || "Bandra West, Mumbai"
    )}`;

  return (
    <Box className="bg-background text-on-surface min-h-screen">
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 space-y-8 sm:space-y-12">
        <section className="pt-8 pb-4 space-y-4">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-xs tracking-widest uppercase">
            <span>HOME</span>
            <span className="text-outline-variant">/</span>
            <span>ATELIER</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">ABOUT & LOCATION</span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight font-bold leading-[1.1]">
              The Sanctuary of Architectural Coiffure & Dermal Mastery
            </h1>
            <EllipsisCell value={displayAbout} className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed" maxChars={200} maxLines={5} />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-(--app-border)/30">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-(--app-border) text-on-surface font-label-md text-xs sm:text-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>Haute Couture Master Guild</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-(--app-border) text-on-surface font-label-md text-xs sm:text-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">spa</span>
              <span>Bespoke Trichological Spa</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-(--app-border) text-on-surface font-label-md text-xs sm:text-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">distance</span>
              <span>{salon?.address || "Flagship Atelier • Bandra West"}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-primary/30 text-primary font-label-md text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              <span>Open Now Until 9:30 PM (Salon Soirée)</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8">
            <article className="bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 panel-rim p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">
                  Chapter 01 • Origin & Philosophy
                </span>
                <span className="font-label-caps text-xs tracking-widest text-on-surface-variant/70 uppercase">
                  Est. 2018
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-on-surface mb-4 font-semibold">
                Sculpting Silhouette Beyond Convention
              </h2>
              <div className="space-y-4 font-body-md text-base text-on-surface-variant leading-relaxed">
                <p>
                  <EllipsisCell value={salonName} maxChars={100} maxLines={5} />{" "} was conceived not simply as a salon, but as a sterile, acoustic refuge for intentional self-reinvention. Rooted in Parisian runway ateliers and Japanese meditative scalp baths, every service is an uncompromising ritual balancing precision geometric sectioning with high-potency bio-fermented botanical elixirs.
                </p>
                <p>
                  Our flagship sanctuary features six acoustically isolated suites crafted from blackened cedar, cast bronze, and Italian porphyry stone. Here, urban cacophony dissolves into bespoke aromatic misting, hand-forged Damascus shears, and millimeter-level balance calibrated to each patron’s craniometric posture.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-(--app-border)/30 flex items-start gap-4 bg-surface-container-low p-4 sm:p-5 rounded-xl border border-(--app-border)/20">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/40 relative">
                  <img
                    className="w-full h-full object-cover"
                    alt={masterStaffName}
                    src={masterStaffPhoto}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-editorial italic text-tertiary-fixed text-base sm:text-lg leading-snug mb-2">
                    “Hair is living sculpture. When we shear a single millimeter, we transform not just the silhouette, but the client’s quietest internal cadence.”
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <div>
                      <EllipsisCell value={masterStaffName} maxChars={20} className="font-title-md text-base sm:text-lg text-on-surface font-semibold capitalize" />
                      <EllipsisCell value={masterStaffRole} maxChars={20} className="font-body-sm text-xs sm:text-sm text-on-surface-variant capitalize" />
                    </div>
                    <EllipsisCell value={`${masterStaffName[0]}. ${masterStaffName.split(" ")[1] || ""}`} maxChars={100} maxLines={5} className="font-editorial italic text-primary text-xl tracking-wide opacity-90 select-none" />
                  </div>
                </div>
              </div>
            </article>

            <div className="bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 panel-rim p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">Hospitality Standard</span>
                  <h3 className="font-editorial text-2xl text-on-surface mt-1 font-semibold">Bespoke Guest Privileges</h3>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[28px]">room_service</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">wifi</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">High-Speed Encrypted Wi-Fi</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">Sub-gigabit private guest network</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">ac_unit</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">Clean Air Filtration</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">HEPA-14 medical climate chamber</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">local_bar</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">Botanical Sensory Bar</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">Vintage Blanc de Blancs & adaptogens</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">local_parking</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">White-Glove Valet</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">Private motor court drop-off</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">Private Soundproof Suites</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">Total visual & acoustic isolation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors border border-(--app-border)/30">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">clean_hands</span>
                  </div>
                  <div>
                    <p className="font-label-md text-sm font-semibold text-on-surface">Sterilized Instruments</p>
                    <p className="font-body-sm text-xs text-on-surface-variant">Medical autoclave grade sterilization</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 panel-rim p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">Atelier Operating Hours</span>
                  <h3 className="font-editorial text-2xl text-on-surface mt-1 font-semibold">Consultation & Service Cadence</h3>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-label-caps text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">OPEN NOW</span>
                </div>
              </div>

              <div className="divide-y divide-(--app-border)/30 font-body-md text-sm sm:text-base">
                {daysOfWeek.map((day) => {
                  const hours = formatHours(day);
                  const isFri = day === "friday";

                  if (isFri) {
                    return (
                      <div key={day} className="py-3 px-4 -mx-4 rounded-xl bg-surface-container-high/80 border border-primary/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold capitalize">{day}</span>
                          <span className="px-2.5 py-0.5 text-[10px] rounded-md bg-primary-container text-on-primary-container font-label-caps uppercase font-bold">
                            Salon Soirée
                          </span>
                        </div>
                        <span className="text-on-surface font-semibold">{hours}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={day} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface font-medium capitalize">{day}</span>
                        {day === "sunday" && (
                          <span className="text-on-surface-variant text-xs hidden sm:inline">(Private Rejuvenation Rituals)</span>
                        )}
                      </div>
                      <span className="text-on-surface-variant font-medium">{hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-(--app-border)/30 flex items-center justify-between text-xs sm:text-sm text-on-surface-variant flex-wrap gap-2">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  VIP Out-of-Hours Appointments upon bespoke request
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="text-primary hover:underline font-label-md text-xs sm:text-sm font-semibold bg-transparent border-0 cursor-pointer"
                >
                  Request Slot
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8">
            <div className="bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 panel-rim p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">Spatial Experience</span>
                  <h3 className="font-editorial text-2xl text-on-surface mt-1 font-semibold">Inside the Sanctuary</h3>
                </div>
                <span className="font-label-caps text-xs text-on-surface-variant font-bold">4 SPACES • FLAGSHIP</span>
              </div>

              <div className="grid grid-cols-12 gap-4 h-[480px]">
                <div className="col-span-12 sm:col-span-7 h-full relative rounded-xl overflow-hidden group border border-(--app-border)/30">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Main Atelier Chamber"
                    src={galleryImages.main}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-surface/80 border border-(--app-border) text-primary font-label-caps text-[10px] tracking-wider uppercase font-bold">
                        Main Atelier Chamber
                      </span>
                      <h4 className="font-editorial text-lg text-on-surface mt-1.5 leading-tight font-semibold">
                        Master Styling Stations
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-surface-container/90 border border-(--app-border) flex items-center justify-center text-on-surface group-hover:text-primary transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-5 flex flex-col gap-4 h-full">
                  <div className="h-1/2 relative rounded-xl overflow-hidden group border border-(--app-border)/30">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Ritual Hydro-Chamber"
                      src={galleryImages.sub1}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-surface/80 border border-(--app-border) text-primary font-label-caps text-[9px] tracking-wider uppercase font-bold">
                        Ritual Hydro-Chamber
                      </span>
                      <h5 className="font-title-md text-sm text-on-surface font-semibold mt-1 leading-snug">
                        Japanese Head Spa Suites
                      </h5>
                    </div>
                  </div>

                  <div className="h-1/2 relative rounded-xl overflow-hidden group border border-(--app-border)/30">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Acoustic Seclusion Suite"
                      src={galleryImages.sub2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-surface/80 border border-(--app-border) text-primary font-label-caps text-[9px] tracking-wider uppercase font-bold">
                        Acoustic Seclusion
                      </span>
                      <h5 className="font-title-md text-sm text-on-surface font-semibold mt-1 leading-snug">
                        Private Suite • Vesper
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 panel-rim p-6 sm:p-8 shadow-xl crimson-glow-card relative">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">Flagship Coordinates</span>
                  <EllipsisCell value={salonName} className="font-editorial text-2xl text-on-surface mt-1 font-semibol" maxChars={200} maxLines={5} />
                </div>
                <div className="text-right">
                  <span className="font-label-caps text-xs text-on-surface-variant font-mono">19.0600° N, 72.8335° E</span>
                </div>
              </div>

              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-(--app-border) bg-surface-container-lowest my-4">
                <img
                  className="w-full h-full object-cover opacity-80 filter brightness-90 contrast-125"
                  alt="Location Map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOho6pHwyNQbmWQP4oQsVB8-70rtEtw-L7FYixpPJoHKFD8QfHKoPGnbWwFFnC-dmo8dSojjJzY-xJE2Be8ql7HoPvpTg0heuaZ24sSe6UY0tFZbU34-eblmDhzPRS3fRONTMPiip3n-9cwitQRumD6wEK5Vdp6P_0qvXwAk661B7aa22q112Zc6OGjzslwy_C0TP1CeyGJ4G_DrBg0gbGQ9-SzuhxIlREJSGsSr0GgsGFzg0BNbAQwahVVRpH7e3d8TcswOtQIxo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-12 h-12 rounded-full bg-primary-container/20 animate-ping" />
                    <span className="absolute w-8 h-8 rounded-full bg-primary-container/40" />
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-primary-container flex items-center justify-center shadow-lg crimson-glow-strong">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        content_cut
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 px-3 py-1.5 rounded-lg bg-surface/95 border border-primary/40 text-on-surface shadow-2xl backdrop-blur-md">
                    <p className="font-label-caps text-primary text-[10px] tracking-wider text-center uppercase font-bold">
                      {salonName} ATELIER
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant text-center">
                      Heritage Suite III • Valet Portico
                    </p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-surface/80 border border-(--app-border) text-on-surface font-mono text-xs flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span>N 42° E</span>
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-surface-container-high/90 border border-(--app-border) text-xs font-label-md text-on-surface flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary text-[16px]">local_taxi</span>
                  <span>Valet Court: Gate B</span>
                </div>
              </div>

              <div className="space-y-3 font-body-md text-sm text-on-surface-variant mt-5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">location_on</span>
                  <div>
                    <p className="text-on-surface font-semibold text-base">Flagship Atelier • Heritage Suite III</p>
                    <p className="mt-0.5">{salon?.address || "Nargis Dutt Road, Bandra West, Mumbai, Maharashtra 400050"}</p>
                  </div>
                </div>
                {salon?.phone && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">phone_in_talk</span>
                    <div>
                      <p className="text-on-surface font-semibold text-base">Dedicated Atelier Concierge</p>
                      <p className="font-mono text-sm text-primary mt-0.5">{salon.phone} • concierge@crimsonandshear.com</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-(--app-border)/30">
                <a
                  className="bg-primary-container text-on-primary-container font-label-lg text-sm font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 crimson-glow-button hover:brightness-110 active:scale-95 transition-all no-underline border-0 cursor-pointer"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                  <span>Get GPS Directions</span>
                </a>
                <a
                  className="bg-surface-container-high hover:bg-surface-container-highest border border-(--app-border) text-on-surface font-label-lg text-sm font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 no-underline cursor-pointer"
                  href={`tel:${salon?.phone || "+912289204400"}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">directions_car</span>
                  <span>Call Valet Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 p-6 sm:p-8 rounded-2xl bg-surface-container rounded-2xl border border-(--app-border) dark:border-outline-variant/30 crimson-glow-card relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mb-6 space-y-2">
            <span className="font-label-caps text-xs tracking-widest text-primary uppercase font-bold">The Crimson Etiquette</span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-on-surface font-semibold">
              Discretion, Sanctuary & Punctuality Guarantee
            </h3>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
              To maintain the acoustic peace of our atelier, we observe strict protocols crafted to protect the tranquility of every patron in residency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-(--app-border)/30 pt-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">volume_off</span>
              </div>
              <div>
                <h4 className="font-title-md text-base text-on-surface font-semibold">Silent Suite Option</h4>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Select “Acoustic Silence” upon reservation for an appointment conducted free of incidental conversation and personal device audio.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <div>
                <h4 className="font-title-md text-base text-on-surface font-semibold">1:1 Dedicated Residency</h4>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  No overlapping appointments. Your Master Stylist is locked exclusively to your suite for the entirety of the blocked duration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-(--app-border)/40 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">event_repeat</span>
              </div>
              <div>
                <h4 className="font-title-md text-base text-on-surface font-semibold">24-Hour Courtesy Charter</h4>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Modifications are respectfully received up to 24 hours prior to release reserved trichological preparations and artist schedules.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Box>
  );
}
