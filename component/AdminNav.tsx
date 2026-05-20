'use client';

import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/collaborations', label: 'Partners' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/media', label: 'Media' },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 24px', borderBottom: '1px solid rgba(210,180,140,0.1)', flexWrap: 'wrap' }}>
      {links.map(link => (
        <a key={link.href} href={link.href}
          style={{
            color: isActive(link.href) ? '#c9973a' : '#f0e6d3',
            fontWeight: isActive(link.href) ? 700 : 400,
            textDecoration: 'none', fontSize: '0.85rem',
          }}>
          {link.label}
        </a>
      ))}
      <a href="/admin/change-password" style={{
        color: isActive('/admin/change-password') ? '#c9973a' : 'rgba(240,220,190,0.4)',
        textDecoration: 'none', fontSize: '0.85rem', marginLeft: 'auto',
      }}>
        Change Password
      </a>
      <form action="/api/auth/logout" method="POST" style={{ marginLeft: 12 }}>
        <button type="submit" style={{ background: 'none', border: '1px solid rgba(210,180,140,0.3)', color: '#f0e6d3', padding: '6px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Logout
        </button>
      </form>
    </nav>
  );
}
