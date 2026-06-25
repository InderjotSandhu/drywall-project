import Hero           from '../../component/Hero';
import Services       from '../../component/Services';
import About          from '../../component/About';
import ProjectCarousel from '../../component/ProjectCarousel';
import Testimonials   from '../../component/Testimonials';
import Collaborations from '../../component/Collaborations';
import Contact        from '../../component/Contact/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />

      <Services />

      <About />

      <ProjectCarousel />

      <Testimonials />

      <Collaborations />

      <Contact />
    </>
  );
}
