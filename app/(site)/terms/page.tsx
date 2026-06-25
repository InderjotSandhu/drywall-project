import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | New Canadian Drywall',
  description: 'Terms and conditions for using New Canadian Drywall website and services, including quotes, estimates, and service agreements.',
};

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px clamp(24px, 6vw, 100px)', color: '#f0e6d3', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: 'rgba(240,220,190,0.42)', marginBottom: 32 }}><em>Last updated: May 2026</em></p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>1. Services</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>New Canadian Drywall provides drywall installation, framing, finishing, and related services for residential and commercial clients in the Greater Toronto Area. All work is performed in accordance with industry standards and applicable building codes.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>2. Quotes &amp; Estimates</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>Quotes provided through our website are estimates based on the information provided. Final pricing may vary after an on-site assessment. All quotes are valid for 30 days unless otherwise stated.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>3. Website Use</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>By using this website, you agree to provide accurate information when submitting forms. We reserve the right to decline service at our discretion.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>4. Limitation of Liability</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>New Canadian Drywall shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or our services.</p>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 28, marginBottom: 8, color: '#c9973a' }}>5. Contact</h2>
      <p style={{ marginBottom: 16, color: 'rgba(240,220,190,0.65)' }}>For questions about these terms, contact us at <strong style={{ color: '#f0e6d3' }}>info@newcanadiandrywall.ca</strong>.</p>
    </div>
  );
}
