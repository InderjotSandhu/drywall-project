import Hero           from '../../component/Hero';
import ProjectCarousel from '../../component/ProjectCarousel';
import About          from '../../component/About';
import Contact        from '../../component/Contact/Contact';
import Testimonials   from '../../component/Testimonials';
import Services       from '../../component/Services';
import Collaborations from '../../component/Collaborations';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>

      <Hero />

      <About />

      <Testimonials />

      <Services />

      {/* ── Projects — 3D carousel + stat strip ── */}
      <ProjectCarousel />

      {/* ── Collaborations / Partners ── */}
      <Collaborations />

      <Contact />

    </main>
  );
}
