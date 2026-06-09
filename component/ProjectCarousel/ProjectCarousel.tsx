'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import styles from './ProjectCarousel.module.css';
import type { Project } from './ProjectCarousel.types';

const TILT_X       = -7;
const BASE_COUNT   = 6;
const BASE_Z       = 400;
const BASE_PERSP   = 1000;
const BASE_SLIDER_W = 280;
const BASE_SLIDER_H = 170;

function getCarouselParams(total: number) {
  if (total <= BASE_COUNT) return { translateZ: BASE_Z, perspective: BASE_PERSP, sliderW: BASE_SLIDER_W, sliderH: BASE_SLIDER_H };
  const translateZ = Math.round(BASE_Z * Math.sin(Math.PI / BASE_COUNT) / Math.sin(Math.PI / total));
  const perspective = Math.round(BASE_PERSP * translateZ / BASE_Z);
  return { translateZ, perspective, sliderW: BASE_SLIDER_W, sliderH: BASE_SLIDER_H };
}

const STATS = [
  { count: 15,  suffix: '+', label: 'Years Experience'   },
  { count: 500, suffix: '+', label: 'Projects Completed' },
  { count: 98,  suffix: '%', label: 'Client Satisfaction'},
  { count: 12,  suffix: '',  label: 'Trade Awards Won'   },
];

function mod(n: number, m: number) { return ((n % m) + m) % m; }

function angularDelta(position: number, total: number, rotation: number): number {
  const step      = 360 / total;
  const cardAngle = (position - 1) * step;
  let   w         = mod(cardAngle + rotation, 360);
  if (w > 180) w -= 360;
  return Math.abs(w);
}

