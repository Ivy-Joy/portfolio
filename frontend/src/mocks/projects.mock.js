/**
 * Frontend development mock data
 * Shape mirrors backend Project model & seed
 * Used when VITE_USE_MOCKS === 'true'
 */

export const PROJECTS = [
  {
    _id: '1',
    title: 'DirectAid - Beneficiary & Disbursement Platform',
    slug: 'directaid',
    summary: 'Trust-driven beneficiary management and direct disbursement platform with M-PESA and Lightning payments.',
    description: `
      <p><strong>DirectAid</strong> is a beneficiary-first aid distribution platform designed to remove intermediaries and ensure transparent delivery of funds.</p>
    `,
    role: 'Lead Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Bitcoin Lightning', 'M-PESA'],
    year: 2025,
    coverImage: '/images/DirectAid.png',
    screenshots: [
      '/images/DirectAidBeneficiaryProfile-1.png',
      '/images/DirectAidSelectRole-2.png'
    ],
    repoUrl: 'https://github.com/Ivy-Joy/DirectAid',
    demoUrl: ''
  },
  {
    _id: '2',
    title: 'Errando - Digital Errand Platform',
    slug: 'errando',
    summary: 'On-demand errand and task fulfillment platform with escrow-style payments.',
    description: `
      <p><strong>Errando</strong> connects users with vetted runners to complete everyday tasks with clear lifecycle tracking.</p>
    `,
    role: 'Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'M-PESA'],
    year: 2024,
    coverImage: '/images/Errando.png',
    screenshots: ['/images/Errando-1.png'],
    repoUrl: 'https://github.com/Ivy-Joy/Errando',
    demoUrl: ''
  },
  {
    _id: '3',
    title: 'CivicHub - Civic Engagement Platform',
    slug: 'civichub',
    summary: 'Community reporting and civic engagement platform for local governance.',
    description: `
      <p><strong>CivicHub</strong> enables citizens to report issues, track resolutions, and engage local authorities.</p>
    `,
    role: 'Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    year: 2024,
    coverImage: '/images/CivicHub.jpeg',
    screenshots: ['/images/CivicHub.jpeg'],
    repoUrl: '',
    demoUrl: ''
  },
  {
    _id: '4',
    title: 'Lake City Creative Arts - E-commerce Platform',
    slug: 'lake-city-creative-arts',
    summary: 'E-commerce platform for local artists with payments and inventory.',
    description: `
      <p><strong>Lake City Creative Arts</strong> provides a digital storefront for artisans to sell creative works.</p>
    `,
    role: 'Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    year: 2023,
    coverImage: '/images/LakeCityCreativesArt.jpeg',
    screenshots: ['/images/LakeCityCreativesArt.jpeg'],
    repoUrl: '',
    demoUrl: ''
  },

  {
    _id: '5',
    title: 'Sanaa - Creative Services Marketplace',
    slug: 'sanaa',
    summary: 'Marketplace connecting clients with verified creative professionals.',
    description: `
      <p><strong>Sanaa</strong> connects clients with designers and creatives through curated profiles.</p>
    `,
    role: 'Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: 2023,
    coverImage: '/images/Sanaa.png',
    screenshots: ['/images/Sanaa.png'],
    repoUrl: '',
    demoUrl: ''
  }
];