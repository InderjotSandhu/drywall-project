'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted,  setMuted]  = useState(true);
  const [loaded, setLoaded] = useState(false);

  /* Fade video in once it can play */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 3) { setLoaded(true); return; }
    const onReady = () => setLoaded(true);
    v.addEventListener('canplay', onReady);
    return () => v.removeEventListener('canplay', onReady);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={styles.hero} id="home">

      {/* ── Background video ── */}
      <video
        ref={videoRef}
        className={`${styles.videoBg} ${loaded ? styles.videoBgLoaded : ''}`}
        src="/videos/intro.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/videos/intro-poster.jpg"
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
      />

      {/* ── Layered overlays ── */}
      <div className={styles.overlayBase}     aria-hidden="true" />
      <div className={styles.overlayVignette} aria-hidden="true" />
      <div className={styles.overlayGradient} aria-hidden="true" />
      <div className={styles.overlayGrid}     aria-hidden="true" />

      {/* ── Main content — centred column ── */}
      <div className={styles.content}>

        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Professional Drywall Services · Since 2023
        </p>

        <h1 className={styles.heading}>
          <span className={styles.line1}>Professional</span>
          <span className={styles.line2}>
            <em className={styles.accent}>Drywall</em>&nbsp;Services
          </span>
          <span className={styles.line3}>Built to Last. Finished to Impress.</span>
        </h1>

        <p className={styles.sub}>
          Premium drywall installation, repair &amp; finishing for residential
          and commercial projects — on time, every time.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => scrollTo('#contact')}>
            Get a Free Quote
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className={styles.btnGhost} onClick={() => scrollTo('#projects')}>
            View Our Work
          </button>
        </div>

        <div className={styles.badges}>
          {['Licensed & Insured', 'Free Estimates', '5-Year Warranty'].map(b => (
            <span key={b} className={styles.badge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="#c9973a" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {b}
            </span>
          ))}
        </div>

      </div>

      {/* ── Waveform mute button (bottom-right) ── */}
      <button
        className={`${styles.waveBtn} ${muted ? styles.waveBtnMuted : ''}`}
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
      >
        <span className={styles.waveBars}>
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              className={`${styles.waveBar} ${styles[`waveBar${i}` as keyof typeof styles]}`}
            />
          ))}
        </span>
        <span className={styles.waveMuteLabel}>
          {muted ? 'UNMUTE' : 'MUTE'}
        </span>
      </button>

      {/* ── Scroll nudge (bottom-centre) — scrolls to first section below hero ── */}
      <button
        className={styles.scrollNudge}
        onClick={() => scrollTo('#about')}
        aria-label="Scroll to About section"
      >
        <span className={styles.scrollLine} />
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

    </section>
  );
}
