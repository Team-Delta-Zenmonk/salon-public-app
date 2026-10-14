"use client";
import React from "react";
import styles from "../home.module.css";

export default function PillarsSection() {
  return (
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
  );
}
