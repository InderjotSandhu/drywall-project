'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Collaborations.module.css';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string | null;
}

export default function Collaborations() {
  const sectionRef            = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collaborations')
      .then(res => res.json())
      .then(data => { setPartners(data?.data ?? (Array.isArray(data) ? data : [])); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.collaborations} ${visible ? styles.visible : ''}`}
      id="collaborations"
    >
      {/* Ambient glow */}
      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Trusted Partners
          </p>
          <h2 className={styles.heading}>
            Companies We've <em className={styles.headingAccent}>Worked With</em>
          </h2>
          <p className={styles.sub}>
            We're proud to partner with industry-leading restoration and
            construction companies across the Greater Toronto Area and beyond.
          </p>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Partner cards ── */}
        {!loading && partners.length > 0 && (
          <div className={styles.grid}>
            {partners.map((partner, i) => (
              <div
                key={partner.id}
                className={styles.card}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Top amber bar */}
                <div className={styles.cardBar} aria-hidden="true" />

                {/* Logo */}
                <div className={styles.logoWrap}>
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    className={styles.logo}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 33vw, 280px"
                  />
                </div>

                {/* Name + description */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{partner.name}</h3>
                  <p className={styles.cardDesc}>{partner.description || ''}</p>
                </div>

                {/* Partner badge */}
                <div className={styles.cardFooter}>
                  <span className={styles.badge}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                      stroke="#c9973a" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom trust line ── */}
        <div className={styles.trustBar}>
          <div className={styles.trustDivider} aria-hidden="true" />
          <p className={styles.trustText}>
            Serving the GTA's top restoration &amp; construction firms since 2023
          </p>
          <div className={styles.trustDivider} aria-hidden="true" />
        </div>

      </div>
    </section>
  );
}