/* ════════════════════════════════════
   Slideshow modal — single project
════════════════════════════════════ */
function SlideshowModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const allMedia = [
    { type: 'image' as const, src: project.image },
    ...(project.images ?? []).map(src => ({ type: 'image' as const, src })),
    ...(project.videos ?? []).map(src => ({ type: 'video' as const, src })),
  ];
  const [idx, setIdx] = useState(0);
  const videoKeyRef = useRef(0);

  const prev = useCallback(() => setIdx(i => (i - 1 + allMedia.length) % allMedia.length), [allMedia.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % allMedia.length), [allMedia.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  const current = allMedia[idx];

  return (
    <div className={`${styles.modalOverlay} ${styles.modalOverlayActive}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`${styles.modalBox} ${styles.slideshowBox}`}>

        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* ── Media slideshow ── */}
        <div className={styles.slideshowImageWrap}>
          {current.type === 'video' ? (
            <video
              key={`${idx}-${videoKeyRef.current}`}
              src={current.src}
              controls
              autoPlay
              muted
              playsInline
              className={styles.slideshowImage}
            />
          ) : (
            <img key={idx} src={current.src} alt={`${project.title} — ${idx + 1}`} className={styles.slideshowImage} />
          )}

          {allMedia.length > 1 && (
            <>
              <button className={`${styles.slideArrow} ${styles.slideArrowLeft}`} onClick={prev} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className={`${styles.slideArrow} ${styles.slideArrowRight}`} onClick={next} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <div className={styles.slideDots}>
                {allMedia.map((media, i) => (
                  <button key={i} className={`${styles.slideDot} ${i === idx ? styles.slideDotActive : ''}`}
                    onClick={() => { if (media.type === 'video') videoKeyRef.current++; setIdx(i); }} aria-label={`Media ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Project info ── */}
        <div className={styles.slideshowInfo}>
          <span className={styles.slideshowCategory}>{project.category}</span>
          <h2 className={styles.slideshowTitle}>{project.title}</h2>
          {project.location && <p className={styles.slideshowLocation}>{project.location}</p>}
          <p className={styles.slideshowDesc}>{project.description}</p>

          {project.stats && project.stats.length > 0 && (
            <div className={styles.slideshowStats}>
              {project.stats.map(s => (
                <div key={s.label} className={styles.slideshowStat}>
                  <span className={styles.slideshowStatVal}>{s.value}</span>
                  <span className={styles.slideshowStatLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <button className={styles.slideshowCta}
            onClick={() => { onClose(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Start a Similar Project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoGridModal({ projects, onSelect, onClose }: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onClose:  () => void;
}) {
  const cols = Math.min(4, Math.ceil(Math.sqrt(projects.length)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={`${styles.modalOverlay} ${styles.modalOverlayActive}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`${styles.modalBox} ${styles.gridModalBox}`}>

        <div className={styles.modalHeader}>
          <span className={styles.allModalTitle}>
            All Projects
            <span className={styles.allModalCount}>{projects.length}</span>
          </span>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalScroll}>
          <div className={styles.photoGrid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {projects.map(p => (
              <button key={p.id} className={styles.photoCard} onClick={() => onSelect(p)} aria-label={`Open ${p.title}`}>
                <img src={p.image} alt={p.title} className={styles.photoCardImg} />
                <div className={styles.photoCardOverlay}>
                  <span className={styles.photoCardCategory}>{p.category}</span>
                  <span className={styles.photoCardTitle}>{p.title}</span>
                  {p.location && <span className={styles.photoCardLocation}>{p.location}</span>}
                  <span className={styles.photoCardCta}>
                    View Project
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   Main carousel component
════════════════════════════════════ */
export default function ProjectCarousel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardStates, setCardStates] = useState<
    { front: boolean; visible: boolean; zIndex: number }[]
  >([]);
  const [displayNums,  setDisplayNums]  = useState(STATS.map(() => 0));
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalSource,  setModalSource]  = useState<'carousel' | 'grid'>('carousel');
  const [showAllModal, setShowAllModal] = useState(false);
  const [frontIndex,   setFrontIndex]   = useState(0);
  const [isGrabbing,   setIsGrabbing]   = useState(false);

  const sliderRef   = useRef<HTMLDivElement>(null);
  const stripRef    = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const dragRef     = useRef({ active: false, startX: 0, startRot: 0 });
  const countedRef  = useRef(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = projects.length;
  const STEP  = 360 / total;

  useEffect(() => {
    if (total > 0) {
      const visibleCount = Math.min(total, Math.max(2, Math.ceil(total / 3)));
      setCardStates(projects.map((_, i) => ({
        front: i === 0, visible: i > 0 && i <= visibleCount, zIndex: total - i,
      })));
    }
  }, [projects, total]);

  const applyRotation = useCallback((deg: number) => {
    rotationRef.current = deg;
    if (sliderRef.current) {
      const p = getCarouselParams(total);
      sliderRef.current.style.transform = `perspective(${p.perspective}px) rotateX(${TILT_X}deg) rotateY(${deg}deg)`;
    }
    const ranked = projects.map((_, i) => ({ index: i, delta: angularDelta(i + 1, total, deg) }))
      .sort((a, b) => a.delta - b.delta);
    setFrontIndex(ranked[0].index);
    const visibleCount = Math.min(total, Math.max(2, Math.ceil(total / 3)));
    setCardStates(projects.map((_, i) => {
      const rank = ranked.findIndex(r => r.index === i);
      return { front: rank === 0, visible: rank > 0 && rank <= visibleCount, zIndex: total - rank };
    }));
  }, [projects, total]);

  const rotateNext = useCallback(() =>
    applyRotation(Math.round(rotationRef.current / STEP) * STEP - STEP), [applyRotation, STEP]);
  const rotatePrev = useCallback(() =>
    applyRotation(Math.round(rotationRef.current / STEP) * STEP + STEP), [applyRotation, STEP]);

  /* ── Animated counters ── */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || loading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || countedRef.current) return;
      countedRef.current = true;
      STATS.forEach(({ count }, idx) => {
        const steps = 50; let step = 0;
        const timer = setInterval(() => {
          step++;
          const eased = 1 - Math.pow(1 - step / steps, 3);
          setDisplayNums(prev => {
            const next = [...prev]; next[idx] = Math.round(eased * count); return next;
          });
          if (step >= steps) clearInterval(timer);
        }, 1400 / steps);
      });
    }, { threshold: 0.4 });
    observer.observe(strip);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => { if (total > 0) applyRotation(0); }, [applyRotation, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalProject || showAllModal) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') rotateNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   rotatePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalProject, showAllModal, rotateNext, rotatePrev]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = { active: true, startX: e.clientX, startRot: rotationRef.current };
    setIsGrabbing(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    applyRotation(dragRef.current.startRot + (e.clientX - dragRef.current.startX) * 0.4);
  }, [applyRotation]);
  const onPointerUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsGrabbing(false);
    applyRotation(Math.round(rotationRef.current / STEP) * STEP);
  }, [applyRotation, STEP]);

  const anyModal = !!modalProject || showAllModal;
  useEffect(() => {
    document.body.style.overflow = anyModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyModal]);

  if (loading || projects.length === 0) {
    return (
      <section id="projects" className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}><span className={styles.sectionDot} />Our Work</p>
          <h2 className={styles.sectionHeading}>Featured <em className={styles.sectionAccent}>Projects</em></h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className={styles.spinner} />
        </div>
      </section>
    );
  }

  const cp = getCarouselParams(total);

  return (
    <>
      <section id="projects" className={styles.projectsSection}>

        {/* ── Section header ── */}
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>
            <span className={styles.sectionDot} />
            Our Work
          </p>
          <h2 className={styles.sectionHeading}>
            Featured <em className={styles.sectionAccent}>Projects</em>
          </h2>
          <p className={styles.sectionSub}>
            Drag or use the arrows to explore our work — click any project for full details.
          </p>
        </div>

        <div className={styles.dividerWrap}><div className={styles.divider} aria-hidden="true" /></div>

        <div className={styles.scene}>
          <div className={styles.carouselWrap}>

            {/* Stat strip */}
            <div ref={stripRef} className={styles.statStrip}>
              {STATS.map(({ suffix, label }, idx) => (
                <div key={label} className={styles.statCell}>
                  <span className={styles.statNum}>
                    {displayNums[idx]}<span className={styles.statSuffix}>{suffix}</span>
                  </span>
                  <span className={styles.statLbl}>{label}</span>
                </div>
              ))}
              <div className={styles.statFooterRow}>
                <div className={styles.avatarRow}>
                  {['#c9973a','#b8843a','#d4a84b','#a0712e'].map((bg, i) => (
                    <span key={i} className={styles.avatar} style={{ background: bg, zIndex: 4 - i }} />
                  ))}
                </div>
                <p className={styles.footerText}>
                  <strong>200+ happy clients</strong> across the GTA
                </p>
              </div>
            </div>

            {/* 3D ring */}
            <div ref={sliderRef}
              className={`${styles.slider} ${isGrabbing ? styles.sliderGrabbing : ''}`}
              style={{ width: cp.sliderW, height: cp.sliderH }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove}
              onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
              {projects.map((project, i) => (
                <div key={project.id}
                  className={[styles.item, cardStates[i]?.front ? styles.itemFront : '', cardStates[i]?.visible ? styles.itemVisible : ''].join(' ')}
                  style={{ zIndex: cardStates[i]?.zIndex ?? 0, transform: `rotateY(${i * (360 / total)}deg) translateZ(${cp.translateZ}px)` }}>
                  <img src={project.image} alt={project.imageAlt ?? project.title} draggable={false} />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button className={styles.ctrlBtn} onClick={rotatePrev} aria-label="Previous">&#8249;</button>
              <button className={styles.detailsBtn} onClick={() => { setModalSource('carousel'); setModalProject(projects[frontIndex]); }}>
                <span>View Details</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className={styles.ctrlBtn} onClick={rotateNext} aria-label="Next">&#8250;</button>
            </div>

            {/* See All */}
            <button className={styles.seeAllBtn} onClick={() => setShowAllModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              See All Projects
            </button>

          </div>
        </div>
      </section>

      {modalProject && (
        <SlideshowModal
          project={modalProject}
          onClose={() => {
            setModalProject(null);
            if (modalSource === 'grid') setShowAllModal(true);
          }}
        />
      )}

      {showAllModal && (
        <PhotoGridModal
          projects={projects}
          onSelect={(p) => { setShowAllModal(false); setModalSource('grid'); setModalProject(p); }}
          onClose={() => setShowAllModal(false)}
        />
      )}
    </>
  );
}
