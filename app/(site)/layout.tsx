import PageWrapper from '../../component/Layout/PageWrapper';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer';
import styles from './page.module.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <a href="#main-content" className="sr-only" style={{ position: 'absolute', zIndex: 9999, padding: '12px 24px', background: '#c9973a', color: '#0a0907', textDecoration: 'none', borderRadius: '0 0 8px 0', fontWeight: 600, fontSize: '0.85rem' }}>
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content" className={styles.main}>
        {children}
      </div>
      <Footer />
    </PageWrapper>
  );
}
