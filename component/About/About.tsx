import AboutRow from './AboutRow';
import styles from './About.module.css';

const ROWS = [
  {
    id:      'who',
    eyebrow: 'Who We Are',
    heading: 'A Family Business Built on Craftsmanship',
    body:    'New Canadian Drywall is a company built on a passion for quality craftsmanship, growing into one of the GTA\'s most trusted drywall contractors. From single-family renovations to large-scale commercial fit-outs spanning dozens of floors, we bring the same commitment to quality on every job — no matter the size.',
    highlight: 'Recognised as a top drywall subcontractor in Ontario since 2023.',
    cta:     { label: 'Our Story', href: '#about' },
  },
  {
    id:      'what',
    eyebrow: 'What We Do',
    heading: 'End-to-End Drywall Solutions',
    body:    'We provide a complete range of drywall services — installation, steel-stud framing, acoustic and fire-rated partitions, skim-coat finishing, taping, sanding, and specialty feature walls. Residential or commercial, ground-up or renovation, we handle it all under one roof.',
    highlight: null,
    cta:     { label: 'View Services', href: '#services' },
  },
  {
    id:      'why',
    eyebrow: 'Why Choose Us',
    heading: 'Quality Workmanship. Every Time.',
    body:    'Our dedication to excellence drives everything we do. When you partner with New Canadian Drywall you can expect precise workmanship, transparent communication, and a team that treats your project as if it were their own — consistently delivering on time and on budget.',
    highlight: null,
    cta:     null,
  },
  {
    id:      'team',
    eyebrow: 'Join Our Team',
    heading: 'We\'re Always Looking for Skilled Tradespeople',
    body:    'Our crew is growing and we\'re recruiting experienced drywall installers, tapers, and labourers across the GTA. We value professionalism, reliability, and people who take pride in their craft. Come build something great with us.',
    highlight: null,
    cta:     { label: 'I Want to Work Here', href: '#contact' },
  },
];

export default function About() {
  return (
    <section className={styles.about} id="about">

      {/* ── Section header ── */}
      <div className={styles.header}>
        <p className={styles.headerEyebrow}>
          <span className={styles.headerDot} />
          About New Canadian Drywall
        </p>
        <h2 className={styles.headerHeading}>
          More Than Just <em className={styles.headerAccent}>Drywall</em>
        </h2>
        <p className={styles.headerSub}>
          Built from the ground up in 2023. Every project a promise —
          built right, finished to perfection.
        </p>
      </div>

      {/* ── Divider ── */}
      <div className={styles.dividerWrap}><div className={styles.topDivider} aria-hidden="true" /></div>

      {/* ── Rows ── */}
      <div className={styles.rows}>
        {ROWS.map((row, i) => (
          <AboutRow key={row.id} row={row} index={i} />
        ))}
      </div>

    </section>
  );
}
