import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('🌱 Seeding database...\n');

  const projectCount = await prisma.project.count();
  if (projectCount > 0) {
    console.log(' Database already seeded, skipping');
    return;
  }

  // ─── Projects ──────────────────────────────────────────
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'Photos Ancaster',
        category: 'Residential',
        description: 'Full residential drywall installation across multiple rooms — smooth Level 5 skim-coat finishing, precise taping, and clean edge work throughout this Ancaster home.',
        location: 'Ancaster, ON',
        image: '/images/Photos Ancaster/IMG_8378.jpeg',
        imageAlt: 'Ancaster residential drywall installation',
        order: 1,
      },
      {
        title: 'Brydon Drive Commercial',
        category: 'Commercial',
        description: 'Commercial drywall installation on Brydon Drive — steel-stud framing, boarding, and finishing across a full commercial interior fit-out, delivered on schedule.',
        location: 'Hamilton, ON',
        image: '/images/Brydon Drive Commercial/IMG_8054.jpeg',
        imageAlt: 'Brydon Drive commercial drywall fit-out',
        order: 2,
      },
      {
        title: 'Burlock Restaurant',
        category: 'Hospitality',
        description: "Feature drywall installation for Burlock Restaurant — custom curves, clean soffits, and smooth finishing throughout the dining space to match the venue's premium aesthetic.",
        location: 'Burlington, ON',
        image: '/images/Burlock Restaurant/06B74D77-EE9A-4DDE-ADE3-1C5DA3256A22.jpeg',
        imageAlt: 'Burlock Restaurant interior drywall',
        order: 3,
      },
      {
        title: 'Grimsby Plaza',
        category: 'Commercial',
        description: 'Commercial drywall scope at Grimsby Plaza — partitioning, boarding, and finishing for a retail plaza unit, completed to a tight schedule without disrupting neighbouring tenants.',
        location: 'Grimsby, ON',
        image: '/images/Grimsby Plaza/IMG_8194.jpeg',
        imageAlt: 'Grimsby Plaza commercial drywall project',
        order: 4,
      },
      {
        title: 'Sir Modesto Custom House',
        category: 'Residential',
        description: 'High-end custom home drywall installation for Sir Modesto — exacting Level 5 finishing across all living spaces, designed to meet the elevated standards of a luxury custom build.',
        location: 'Hamilton, ON',
        image: '/images/Sir Modesto Custom House/IMG_8212.jpeg',
        imageAlt: 'Sir Modesto Custom House drywall finishing',
        order: 5,
      },
      {
        title: 'Bel-for Office — Stoney Creek',
        category: 'Commercial',
        description: "Office drywall renovation for Bel-for Property Restoration's Stoney Creek location — partition walls, boarding, and smooth finishing throughout the commercial office space.",
        location: 'Stoney Creek, ON',
        image: '/images/Bel-for Office Stoney creek/IMG_8702.jpeg',
        imageAlt: 'Bel-for Office Stoney Creek drywall renovation',
        order: 6,
      },
    ],
  });
  console.log(`✅ Created ${projects.count} projects`);

  // ─── Project Images ────────────────────────────────────
  const allProjects = await prisma.project.findMany({ orderBy: { order: 'asc' } });

  await prisma.projectImage.createMany({
    data: [
      // Photos Ancaster (project 1)
      { url: '/images/Photos Ancaster/IMG_8379.jpeg', order: 1, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8383.jpeg', order: 2, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8384.jpeg', order: 3, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8385.jpeg', order: 4, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8386.jpeg', order: 5, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8391.jpeg', order: 6, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8392.jpeg', order: 7, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8393.jpeg', order: 8, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8394.jpeg', order: 9, projectId: allProjects[0].id },
      { url: '/images/Photos Ancaster/IMG_8395.jpeg', order: 10, projectId: allProjects[0].id },
      // Brydon Drive (project 2)
      { url: '/images/Brydon Drive Commercial/IMG_8055.jpeg', order: 1, projectId: allProjects[1].id },
      // Burlock Restaurant (project 3)
      { url: '/images/Burlock Restaurant/37C0DCC8-F57D-40AB-8C6B-B01355FA0480.jpeg', order: 1, projectId: allProjects[2].id },
      { url: '/images/Burlock Restaurant/5481DA00-8B44-4C8A-A7B2-1057AD78ECCA.jpeg', order: 2, projectId: allProjects[2].id },
      { url: '/images/Burlock Restaurant/CE5F2879-AE7A-4BDE-9217-5288E007D2DC.jpeg', order: 3, projectId: allProjects[2].id },
      { url: '/images/Burlock Restaurant/F14A2800-ECA7-430B-938C-A39D6ECD5B6C.jpeg', order: 4, projectId: allProjects[2].id },
    ],
  });
  console.log('✅ Created project images');

  // ─── Project Videos ────────────────────────────────────
  await prisma.projectVideo.createMany({
    data: [
      { url: '/videos/Photos Ancaster/IMG_8376.mov', order: 1, projectId: allProjects[0].id },
      { url: '/videos/Photos Ancaster/IMG_8377.mov', order: 2, projectId: allProjects[0].id },
      { url: '/videos/Brydon Drive Commercial/IMG_8056.mov', order: 1, projectId: allProjects[1].id },
      { url: '/videos/Sir Modesto Custom House/IMG_5925.mov', order: 1, projectId: allProjects[4].id },
      { url: '/videos/Sir Modesto Custom House/IMG_5936.mov', order: 2, projectId: allProjects[4].id },
    ],
  });
  console.log('✅ Created project videos');

  // ─── Project Stats ─────────────────────────────────────
  await prisma.projectStat.createMany({
    data: [
      // Photos Ancaster
      { label: 'Type', value: 'Residential', order: 1, projectId: allProjects[0].id },
      { label: 'Finish', value: 'Level 5', order: 2, projectId: allProjects[0].id },
      { label: 'Location', value: 'Ancaster, ON', order: 3, projectId: allProjects[0].id },
      // Brydon Drive
      { label: 'Type', value: 'Commercial', order: 1, projectId: allProjects[1].id },
      { label: 'Location', value: 'Hamilton, ON', order: 2, projectId: allProjects[1].id },
      { label: 'Scope', value: 'Full Fit-Out', order: 3, projectId: allProjects[1].id },
      // Burlock Restaurant
      { label: 'Type', value: 'Hospitality', order: 1, projectId: allProjects[2].id },
      { label: 'Location', value: 'Burlington, ON', order: 2, projectId: allProjects[2].id },
      { label: 'Scope', value: 'Feature Walls', order: 3, projectId: allProjects[2].id },
      // Grimsby Plaza
      { label: 'Type', value: 'Commercial', order: 1, projectId: allProjects[3].id },
      { label: 'Location', value: 'Grimsby, ON', order: 2, projectId: allProjects[3].id },
      { label: 'Scope', value: 'Retail Plaza', order: 3, projectId: allProjects[3].id },
      // Sir Modesto
      { label: 'Type', value: 'Residential', order: 1, projectId: allProjects[4].id },
      { label: 'Finish', value: 'Level 5', order: 2, projectId: allProjects[4].id },
      { label: 'Location', value: 'Hamilton, ON', order: 3, projectId: allProjects[4].id },
      // Bel-for Office
      { label: 'Type', value: 'Commercial', order: 1, projectId: allProjects[5].id },
      { label: 'Location', value: 'Stoney Creek, ON', order: 2, projectId: allProjects[5].id },
      { label: 'Client', value: 'BELFOR', order: 3, projectId: allProjects[5].id },
    ],
  });
  console.log('✅ Created project stats');

  // ─── Testimonials ──────────────────────────────────────
  const testimonials = await prisma.testimonial.createMany({
    data: [
      { name: 'Michael Torres', quote: 'New Canadian Drywall completely transformed our office space. The finish quality was exceptional — perfectly smooth walls, clean edges, and zero defects. Delivered two days ahead of schedule.', order: 1 },
      { name: 'Sarah Chen', quote: "We hired New Canadian for a full residential renovation and couldn't be happier. The team was professional, tidy, and the skim-coat finish on our living room walls is absolutely flawless.", order: 2 },
      { name: 'David Okafor', quote: 'Outstanding work on our commercial fit-out. Fire-rated partitions were installed precisely to spec, inspections passed first time, and the crew cleaned up after themselves every single day.', order: 3 },
      { name: 'Priya Sharma', quote: "I've worked with a lot of drywall contractors over the years. New Canadian Drywall stands apart — their attention to detail on the curved feature walls in our restaurant was incredible.", order: 4 },
      { name: 'James Whitfield', quote: 'From quote to completion the whole process was seamless. Transparent pricing, no surprises, and the finished result exceeded our expectations. Highly recommend for any commercial project.', order: 5 },
      { name: 'Aisha Nakamura', quote: 'The acoustic partition work in our recording studio required extreme precision. New Canadian Drywall nailed it — the sound isolation is exactly what we needed and the finish is immaculate.', order: 6 },
      { name: 'Robert Fleming', quote: 'Used New Canadian for our school renovation project over the summer break. They managed a tight 8-week window perfectly, met every milestone, and the quality of the work is outstanding.', order: 7 },
      { name: 'Linda Papadopoulos', quote: 'New Canadian handled our entire apartment complex — 48 units. Consistent quality across every single one. The project manager kept us informed throughout and the team was a pleasure to work with.', order: 8 },
      { name: 'Carlos Mendez', quote: 'Best drywall contractor in the GTA, full stop. The level of craftsmanship on our hotel corridor refurbishment was remarkable. On time, on budget, and the result looks fantastic.', order: 9 },
      { name: 'Emma Fitzgerald', quote: 'New Canadian completed our medical centre fit-out including lead-lined walls for radiology — highly technical work done without a single issue. Inspections passed immediately. Truly professional.', order: 10 },
    ],
  });
  console.log(`✅ Created ${testimonials.count} testimonials`);

  // ─── Services ──────────────────────────────────────────
  const services = [
    {
      id: 'installation',
      title: 'Drywall Installation',
      description: 'Full-scope drywall installation for new builds and fit-outs — residential and commercial. Precise, fast, and finished to spec every time.',
      detail: 'From single rooms to multi-floor commercial towers, our installation crews are experienced in all board types, thicknesses, and configurations. We handle everything from layout and cutting to boarding, taping, and handover-ready finishing.',
      order: 1,
      tags: ['Residential', 'Commercial', 'New Build'],
      features: [
        { title: 'All board types & thicknesses', description: 'Standard, moisture-resistant, and impact-resistant boards.' },
        { title: 'Residential & commercial scope', description: 'Single rooms to 50,000 sq ft fit-outs.' },
        { title: 'Clean, efficient crews', description: 'Site left tidy at the end of every shift.' },
        { title: 'Schedule-driven delivery', description: 'We plan around your build programme.' },
      ],
    },
    {
      id: 'framing',
      title: 'Steel-Stud Framing',
      description: 'Light-gauge steel framing for interior partitions, bulkheads, and feature structures — straight, plumb, and built to last.',
      detail: 'Steel-stud framing forms the backbone of every quality drywall installation. Our framers work to tight tolerances, ensuring every wall is plumb, square, and ready to accept board with minimal waste. We frame for standard partitions, curved walls, soffits, and complex ceiling features.',
      order: 2,
      tags: ['Partitions', 'Bulkheads', 'Commercial'],
      features: [
        { title: 'Tight tolerances', description: 'Plumb and square every time — no excuses.' },
        { title: 'Curved & complex geometry', description: 'Arches, radius walls, and stepped soffits.' },
        { title: 'Acoustic decoupling', description: 'Resilient channel and staggered stud layouts.' },
        { title: 'Coordinated with services', description: 'We work around MEP runs and structure.' },
      ],
    },
    {
      id: 'acoustic',
      title: 'Acoustic Partitions',
      description: 'High-performance acoustic wall and ceiling systems for offices, studios, hotels, and multi-residential builds.',
      detail: 'Noise control is critical in multi-residential, hospitality, and office environments. We design and install acoustic partition systems — double-stud, resilient channel, acoustic batt insulation, and multiple board layers — to achieve the STC ratings your project demands.',
      order: 3,
      tags: ['Sound Control', 'Multi-Res', 'Office'],
      features: [
        { title: 'STC-rated assemblies', description: 'Systems engineered to meet or exceed code.' },
        { title: 'Double-stud & resilient channel', description: 'Structural decoupling for maximum isolation.' },
        { title: 'Acoustic batt insulation', description: 'Specified and installed within partition cavities.' },
        { title: 'Multi-layer board systems', description: 'Up to quad-layer configurations for studios.' },
      ],
    },
    {
      id: 'fire',
      title: 'Fire-Rated Systems',
      description: 'UL-listed fire-rated assemblies — shaft walls, corridor separations, and rated partitions installed to code and inspection-ready.',
      detail: 'Fire-rated drywall assemblies require exact compliance with tested UL assemblies. Our team is trained in the specific board types, fastener patterns, joint treatments, and penetration seals required for each rated assembly — so your inspections pass first time.',
      order: 4,
      tags: ['UL Listed', 'Code Compliant', 'Commercial'],
      features: [
        { title: 'UL-listed assemblies', description: '1, 2, and 3-hour rated walls and ceilings.' },
        { title: 'Shaft wall systems', description: 'Elevator, stair, and mechanical shaft enclosures.' },
        { title: 'Penetration sealing', description: 'Fire-stopping at all service penetrations.' },
        { title: 'First-time inspection pass', description: 'Documented compliance at every stage.' },
      ],
    },
    {
      id: 'finishing',
      title: 'Skim-Coat Finishing',
      description: 'Level 5 skim-coat and smooth-finish plastering for walls and ceilings that need to look flawless under raking light.',
      detail: 'A Level 5 skim-coat finish is the gold standard for high-end residential and hospitality interiors where walls are lit at oblique angles. Our finishing team applies a full skim coat over the taped surface, sands to perfection, and primes — delivering walls ready for any paint or wallcovering.',
      order: 5,
      tags: ['Level 5', 'Luxury Finish', 'Residential'],
      features: [
        { title: 'Level 5 finish standard', description: 'Full skim coat over taped and primed surface.' },
        { title: 'Zero telegraphing', description: 'No fastener, tape, or shadow marks visible.' },
        { title: 'Primer-ready handover', description: 'Surface prepared for paint or wallcovering.' },
        { title: 'Ideal under raking light', description: 'Perfect for luxury residential and hospitality.' },
      ],
    },
    {
      id: 'taping',
      title: 'Taping & Sanding',
      description: 'Professional multi-coat taping, bedding, and feathered sanding for seamless joints — the foundation of every perfect wall.',
      detail: 'Great finishing starts with great taping. We apply paper or fibreglass mesh tape embedded in setting-type compound, followed by multiple coats of finishing compound feathered to an invisible seam. Every joint, inside corner, outside corner bead, and fastener dimple is treated and sanded to a consistent Level 4 or Level 5 finish.',
      order: 6,
      tags: ['Multi-Coat', 'Seamless', 'All Projects'],
      features: [
        { title: 'Paper & mesh tape systems', description: 'Right tape specified for the right application.' },
        { title: 'Multi-coat compound application', description: 'Setting and topping coats applied in sequence.' },
        { title: 'Corner bead finishing', description: 'Metal and paper bead dressed to a sharp edge.' },
        { title: 'Dust-controlled sanding', description: 'Vacuum-assisted sanding to keep sites clean.' },
      ],
    },
  ];

  for (const svc of services) {
    await prisma.service.create({
      data: {
        id: svc.id,
        title: svc.title,
        description: svc.description,
        detail: svc.detail,
        order: svc.order,
        tags: { create: svc.tags.map((label, i) => ({ label, order: i })) },
        features: { create: svc.features.map((f, i) => ({ title: f.title, description: f.description, order: i })) },
      },
    });
  }
  console.log(`✅ Created ${services.length} services`);

  // ─── Collaborations ───────────────────────────────────
  const collaborations = await prisma.collaboration.createMany({
    data: [
      { name: 'BELFOR', logo: '/collaborations/IMG_8705.jpeg', order: 1 },
      { name: 'ON SIDE', logo: '/collaborations/IMG_8706.jpeg', order: 2 },
      { name: 'WINMAR', logo: '/collaborations/IMG_8707.jpeg', order: 3 },
    ],
  });
  console.log(`✅ Created ${collaborations.count} collaborations`);

  // ─── Admin ──────────────────────────────────────────────
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await prisma.admin.findFirst();
  if (!existing) {
    await prisma.admin.create({ data: { passwordHash: hashPassword(adminPassword) } });
    console.log(`✅ Admin created (password from .env or default)`);
  } else {
    console.log(' Admin already exists, skipping seed');
  }

  console.log('\n Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
