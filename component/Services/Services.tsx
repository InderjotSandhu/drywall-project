'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Services.module.css';

interface ServiceFeature {
  title: string;
  desc: string;
}

interface Service {
  id: string;
  title: string;
  desc: string;
  detail: string;
  tags: string[];
  features: ServiceFeature[];
  icon: React.ReactNode;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  installation: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  framing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16M4 12h16M4 20h16M8 4v16M16 4v16"/>
    </svg>
  ),
  acoustic: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  fire: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"/>
      <path d="M12 12c0 3-2 4-2 6a2 2 0 0 0 4 0c0-2-2-3-2-6z"/>
    </svg>
  ),
  finishing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  taping: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
};

function ServiceCard({
  service,
  index,
  isActive,
  onClick,
}: {
  service: Service;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      className={`${styles.card} ${visible ? styles.cardVisible : ''} ${isActive ? styles.cardActive : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
      onClick={onClick}
      aria-expanded={isActive}
    >
      <div className={styles.iconWrap}>{service.icon}</div>
      <h3 className={styles.cardTitle}>{service.title}</h3>
      <p className={styles.cardDesc}>{service.desc}</p>
      <div className={styles.cardFooter}>
        <div className={styles.cardTags}>
          {service.tags.map(t => (
            <span key={t} className={styles.cardTag}>{t}</span>
          ))}
        </div>
        <span className={styles.cardChevron}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
    </button>
  );
}

function DetailPanel({ service }: { service: Service }) {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={styles.panel}>
      <div className={styles.panelLeft}>
        <div>
          <h3 className={styles.panelHeading}>{service.title}</h3>
          <span className={styles.panelAccentLine} aria-hidden="true" />
        </div>
        <p className={styles.panelBody}>{service.detail}</p>
        <button
          className={styles.panelCta}
          onClick={() => scrollTo('#contact')}
        >
          Get a Quote
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div className={styles.panelRight}>
        {service.features.map(f => (
          <div key={f.title} className={styles.panelFeature}>
            <span className={styles.panelFeatureIcon}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <div className={styles.panelFeatureText}>
              <span className={styles.panelFeatureTitle}>{f.title}</span>
              <span className={styles.panelFeatureDesc}>{f.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [headerVisible,  setHeaderVisible]  = useState(false);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const withIcons = list.map((s: any) => ({ ...s, icon: SERVICE_ICONS[s.id] || null }));
        setServices(withIcons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const pairs: [React.RefObject<HTMLDivElement | null>, (v: boolean) => void][] = [
      [headerRef,  setHeaderVisible],
      [dividerRef, setDividerVisible],
    ];
    const observers = pairs.map(([ref, setter]) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const toggle = (id: string) =>
    setActiveId(prev => (prev === id ? null : id));

  const COLS = 3;
  const activeIndex = services.findIndex(s => s.id === activeId);

  const rows: number[][] = [];
  for (let i = 0; i < services.length; i += COLS) {
    rows.push(services.slice(i, i + COLS).map((_, j) => i + j));
  }
  const activeRowIndex = activeIndex === -1
    ? -1
    : rows.findIndex(row => row.includes(activeIndex));

  return (
    <section className={styles.services} id="services">
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className={`${styles.header} ${headerVisible ? styles.headerVisible : ''}`}
        >
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            What We Do
          </p>
          <h2 className={styles.heading}>
            Our <em className={styles.headingAccent}>Services</em>
          </h2>
          <p className={styles.sub}>
            From steel-stud framing to Level 5 skim-coat finishing — everything
            under one roof, delivered by a team that takes pride in every joint.
          </p>
        </div>

        {/* ── Divider ── */}
        <div
          ref={dividerRef}
          className={`${styles.divider} ${dividerVisible ? styles.dividerVisible : ''}`}
          aria-hidden="true"
        />

        {/* ── Cards grid with inline panel ── */}
        {!loading && services.length > 0 && (
          <div className={styles.grid}>
            {rows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map(cardIdx => {
                  const svc = services[cardIdx];
                  if (!svc) return null;
                  return (
                    <ServiceCard
                      key={svc.id}
                      service={svc}
                      index={cardIdx}
                      isActive={activeId === svc.id}
                      onClick={() => toggle(svc.id)}
                    />
                  );
                })}
                {activeId && rowIdx === activeRowIndex && (
                  <DetailPanel
                    key={`panel-${activeId}`}
                    service={services[activeIndex]}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
