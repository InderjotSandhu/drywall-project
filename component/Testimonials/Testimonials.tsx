'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: number;
  name: string;
  quote: string;
}

function QuoteIcon() {
  return (
    <svg className={styles.quoteIcon} width="24" height="24" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z"/>
    </svg>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className={styles.card}>
      <QuoteIcon />
      <p className={styles.cardQuote}>{item.quote}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cardAvatar}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </span>
        <span className={styles.cardName}>{item.name}</span>
      </div>
    </div>
  );
}

function MarqueeRow({ items }: { items: Testimonial[] }) {
  const doubled = [...items, ...items];

  return (
    <div className={styles.marqueeOuter}>
      <div className={styles.marqueeTrack}>
        {doubled.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef            = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => { setTestimonials(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.testimonials} ${visible ? styles.visible : ''}`}
      id="testimonials"
    >
      {/* Ambient glow */}
      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      {/* ── Section header ── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Testimonials
        </p>
        <h2 className={styles.heading}>
          What Our <em className={styles.headingAccent}>Clients</em> Say
        </h2>
        <p className={styles.sub}>
          Don't take our word for it — here's what the people we've worked
          with have to say about the New Canadian Drywall experience.
        </p>
      </div>

      {/* ── Marquee rows ── */}
      {!loading && testimonials.length > 0 && (
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeWrap}>
            <MarqueeRow items={testimonials} />
          </div>
          {/* Edge fade masks */}
          <div className={styles.fadeLeft}  aria-hidden="true" />
          <div className={styles.fadeRight} aria-hidden="true" />
        </div>
      )}

    </section>
  );
}
