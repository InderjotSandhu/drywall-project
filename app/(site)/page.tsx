import Hero           from '../../component/Hero';
import ProjectCarousel from '../../component/ProjectCarousel';
import About          from '../../component/About';
import Contact        from '../../component/Contact/Contact';
import Testimonials   from '../../component/Testimonials';
import Services       from '../../component/Services';
import Collaborations from '../../component/Collaborations';

export default function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <Testimonials />

      <Services />

      <ProjectCarousel />

      <Collaborations />

      <Contact />
    </>
  );
}
