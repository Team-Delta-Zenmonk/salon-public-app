"use client";
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useStorefront } from "../../providers/storefront-provider";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import EllipsisCell from "../../components/ellipse-cell";
import styles from "./about.module.css";

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
    <Box className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.breadcrumbRow}>
            <span>HOME</span>
            <span className={styles.breadcrumbDivider}>/</span>
            <span>ATELIER</span>
            <span className={styles.breadcrumbDivider}>/</span>
            <span className={styles.breadcrumbActive}>ABOUT & LOCATION</span>
          </div>

          <div className={styles.heroHeadingWrapper}>
            <h1 className={styles.heroHeading}>
              The Sanctuary of Architectural Coiffure & Dermal Mastery
            </h1>
            <EllipsisCell value={displayAbout} className={styles.heroDescription} maxChars={200} maxLines={5} />
          </div>

          <div className={styles.pillsRow}>
            <div className={styles.pill}>
              <span className="material-symbols-outlined" style={{ color: "var(--app-primary)", fontSize: "18px" }}>verified</span>
              <span>Haute Couture Master Guild</span>
            </div>
            <div className={styles.pill}>
              <span className="material-symbols-outlined" style={{ color: "var(--app-primary)", fontSize: "18px" }}>spa</span>
              <span>Bespoke Trichological Spa</span>
            </div>
            <div className={styles.pill}>
              <span className="material-symbols-outlined" style={{ color: "var(--app-primary)", fontSize: "18px" }}>distance</span>
              <EllipsisCell value={salon?.address || "Flagship Atelier • Bandra West"} maxChars={35} maxLines={1} style={{ textTransform: "capitalize" }} />
            </div>
            <div className={`${styles.pill} ${styles.pillActive}`}>
              <span className={styles.pillPulseDot} />
              <span>Open Now Until 9:30 PM (Salon Soirée)</span>
            </div>
          </div>
        </section>

        <section className={styles.gridTwelve}>
          <div className={styles.columnSix}>
            <article className={styles.panelCard}>
              <div className={styles.panelCardGlow} />
              <div className={styles.panelHeader}>
                <span className={styles.badgeCaps}>
                  Chapter 01 • Origin & Philosophy
                </span>
                <span className={styles.badgeMuted}>
                  Est. 2018
                </span>
              </div>
              <h2 className={styles.panelHeading}>
                Sculpting Silhouette Beyond Convention
              </h2>
              <div className={styles.paragraphGroup}>
                <p>
                  <EllipsisCell value={salonName} maxChars={100} maxLines={5} style={{ textTransform: "capitalize" }} />{" "} was conceived not simply as a salon, but as a sterile, acoustic refuge for intentional self-reinvention. Rooted in Parisian runway ateliers and Japanese meditative scalp baths, every service is an uncompromising ritual balancing precision geometric sectioning with high-potency bio-fermented botanical elixirs.
                </p>
                <p>
                  Our flagship sanctuary features six acoustically isolated suites crafted from blackened cedar, cast bronze, and Italian porphyry stone. Here, urban cacophony dissolves into bespoke aromatic misting, hand-forged Damascus shears, and millimeter-level balance calibrated to each patron’s craniometric posture.
                </p>
              </div>

              <div className={styles.quoteBox}>
                <div className={styles.avatarWrapper}>
                  <img
                    className={styles.avatarImg}
                    alt={masterStaffName}
                    src={masterStaffPhoto}
                  />
                </div>
                <div className={styles.quoteContent}>
                  <p className={styles.quoteText}>
                    “Hair is living sculpture. When we shear a single millimeter, we transform not just the silhouette, but the client’s quietest internal cadence.”
                  </p>
                  <div className={styles.staffDetailsRow}>
                    <div className={styles.staffInfoCol}>
                      <EllipsisCell value={masterStaffName} maxChars={20} className={styles.staffName} />
                      <EllipsisCell value={masterStaffRole} maxChars={20} className={styles.staffRole} />
                    </div>
                    <EllipsisCell value={`${masterStaffName[0]}. ${masterStaffName.split(" ")[1] || ""}`} maxChars={100} maxLines={5} className={styles.signatureText} />
                  </div>
                </div>
              </div>
            </article>

            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.badgeCaps}>Hospitality Standard</span>
                  <h3 className={styles.panelHeading} style={{ marginTop: "0.25rem", marginBottom: 0 }}>Bespoke Guest Privileges</h3>
                </div>
                <span className="material-symbols-outlined" style={{ color: "var(--app-muted)", fontSize: "28px" }}>room_service</span>
              </div>
              <div className={styles.privilegesGrid}>
                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>wifi</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>High-Speed Encrypted Wi-Fi</p>
                    <p className={styles.privilegeSubtitle}>Sub-gigabit private guest network</p>
                  </div>
                </div>

                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>ac_unit</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>Clean Air Filtration</p>
                    <p className={styles.privilegeSubtitle}>HEPA-14 medical climate chamber</p>
                  </div>
                </div>

                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_bar</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>Botanical Sensory Bar</p>
                    <p className={styles.privilegeSubtitle}>Vintage Blanc de Blancs & adaptogens</p>
                  </div>
                </div>

                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_parking</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>White-Glove Valet</p>
                    <p className={styles.privilegeSubtitle}>Private motor court drop-off</p>
                  </div>
                </div>

                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>meeting_room</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>Private Soundproof Suites</p>
                    <p className={styles.privilegeSubtitle}>Total visual & acoustic isolation</p>
                  </div>
                </div>

                <div className={styles.privilegeCard}>
                  <div className={styles.privilegeIconSquare}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>clean_hands</span>
                  </div>
                  <div>
                    <p className={styles.privilegeTitle}>Sterilized Instruments</p>
                    <p className={styles.privilegeSubtitle}>Medical autoclave grade sterilization</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.panelHeader} style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span className={styles.badgeCaps}>Atelier Operating Hours</span>
                  <h3 className={styles.panelHeading} style={{ marginTop: "0.25rem", marginBottom: 0 }}>Consultation & Service Cadence</h3>
                </div>
                <div className={styles.statusPillOpen}>
                  <span className={styles.openPulseDot} />
                  <span style={{ fontWeight: 700 }}>OPEN NOW</span>
                </div>
              </div>

              <div className={styles.hoursList}>
                {daysOfWeek.map((day) => {
                  const hours = formatHours(day);
                  const isFri = day === "friday";

                  if (isFri) {
                    return (
                      <div key={day} className={styles.hoursRowHighlight}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ color: "var(--app-primary)", fontWeight: 600, textTransform: "capitalize" }}>{day}</span>
                          <span className={styles.soireeBadge}>
                            Salon Soirée
                          </span>
                        </div>
                        <span style={{ color: "var(--app-text)", fontWeight: 600 }}>{hours}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={day} className={styles.hoursRow}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--app-text)", fontWeight: 500, textTransform: "capitalize" }}>{day}</span>
                        {day === "sunday" && (
                          <span style={{ color: "var(--app-muted)", fontSize: "0.75rem" }}>(Private Rejuvenation Rituals)</span>
                        )}
                      </div>
                      <span style={{ color: "var(--app-muted)", fontWeight: 500 }}>{hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.hoursFooterRow}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--app-primary)" }}>schedule</span>
                  VIP Out-of-Hours Appointments upon bespoke request
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className={styles.linkBtn}
                >
                  Request Slot
                </button>
              </div>
            </div>
          </div>

          <div className={styles.columnSix}>
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.badgeCaps}>Spatial Experience</span>
                  <h3 className={styles.panelHeading} style={{ marginTop: "0.25rem", marginBottom: 0 }}>Inside the Sanctuary</h3>
                </div>
                <span className={styles.badgeMuted} style={{ fontWeight: 700 }}>4 SPACES • FLAGSHIP</span>
              </div>

              <div className={styles.galleryGrid}>
                <div className={styles.galleryMain}>
                  <img
                    className={styles.galleryImg}
                    alt="Main Atelier Chamber"
                    src={galleryImages.main}
                  />
                  <div className={styles.galleryOverlay} />
                  <div className={styles.galleryCaptionBottom}>
                    <div className={styles.galleryBadgeCard}>
                      <span className={styles.bronzeBadge}>
                        Main Atelier Chamber
                      </span>
                      <h4 className={styles.galleryTitle}>
                        Master Styling Stations
                      </h4>
                    </div>
                  </div>
                </div>

                <div className={styles.gallerySideCol}>
                  <div className={styles.gallerySubCard}>
                    <img
                      className={styles.galleryImg}
                      alt="Ritual Hydro-Chamber"
                      src={galleryImages.sub1}
                    />
                    <div className={styles.galleryOverlay} />
                    <div className={styles.galleryCaptionBottom}>
                      <div className={styles.galleryBadgeCard}>
                        <span className={styles.bronzeBadge}>
                          Ritual Hydro-Chamber
                        </span>
                        <h5 className={styles.galleryTitle}>
                          Japanese Head Spa Suites
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className={styles.gallerySubCard}>
                    <img
                      className={styles.galleryImg}
                      alt="Acoustic Seclusion Suite"
                      src={galleryImages.sub2}
                    />
                    <div className={styles.galleryOverlay} />
                    <div className={styles.galleryCaptionBottom}>
                      <div className={styles.galleryBadgeCard}>
                        <span className={styles.bronzeBadge}>
                          Acoustic Seclusion
                        </span>
                        <h5 className={styles.galleryTitle}>
                          Private Suite • Vesper
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.panelCard}>
              <div className={styles.panelHeader} style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                <div className={styles.coordinatesHeaderGroup}>
                  <span className={styles.badgeCaps}>Flagship Coordinates</span>
                  <EllipsisCell value={salonName} className={styles.panelHeading} style={{ margin: 0, textTransform: "capitalize" }} maxChars={200} maxLines={5} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--app-muted)", fontFamily: "monospace" }}>19.0600° N, 72.8335° E</span>
                </div>
              </div>

              <div className={styles.mapCardBox}>
                <img
                  className={styles.mapImg}
                  alt="Location Map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOho6pHwyNQbmWQP4oQsVB8-70rtEtw-L7FYixpPJoHKFD8QfHKoPGnbWwFFnC-dmo8dSojjJzY-xJE2Be8ql7HoPvpTg0heuaZ24sSe6UY0tFZbU34-eblmDhzPRS3fRONTMPiip3n-9cwitQRumD6wEK5Vdp6P_0qvXwAk661B7aa22q112Zc6OGjzslwy_C0TP1CeyGJ4G_DrBg0gbGQ9-SzuhxIlREJSGsSr0GgsGFzg0BNbAQwahVVRpH7e3d8TcswOtQIxo"
                />
                <div className={styles.mapGradientOverlay} />

                <div className={styles.mapPinWrapper}>
                  <div className={styles.pinCircle}>
                    <span className={styles.pinPing} />
                    <span className={styles.pinOuter} />
                    <div className={styles.pinCenter}>
                      <span className="material-symbols-outlined" style={{ color: "#A88B64", fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                        content_cut
                      </span>
                    </div>
                  </div>
                  <div className={styles.pinCallout}>
                    <EllipsisCell value={salon?.name ?? "Salon Name"} style={{ color: "#A88B64", fontSize: "10px", letterSpacing: "0.05em", textAlign: "center", textTransform: "uppercase", fontWeight: 700 }} maxChars={20} />
                    <EllipsisCell value={salon?.address ?? "Salon Address"} style={{ fontSize: "11px", color: "var(--app-muted)", textAlign: "center", textTransform: "capitalize" }} maxChars={20} />
                  </div>
                </div>

                <div className={styles.mapBadgeTop}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#A88B64" }} />
                  <span>N 42° E</span>
                </div>

                <div className={styles.mapBadgeBottom}>
                  <span className="material-symbols-outlined" style={{ color: "#A88B64", fontSize: "16px" }}>local_taxi</span>
                  <span>Valet Court: Gate B</span>
                </div>
              </div>

              <div className={styles.addressList}>
                <div className={styles.addressItem}>
                  <span className={`material-symbols-outlined ${styles.addressIcon}`}>location_on</span>
                  <div className={styles.addressContent}>
                    <p className={styles.addressTitle}>Flagship Atelier • Heritage Suite III</p>
                    <EllipsisCell value={salon?.address || "Nargis Dutt Road, Bandra West, Mumbai, Maharashtra 400050"} className={styles.addressSubtitle} />
                  </div>
                </div>
                {salon?.phone && (
                  <div className={styles.addressItem}>
                    <span className={`material-symbols-outlined ${styles.addressIcon}`}>phone_in_talk</span>
                    <div className={styles.addressContent}>
                      <p className={styles.addressTitle}>Dedicated Atelier Concierge</p>
                      <p className={styles.addressContact}>{salon.phone} • concierge@crimsonandshear.com</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionsGrid}>
                <a
                  className={styles.btnPrimaryGps}
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>near_me</span>
                  <span>Get GPS Directions</span>
                </a>
                <a
                  className={styles.btnSecondaryValet}
                  href={`tel:${salon?.phone || "+912289204400"}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--app-primary)" }}>directions_car</span>
                  <span>Call Valet Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.etiquetteSection}>
          <div className={styles.etiquetteGlow} />
          <div className={styles.etiquetteHeader}>
            <span className={styles.badgeCaps}>The Crimson Etiquette</span>
            <h3 className={styles.panelHeading} style={{ marginBottom: 0 }}>
              Discretion, Sanctuary & Punctuality Guarantee
            </h3>
            <p className={styles.heroDescription}>
              To maintain the acoustic peace of our atelier, we observe strict protocols crafted to protect the tranquility of every patron in residency.
            </p>
          </div>

          <div className={styles.etiquetteGrid}>
            <div className={styles.etiquetteItem}>
              <div className={styles.etiquetteItemHeader}>
                <div className={styles.etiquetteIconBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>volume_off</span>
                </div>
                <h4 className={styles.etiquetteTitle}>Silent Suite Option</h4>
              </div>
              <p className={styles.etiquetteDesc}>
                Select “Acoustic Silence” upon reservation for an appointment conducted free of incidental conversation and personal device audio.
              </p>
            </div>

            <div className={styles.etiquetteItem}>
              <div className={styles.etiquetteItemHeader}>
                <div className={styles.etiquetteIconBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>timer</span>
                </div>
                <h4 className={styles.etiquetteTitle}>1:1 Dedicated Residency</h4>
              </div>
              <p className={styles.etiquetteDesc}>
                No overlapping appointments. Your Master Stylist is locked exclusively to your suite for the entirety of the blocked duration.
              </p>
            </div>

            <div className={styles.etiquetteItem}>
              <div className={styles.etiquetteItemHeader}>
                <div className={styles.etiquetteIconBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>event_repeat</span>
                </div>
                <h4 className={styles.etiquetteTitle}>24-Hour Courtesy Charter</h4>
              </div>
              <p className={styles.etiquetteDesc}>
                Modifications are respectfully received up to 24 hours prior to release reserved trichological preparations and artist schedules.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Box>
  );
}
