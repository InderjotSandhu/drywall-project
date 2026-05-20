import PageWrapper from '../../component/Layout/PageWrapper';
import Navbar from '../../component/Navbar/Navbar';
import Footer from '../../component/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <Navbar />
      {children}
      <Footer />
    </PageWrapper>
  );
}
