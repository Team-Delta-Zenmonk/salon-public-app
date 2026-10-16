"use client";
import React, { useState, useEffect } from "react";
import EllipsisCell from "@/components/ellipse-cell";
import type { Salon } from "@/common/salon.type";
import type { HomeHeroVariant } from "@/theme/layout.types";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import styles from "../home.module.css";

export interface HeroSectionProps {
  salon: Salon | null;
  galleryImages: string[];
  variant: HomeHeroVariant;
  onExploreServices: () => void;
  onMeetSpecialists: () => void;
}

function SplitBentoHero({
  salon,
  galleryImages,
  onExploreServices,
  onMeetSpecialists,
}: Omit<HeroSectionProps, "variant">) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            <span className={styles.badgeText}>PREMIUM HAIR &amp; SKIN CARE</span>
          </div>

          <h1 className={styles.heroHeading}>
            Expert Styling, <br /> Precision Haircuts &amp; Modern Beauty
          </h1>

          <div className={styles.heroAboutWrapper}>
            <EllipsisCell
              value={
                salon?.about ||
                "A relaxing, premium salon where expert stylists and skincare professionals provide quality beauty and grooming services tailored to you."
              }
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
            <span className={styles.statusText}>OPEN FOR APPOINTMENTS TODAY</span>
          </div>

          <div className={styles.heroActions}>
            <a href="#services-menu" onClick={onExploreServices} className={styles.primaryCta}>
              <span>EXPLORE SERVICES</span>
              <ArrowDownwardIcon className={styles.btnIcon} />
            </a>
            <button
              type="button"
              onClick={onMeetSpecialists}
              className={styles.secondaryBtn}
            >
              <span>MEET OUR SPECIALISTS</span>
              <PersonIcon className={styles.btnIcon} />
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
                  className={`${styles.bentoImage} ${isVisible ? styles.bentoImageVisible : ""}`}
                />
              );
            })}
            <div className={styles.bentoOverlay} />
            <div className={styles.bentoContent}>
              <span className={styles.bentoSub}>PREMIUM SALON</span>
              <h2 className={styles.bentoTitle}>Precision Styling &amp; Healthy Hair Care</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitecturalArchHero({
  salon,
  galleryImages,
  onExploreServices,
  onMeetSpecialists,
}: Omit<HeroSectionProps, "variant">) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <section className={styles.archHeroSection}>
      <div className={styles.archHeroGrid}>
        <div className={styles.archHeroLeft}>
          <div className={styles.archMonogramBadge}>
            <span className={styles.archMonogramSymbol}>✦</span>
            <span className={styles.archMonogramText}>
              PREMIUM SALON &amp; SPA
            </span>
          </div>

          <h1 className={styles.archHeading}>
            Look Your Best, <br className={styles.archHeadingBreak} />{" "}
            <span className={styles.archHeadingAccent}>
              Feel Your Best.
            </span>
          </h1>

          <div className={styles.archAboutWrapper}>
            <EllipsisCell
              value={
                salon?.about ||
                "Welcome to a warm and relaxing salon experience. Our expert hair stylists and beauty specialists deliver personalized haircuts, color, and treatments crafted for you."
              }
              className={styles.heroAboutText}
              maxLines={4}
              maxChars={220}
            />
          </div>

          <div className={styles.archActionsWrapper}>
            <a
              href="#services-menu"
              onClick={onExploreServices}
              className={styles.archPrimaryCta}
            >
              <span>BOOK APPOINTMENT</span>
              <ArrowDownwardIcon className={styles.btnIcon} />
            </a>
            <button
              type="button"
              onClick={onMeetSpecialists}
              className={styles.archSecondaryBtn}
            >
              <span>MEET OUR TEAM</span>
              <WorkspacePremiumOutlinedIcon className={styles.btnIcon} />
            </button>
          </div>
        </div>

        <div className={styles.archWindowContainer}>
          <div className={styles.archAmbientGlow} />

          <div className={styles.archWindowFrame}>
            {galleryImages.map((imgUrl: string, idx: number) => {
              const isVisible = idx === carouselIndex % galleryImages.length;
              return (
                <img
                  key={`arch-${imgUrl}-${idx}`}
                  src={imgUrl}
                  alt={salon?.name || "Salon Space"}
                  className={`${styles.archWindowImage} ${isVisible ? styles.archWindowImageVisible : ""}`}
                />
              );
            })}
            <div className={styles.archWindowOverlay} />
            <div className={styles.archWindowCaption}>
              <div className={styles.archCaptionTitle}>
                WELCOME TO OUR SALON
              </div>
              <div className={styles.archCaptionSub}>
                BOOK ONLINE ANYTIME
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FullBleedShowcaseHero({
  salon,
  galleryImages,
  onExploreServices,
  onMeetSpecialists,
}: Omit<HeroSectionProps, "variant">) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const activeImg = galleryImages[carouselIndex % galleryImages.length];

  return (
    <section className={styles.gothicHeroCard}>
      <div className={styles.gothicHeroGrid}>
        <div className={styles.gothicHeroLeft}>
          <div className={styles.gothicHeroBadge}>
            <span className={styles.gothicBadgeDot} />
            <span className={styles.gothicBadgeText}>
              LUXURY SALON &amp; SPA
            </span>
          </div>

          <h1 className={styles.gothicHeroHeading}>
            Modern Styling &amp; Personal Care
          </h1>

          <div className={styles.heroAboutWrapper}>
            <EllipsisCell
              value={
                salon?.about ||
                "A comfortable, friendly salon offering professional haircuts, coloring, and refreshing skin care treatments designed to help you look and feel great."
              }
              className={styles.gothicAboutText}
              maxLines={4}
              maxChars={220}
            />
          </div>

          <div className={styles.gothicHeroActions}>
            <a
              href="#services-menu"
              onClick={onExploreServices}
              className={styles.gothicPrimaryCta}
            >
              <span>BOOK APPOINTMENT</span>
              <ArrowDownwardIcon className={styles.btnIcon} />
            </a>
            <button
              type="button"
              onClick={onMeetSpecialists}
              className={styles.gothicSecondaryBtn}
            >
              <span>MEET OUR TEAM</span>
              <SpaOutlinedIcon className={styles.gothicIconGold} />
            </button>
          </div>
        </div>

        <div className={styles.gothicHeroRight}>
          {galleryImages.map((imgUrl: string, idx: number) => {
            const isVisible = idx === carouselIndex % galleryImages.length;
            return (
              <img
                key={`gothic-${imgUrl}-${idx}`}
                src={imgUrl}
                alt={salon?.name || "Salon Space"}
                className={`${styles.gothicHeroImage} ${isVisible ? styles.gothicHeroImageVisible : ""}`}
              />
            );
          })}

          <div className={styles.gothicFloatingBadge}>
            <div className={styles.gothicBadgeIconCircle}>
              ✦
            </div>
            <div>
              <div className={styles.gothicBadgeHeading}>
                Top Rated Salon
              </div>
              <div className={styles.gothicBadgeSubtext}>
                Professional &amp; Friendly Care
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HERO_VARIANTS: Record<HomeHeroVariant, React.ComponentType<Omit<HeroSectionProps, "variant">>> = {
  "split-bento": SplitBentoHero,
  "centered-minimal": ArchitecturalArchHero,
  "full-bleed-showcase": FullBleedShowcaseHero,
};

export default function HeroSection({ variant, ...props }: HeroSectionProps) {
  const Component = HERO_VARIANTS[variant] ?? HERO_VARIANTS["split-bento"];
  return <Component {...props} />;
}
