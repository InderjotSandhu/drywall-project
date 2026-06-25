'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

interface AboutRowData {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  highlight: string | null;
  cta: { label: string; href: string } | null;
}

export default function AboutRow({ row, index }: { row: AboutRowData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div
      ref={ref}
      className={`${styles.row} ${visible ? styles.rowVisible : ''}`}
      style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
    >
      <div className={styles.rowLeft}>
        <span className={styles.rowEyebrow}>{row.eyebrow}</span>
        <span className={styles.rowAccentLine} aria-hidden="true" />
      </div>

      <div className={styles.rowDivider} aria-hidden="true" />

      <div className={styles.rowRight}>
        <h2 className={styles.rowHeading}>{row.heading}</h2>
        <p className={styles.rowBody}>{row.body}</p>

        {row.highlight && (
          <p className={styles.rowHighlight}>
            <span className={styles.rowHighlightBar} aria-hidden="true" />
            {row.highlight}
          </p>
        )}

        {row.cta && (
          <button
            className={styles.rowCta}
            onClick={() => scrollTo(row.cta!.href)}
          >
            {row.cta.label}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
