'use client';

import ReviewForm from '@/component/ReviewForm';
import styles from './Footer.module.css';

const NAV_LINKS = [
  { label: 'Services',     href: '#services'     },
  { label: 'Projects',     href: '#projects'     },
  { label: 'About',        href: '#about'        },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact'      },
];

const SERVICES = [
  'Drywall Installation',
  'Steel-Stud Framing',
  'Acoustic Partitions',
  'Fire-Rated Systems',
  'Skim-Coat Finishing',
  'Taping & Sanding',
];

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const scrollTo = (href: string) => {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>

      {/* ── Top divider ── */}
      <div className={styles.topDivider} aria-hidden="true" />

      {/* ── Main grid ── */}
      <div className={styles.inner}>

        {/* Col 1 — Brand */}
        <div className={styles.brand}>
          <button
            className={styles.logo}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <span className={styles.logoMark}>NC</span>
            <span className={styles.logoText}>
              New Canadian <span className={styles.logoAccent}>Drywall</span>
            </span>
          </button>

          <p className={styles.tagline}>
            Premium drywall installation, repair &amp; finishing for residential
            and commercial projects across the GTA.
          </p>

          {/* Contact details */}
          <div className={styles.contactList}>
            <a href="tel:+14164522181" className={styles.contactItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
              </svg>
              +1 (416) 452-2181
            </a>
            <a href="mailto:info@newcanadiandrywall.ca" className={styles.contactItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@newcanadiandrywall.ca
            </a>
            <span className={styles.contactItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Greater Toronto Area, Ontario
            </span>
          </div>

          {/* Socials */}
          <div className={styles.socials}>
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                className={styles.socialIcon}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div className={styles.col}>
          <h3 className={styles.colHeading}>Navigation</h3>
          <ul className={styles.colList}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={styles.colLink}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                >
                  <span className={styles.colLinkDot} aria-hidden="true" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Services */}
        <div className={styles.col}>
          <h3 className={styles.colHeading}>Services</h3>
          <ul className={styles.colList}>
            {SERVICES.map(s => (
              <li key={s}>
                <a
                  href="#services"
                  className={styles.colLink}
                  onClick={(e) => { e.preventDefault(); scrollTo('#services'); }}
                >
                  <span className={styles.colLinkDot} aria-hidden="true" />
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — CTA card */}
        <div className={styles.col}>
          <h3 className={styles.colHeading}>Get Started</h3>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCardGlow} aria-hidden="true" />
            <p className={styles.ctaCardText}>
              Ready to start your next project? Get a free no-obligation quote today.
            </p>
            <a
              href="#contact"
              className={styles.ctaBtn}
              onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
            >
              Get a Free Quote
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <div className={styles.ctaBadges}>
              {['Licensed', 'Insured', 'Free Estimates'].map(b => (
                <span key={b} className={styles.ctaBadge}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="#c9973a" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Mobile-only review form ── */}
      <div className={styles.mobileReview}>
        <div className={styles.mobileReviewInner}>
          <h3 className={styles.mobileReviewHeading}>
            Share Your <em>Experience</em>
          </h3>
          <p className={styles.mobileReviewSub}>
            We'd love to hear about your experience working with us.
          </p>
          <ReviewForm />
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {year} New Canadian Drywall. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="/privacy" className={styles.bottomLink}>Privacy Policy</a>
            <a href="/terms" className={styles.bottomLink}>Terms of Service</a>
          </div>
          <button
            className={styles.backToTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            Back to top
          </button>
        </div>
      </div>

    </footer>
  );
}
