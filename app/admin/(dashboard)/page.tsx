import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [projectCount, testimonialCount, quoteCount, careerCount] = await Promise.all([
    prisma.project.count(),
    prisma.testimonial.count(),
    prisma.quoteSubmission.count(),
    prisma.careerSubmission.count(),
  ]);

  const cards = [
    { label: 'Projects', count: projectCount, href: '/admin/projects', color: '#c9973a' },
    { label: 'Testimonials', count: testimonialCount, href: '/admin/testimonials', color: '#4a9eff' },
    { label: 'Quote Submissions', count: quoteCount, href: '/admin/submissions?type=quote', color: '#4caf50' },
    { label: 'Career Applications', count: careerCount, href: '/admin/submissions?type=career', color: '#ff7043' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(card => (
          <a key={card.label} href={card.href}
            style={{
              padding: 24, borderRadius: 12, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(210,180,140,0.1)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: card.color }}>{card.count}</span>
            <span style={{ color: 'rgba(240,220,190,0.6)', fontSize: '0.85rem' }}>{card.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
