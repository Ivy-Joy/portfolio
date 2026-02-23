//src/data/projects.js
const localProjects = [
  {
    _id: '1',
    title: "DirectAid - Transparent Bitcoin Crowdfunding for African Communities",
    slug: 'directaid',
    summary: "DirectAid is a trust-driven Bitcoin crowdfunding platform connecting donors directly with verified beneficiaries and service providers across Africa, using transparent payments, documented verification, and auditable payouts.",
    description: `
      <p>
      DirectAid is a transparency-first crowdfunding platform designed to solve trust and verification challenges in African charitable giving. The platform connects donors directly to beneficiaries and verified service providers such as hospitals, schools, pharmacies, and essential vendors — eliminating opaque intermediaries and unverifiable cash flows.
      </p>

      <p>
      Unlike traditional donation platforms, DirectAid is built around <strong>document-based verification</strong> and <strong>Bitcoin-powered cross-border payments</strong>. Donations are recorded immutably, providers are required to upload invoices and supporting documents, and administrators verify each payout before funds are released.
      </p>

      <p>
      The system prioritizes low-friction donor entry through <strong>guest checkout</strong>, allowing anyone to contribute without account creation while still receiving optional receipts and proof-of-donation emails. This design choice was driven by early testing, which showed significant donor drop-off when verification and receipts were unavailable.
      </p>

      <p>
      DirectAid supports a unified onboarding model where users can act as donors, beneficiaries, providers, or NGO partners under a single account system. Providers undergo document review and verification before receiving payouts, creating strong trust signals for donors and reducing fraud risk.
      </p>

      <p>
      Built on Bitcoin and Lightning-compatible payment rails, DirectAid enables fast, low-cost, borderless donations while remaining future-proof for fiat off-ramps and regulated payout partners. Every campaign, donation, document, and payout is fully auditable, reinforcing transparency and accountability at every step.
      </p>

      <p>
      Positioned at the intersection of financial inclusion, impact-driven giving, and decentralized payments, DirectAid aims to become a core infrastructure layer for trusted aid distribution across Africa.
      </p>
    `,
    role: "Product Architect & Full-Stack Engineer",
    stack: ["React", "Node.js", "Express", "MongoDB", "Redis", "Bitcoin(on-chain)", "Lightning Network", "M-PESA", "All users Verification Dashboards"],
    year: 2026,
    coverImage: "/images/DirectAidLandingPage.jpeg",
    screenshots: [
      // "/images/DirectAidBeneficiaryProfile-1.png",
      "/images/directaid/beneficiary-dashboard.png",
      //"/images/projects/directaid/donation-flow.jpg",
      //"/images/projects/directaid/guest-checkout.jpg",
      //"/images/projects/directaid/provider-verification.jpg",
      "/images/directaid/admin-dashboard.png"
    ],
    //repoUrl: 'https://github.com/Ivy-Joy/DirectAid',
    repoUrl: "https://github.com/DadaDevelopers/dada-devs-labs-dada-lab-3/tree/dev",
    // demoUrl: "https://directaid.africa",
    demoUrl: "https://directaid.vercel.app/"
  },
  {
    _id: '2',
    title: "Errando - Premium, Trusted Errand & Micro-Logistics Management Platform",
    slug: 'errando',
    summary:"Errando is a premium Logistics Management Platform (LMP) for high-trust errands and administrative logistics in Kenya, built around escrow payments, verifiable proof-of-work, and a curated operator network.",
    description: `
    <p>
    Errando is a national-grade errand, administrative, and micro-logistics platform designed to solve high-trust task execution challenges across Kenya. Unlike gig-economy or open marketplace courier models, Errando operates as a <strong>Logistics Management Platform (LMP)</strong> with a curated operator network, strict SOPs, and auditable execution.
    </p>

    <p>
    The platform is built around reliability, accountability, and proof — not speed alone. Every task generates a structured <strong>Errand DNA</strong> record capturing operator assignment, GPS and time stamps, photos, receipts, signatures, and completion metadata. This creates a verifiable audit trail for dispute resolution and trust preservation.
    </p>

    <p>
    Errando supports escrow-based payments using M-PESA, where funds are authorized upfront and only released upon verified completion or auto-release after proof validation. This protects both clients and operators while enabling transparent refunds, adjustments, and corporate invoicing.
    </p>

    <p>
    The system is mobile-first and WhatsApp-accessible, backed by an offline-capable operator app, a corporate booking portal, and a centralized admin dashboard ("God Mode") for dispatch, city configuration, operator vetting, and quality control.
    </p>

    <p>
    Errando follows a city-by-city rollout strategy driven by operational readiness, starting with Nairobi as the product and operations lab, before expanding to Mombasa, Kisumu, and secondary cities. Expansion is governed by performance metrics such as on-time completion rate, repeat usage, dispute frequency, and operator utilization.
    </p>

    <p>
    Positioned as a premium service, Errando focuses on high-value errands including government administration, medical logistics, business document handling, assisted errands for elderly users, and SME micro-logistics — prioritizing trust, professionalism, and consistency over mass-market volume.
    </p>
    `,
    role: "Product Architect & Full-Stack Engineer",
    stack: 
    [
      "NestJS",
      "PostgreSQL (PostGIS)",
      "React",
      "PWA / React Native",
      "M-PESA (Escrow & STK Push)",
      "Cloud Object Storage",
      "REST APIs"
    ],
    year: 2026,
    coverImage: "/images/ErrandoLandingPage.jpeg",
    screenshots: [
      "/images/Errando/ErrandoAppOnboarding.png",
      "/images/Errando/ClientBookingErrandPage.png",
      // "/images/Errando/operator-app.jpg",
      // "/images/Errando/admin-dashboard.jpg",
      // "/images/Errando/errand-proof.jpg"
    ],
    repoUrl: 'https://github.com/Ivy-Joy/Errando',
    demoUrl: ''
  },
  {
    _id: '3',
    title: 'CivicHub: Integrated Civic Education & Voter Information Platform',
    slug: 'civichub',
    summary: "CivicHub is a non-partisan, voter-first platform that centralizes official election information, polling-station lookup, and simplified civic education to help citizens participate confidently in Kenya’s democratic process.",
    description: `
      <p><strong>CivicHub</strong> was built to address a common challenge in civic participation: access to clear, reliable, and locally relevant election information. While official electoral and constitutional resources exist, they are often fragmented, highly technical, and difficult to navigate - especially for first-time voters, students, and communities with limited internet access.</p>
      <p>The platform aggregates official public data and presents it in a simple, non-partisan format that allows users to quickly find where to register or vote, understand election timelines, and learn what is required on voting day. Location-based search enables users to identify nearby registration centers and polling stations using either administrative locations or device location, reducing confusion and reliance on unofficial sources.</p>
      <p>CivicHub also provides structured civic education through a sectioned Constitution, broken down into clear, navigable topics with plain-language explanations. Content is designed for multiple literacy levels, making it suitable for classroom use, self-study, and community learning. Printable materials and translation-ready content ensure the platform can be used in low-connectivity environments and local outreach programs.</p>
      <p>The system is intentionally designed as an informational tool only. It does not perform voter registration, does not collect national identification numbers, and does not promote political parties or candidates. All content is reviewed for neutrality and accuracy, supporting informed participation without influencing voter choice.</p>
      <p>By prioritizing accessibility, clarity, and trust, CivicHub aims to strengthen civic knowledge, reduce election-related misinformation, and enable citizens to participate confidently and responsibly in democratic processes.</p>
    `,
    role: "Founder, Product Architect, and Full-Stack Engineer",
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: 2024,
    coverImage: "/images/CivicHub.jpeg",
    screenshots: [
      "/images/CivicHub/LocatePollingStationAndKYL.png",
      "images/CivicHub/ElectionDates.png"
    ],
    repoUrl: '',
    demoUrl: ''
  },
  {
    _id: '4',
    title: 'Lake City Creative Arts - E-commerce Platform(Curated Marketplace for Authentic Maasai Sandals)',
    slug: 'lake-city-creative-arts',
    summary: "Lake City Creative Arts is a curated e-commerce platform showcasing authentic, artisan-made Maasai sandals. The project connects skilled Maasai artisans with global buyers through story-led product pages, ethical sourcing, and a frictionless checkout experience optimized for African and international customers.",
    description: `
      <p> Lake City Creative Arts is a boutique e-commerce experience built to celebrate and commercialize authentic Maasai sandal craftsmanship while ensuring fair pay, traceable provenance, and a delightful shopping experience for global customers. The platform combines strong merchant controls, artisan stories, and modern commerce features to create a sustainable marketplace that scales artisan income without sacrificing cultural integrity. </p> <p> Each product page emphasizes provenance: artisan profiles, making-of galleries, limited edition batch numbers, and recommended care instructions. The design focuses on photography-first storytelling, simple customization (size, beadwork options, color), and a one-click checkout flow that supports both local payment rails (M-PESA) and international gateways (Stripe). Orders are tracked end-to-end and artisans receive transparent payout statements after each disbursement cycle. </p> <p> Operationally, Lake City Creative Arts implements a cooperative onboarding model where artisan collectives register, upload product batches, and manage inventory through an intuitive admin dashboard. Administrators can approve new artisans, manage inventory allocations, and reconcile payouts. The platform also includes wholesale tooling for boutique retailers, a campaign system for limited drops, and a returns & repair workflow tailored for handcrafted goods. </p> <p> Built to be mobile-first and performance-optimized, Lake City Creative Arts prioritizes low-latency browsing in markets with constrained connectivity. The platform supports localized UX (currency, language, local delivery instructions) and is designed to scale from Kenya-first operations to international shipping with minimal operational overhead. </p>
    `,
    role: 'Product Architect & Lead Full Stack Engineer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe(international payments)', "MPESA API( local Kenyan payments)", "REST APIs", "Webhooks Server-side rendering", "hydration for SEO", "CI/CD (GitHub Actions)", "Analytics (GA4 + custom events)"],
    year: 2025,
    coverImage: '/images/LakeCityCreativesArt.jpeg',
    screenshots: [
      "images/LCC/Shop-page.png",
      "/images/LCC/AboutUs-Page.png",
      "/images/LCC/Blog-Page.png",
      "/images/LCC/Cart-Page.png",
      "/images/LCC/ContactUs-Page.png",
      // "/images/projects/lakecity/checkout-mpesa.jpg",
      // "/images/projects/lakecity/admin-dashboard.jpg"
    ],
    repoUrl: '',
    demoUrl: ''
  }
];

export default localProjects;
