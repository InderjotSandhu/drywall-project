import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | New Canadian Drywall',
  description: 'How New Canadian Drywall collects, uses, and protects your personal information when you use our website and services.',
};

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px clamp(24px, 6vw, 100px)', color: '#f0e6d3', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: 'rgba(240,220,190,0.42)', marginBottom: 32 }}><em>Last updated: May 2026</em></p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>When you submit a contact form or quote request on our website, we collect your name, email address, phone number, project details, and any additional information you provide. When you submit a career application, we collect your name, email address, phone number, work experience, availability, and resume.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>We use the information you provide solely to respond to your inquiries, provide quotes for drywall services, and evaluate career applications. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>3. Data Storage</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>Your information is stored securely in our database. We retain submission data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data by contacting us.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>4. Cookies</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>Our website uses a session cookie to maintain admin login state. No tracking cookies or third-party analytics are used.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>5. Contact</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>For questions about this policy, contact us at <strong style={{ color: '#f0e6d3' }}>info@newcanadiandrywall.ca</strong>.</p>
    </div>
  );
}
