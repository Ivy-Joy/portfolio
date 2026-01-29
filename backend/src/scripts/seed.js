import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project.js';
import { projects } from './projectsSeed.js'; // the file above

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// backend/scripts/projectsSeed.js
export const projects = [
  {
    title: 'CivicHub - Civic Engagement & Reporting',
    slug: 'civichub',
    summary: 'Community reporting platform that connects citizens to local government workflows and improves service response times.',
    description: `
      <p><strong>CivicHub</strong> is a civic reporting and engagement platform built to let community members report local issues (infrastructure, safety, sanitation) and track resolution status.  The system focused on reliability in low-bandwidth environments, strong audit trails for reports, and a lightweight admin workflow for municipal teams.</p>

      <h3>My role</h3>
      <p>Lead Full-Stack Developer - owned API design, data model, role-based auth, and integrations with third-party mapping & notification services. Led code reviews and mentored two junior backend devs.</p>

      <h3>What I shipped</h3>
      <ul>
        <li>REST API (Express) with strict resource-based routes for reports, users, and cases.</li>
        <li>Role-based access control for citizen reporters, municipal agents, and admins.</li>
        <li>Offline-first-friendly endpoints and payload compression to support low-connectivity users.</li>
        <li>Push + SMS notifications for status changes (via third-party provider) and email digests for admins.</li>
      </ul>

      <h3>Technical architecture & tradeoffs</h3>
      <p>Frontend is a React SPA; backend is Node/Express with MongoDB as primary store. Redis is used for caching hot lookups and for job locks. Background worker (Bull) processes media uploads, notification batching, and CSV exports. We chose MongoDB for flexible report schemas (varied metadata per report type) — tradeoff: added schema validation & nightly schema checks to prevent drift.</p>

      <h3>Reliability, testing & observability</h3>
      <ul>
        <li>Automated unit tests for business logic; integration tests for key API flows using Supertest.</li>
        <li>CI pipeline with GitHub Actions running lint, tests, and a staging deploy on merge.</li>
        <li>Logging to Sentry + structured logs to ELK for searchable incident analysis.</li>
        <li>Health checks + readiness endpoints used by the container orchestrator (Docker / Render).</li>
      </ul>

      <h3>Security & data handling</h3>
      <ul>
        <li>Input validation and sanitization on all endpoints; strict RBAC around data access.</li>
        <li>PII minimization: only store reporter contact details when necessary and rotate retention policy via a scheduled job.</li>
      </ul>

      <h3>Reviewer pointers</h3>
      <p>Look at <code>backend/src/controllers/reportsController.js</code> for idempotent report creation, <code>backend/src/services/notifications.js</code> for batched SMS/email logic, and <code>infra/docker-compose.yml</code> for worker+api topology.</p>
    `,
    role: 'Lead Full-Stack Developer',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Bull'],
    year: 2024,
    coverImage: '/images/CivicHub.jpeg',
    screenshots: ['/images/CivicHub-1.png', '/images/CivicHub-2.png'],
    repoUrl: 'https://github.com/Ivy-Joy/CivicHub',
    demoUrl: '',
    metrics: { placeholder: true, note: 'replace with real numbers (e.g., reports/month, avg resolution time)' }
  },

  {
    title: 'Lake City Creative Arts - E-commerce for Artisans',
    slug: 'lake-city-creative-arts',
    summary: 'E-commerce platform for local artisans - product catalog, checkout, order management, and provider onboarding.',
    description: `
      <p><strong>Lake City Creative Arts</strong> is an e-commerce marketplace designed to help local artisans list products, accept payments, and manage orders. The product was built with a strong emphasis on an easy onboarding flow for non-technical sellers and simple reconciliation for payouts.</p>

      <h3>My role</h3>
      <p>Full-stack lead — designed the payments flow, implemented provider onboarding, and built the admin reconciliation dashboard.</p>

      <h3>What I shipped</h3>
      <ul>
        <li>Product catalog with image management and SEO-friendly slugs.</li>
        <li>Checkout & payments supporting both card (Stripe) and local phone-pay flows (M-PESA phone-pay integration).</li>
        <li>Provider onboarding flow collecting KYC-lite details and bank/phone payout info.</li>
        <li>Admin dashboard for orders, refunds, and manual reconciliation (CSV export/import).</li>
      </ul>

      <h3>Technical architecture & tradeoffs</h3>
      <p>Frontend built in React, backend Node/Express with MongoDB for products and orders. Used Redis + Bull for background tasks (receipt generation, payout batching). Payments are proxied through a payments service that normalizes Stripe & M-PESA responses and ensures idempotent processing to avoid double-capture. We optimized images via server-side compression and delivered via CDN.</p>

      <h3>Testing, CI & ops</h3>
      <ul>
        <li>Unit tests on payment service and order lifecycle; end-to-end tests for checkout flows using Playwright.</li>
        <li>GitHub Actions CI with automated staging deployments, smoke tests, and DB backups scheduled nightly.</li>
        <li>Monitoring + alerts for failed payouts and checkout error spikes (Sentry + Prometheus alerting).</li>
      </ul>

      <h3>Security & compliance</h3>
      <ul>
        <li>PCI-scope kept minimal: card data handled entirely by Stripe (no card data on our servers).</li>
        <li>Secrets in environment variables and rotated in production using secrets manager.</li>
      </ul>

      <h3>Reviewer pointers</h3>
      <p>Open <code>backend/src/services/payments.js</code> for the M-PESA phone-pay flow, look at <code>backend/src/jobs/payoutWorker.js</code> for payout batching + idempotency, and review <code>frontend/src/pages/ProviderOnboard.jsx</code> for the seller UX decisions.</p>
    `,
    role: 'Full-stack Lead',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'M-PESA'],
    year: 2025,
    coverImage: '/images/LakeCityCreativesArt.jpeg',
    screenshots: ['/images/LakeCity-1.png', '/images/LakeCity-2.png'],
    repoUrl: 'https://github.com/Ivy-Joy/LakeCityCreativeArts',
    demoUrl: '',
    metrics: { placeholder: true, note: 'replace with seller count, orders/month, avg order value' }
  },

  {
    title: 'Sanaa - Creator Marketplace & Memberships',
    slug: 'sanaa',
    summary: 'A creator-first marketplace for workshops, digital content, and subscription memberships.',
    description: `
      <p><strong>Sanaa</strong> is a creator platform focused on monetizing workshops, digital downloads and memberships. The platform combines a store, subscription billing, event management, and simple analytics for creators.</p>

      <h3>My role</h3>
      <p>Technical lead - built the subscription engine, billing integrations, and creator analytics dashboard. Shipped the MVP and ran the first alpha with creators and pilot customers.</p>

      <h3>Key features delivered</h3>
      <ul>
        <li>Subscription billing model with tiered access and a membership portal.</li>
        <li>Event/workshop booking with ticketing, calendar integration, and attendee notifications.</li>
        <li>Creator dashboard with revenue breakdown, top content, and simple exportable reports.</li>
        <li>Simple discovery & onboarding to help creators publish their first product in under 15 minutes.</li>
      </ul>

      <h3>Architecture</h3>
      <p>React front-end, Node/Express backend, Postgres for relational data (subscriptions, bookings), and MongoDB for flexible content (posts, assets). Stripe is used for subscriptions while a local payment option was prepared for later M-PESA add-on. Background jobs handle invoice generation, email notifications, and monthly revenue aggregation.</p>

      <h3>Reliability & testing</h3>
      <ul>
        <li>Integration tests for billing lifecycle (trial → paid → cancel → prorate).</li>
        <li>Logging and alerting for failed billing events and webhook processing.</li>
      </ul>

      <h3>Reviewer pointers</h3>
      <p>Inspect <code>backend/src/services/subscriptions.js</code> for webhooks and invoice handling, and <code>frontend/src/components/CreatorMetrics.jsx</code> for the analytics surface.</p>
    `,
    role: 'Technical Lead',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Stripe'],
    year: 2023,
    coverImage: '/images/Sanaa.png',
    screenshots: ['/images/Sanaa-1.png', '/images/Sanaa-2.png'],
    repoUrl: 'https://github.com/Ivy-Joy/Sanaa',
    demoUrl: '',
    metrics: { placeholder: true, note: 'replace with membership count, MRR, churn rate if available' }
  },
  {
  title: 'DirectAid - Beneficiary & Disbursement Platform',
  slug: 'directaid',
  summary: 'Trust-driven beneficiary management and direct disbursement platform with M-PESA and Lightning payments.',
  description: `
    <p><strong>DirectAid</strong> is a beneficiary-first aid distribution platform designed to remove intermediaries and ensure transparent, traceable delivery of funds and services. The system connects donors directly to verified beneficiaries and service providers, with real-time tracking of disbursements and outcomes.</p>

    <h3>My role</h3>
    <p>Lead Full-Stack Engineer — responsible for system architecture, payment flows, data models, and security strategy. Led the project from concept through MVP and pilot deployment.</p>

    <h3>Core capabilities</h3>
    <ul>
      <li>Beneficiary onboarding with role-based flows (beneficiary, provider, admin).</li>
      <li>Direct disbursement using M-PESA phone-pay and Bitcoin Lightning (non-custodial).</li>
      <li>Transaction audit trails and immutable payment records.</li>
      <li>Admin verification workflows for beneficiaries and providers.</li>
      <li>Real-time payment status updates and notifications.</li>
    </ul>

    <h3>Architecture & technical decisions</h3>
    <p>The platform uses a React frontend with a Node.js/Express backend. MongoDB was chosen for beneficiary profiles and dynamic eligibility data, while Redis handles idempotency keys, rate limits, and payment state caching. Payments are abstracted behind a unified payments service that normalizes responses from M-PESA APIs and Lightning nodes.</p>

    <p>Lightning payments are initiated via invoice-based flows to avoid custody and reduce regulatory exposure. All payment operations are idempotent to prevent double disbursement — a critical requirement in aid systems.</p>

    <h3>Security, trust & compliance</h3>
    <ul>
      <li>Strict RBAC separating donors, beneficiaries, providers, and admins.</li>
      <li>PII minimization and encrypted storage for sensitive identifiers.</li>
      <li>Full transaction traceability with immutable references for audits.</li>
      <li>Webhook signature verification and replay protection for payment callbacks.</li>
    </ul>

    <h3>Testing, reliability & ops</h3>
    <ul>
      <li>Unit and integration tests for payment lifecycles and beneficiary eligibility rules.</li>
      <li>Background workers for payment confirmation, retries, and notification batching.</li>
      <li>Centralized logging and alerting for failed disbursements.</li>
    </ul>

    <h3>Reviewer pointers</h3>
    <p>Review <code>backend/src/services/paymentsService.js</code> for idempotent payment orchestration, <code>backend/src/controllers/beneficiariesController.js</code> for role-based flows, and <code>backend/src/jobs/paymentReconciliation.js</code> for retry and settlement logic.</p>
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
  demoUrl: '',
  metrics: { placeholder: true, note: 'replace with beneficiaries onboarded, disbursements processed, failure rate' }
},
{
  title: 'Errando - Digital Errand & Task Fulfillment Platform',
  slug: 'errando',
  summary: 'On-demand errand and task fulfillment platform connecting users with trusted runners and service providers.',
  description: `
    <p><strong>Errando</strong> is a digital errand marketplace that connects users with vetted runners to complete everyday tasks — deliveries, pickups, and local services. The platform was designed to balance speed, trust, and operational clarity for both customers and runners.</p>

    <h3>My role</h3>
    <p>Full-Stack Engineer — owned backend APIs, task lifecycle logic, and payment settlement flows. Contributed to frontend UX decisions around task creation and status tracking.</p>

    <h3>Key features</h3>
    <ul>
      <li>Task creation with location, instructions, budget, and time constraints.</li>
      <li>Runner onboarding, verification, and availability management.</li>
      <li>Task lifecycle state machine (created → accepted → in-progress → completed).</li>
      <li>Escrow-style payment flow with release on completion.</li>
      <li>Ratings and feedback system to build trust.</li>
    </ul>

    <h3>System design</h3>
    <p>React frontend with a Node.js/Express backend. MongoDB stores tasks, users, and dynamic task metadata. A finite state machine enforces valid task transitions to prevent invalid states (e.g. double completion or early payout).</p>

    <p>Payments are handled via M-PESA phone-pay with an internal escrow ledger. Funds are reserved at task acceptance and released only after confirmation, ensuring fairness for both customers and runners.</p>

    <h3>Scalability & performance</h3>
    <ul>
      <li>Indexed queries on geolocation and task status for fast discovery.</li>
      <li>Redis used for short-lived task locks and runner availability caching.</li>
      <li>Background jobs for notifications, payout batching, and cleanup of stale tasks.</li>
    </ul>

    <h3>Security & abuse prevention</h3>
    <ul>
      <li>Rate-limited task creation and messaging endpoints.</li>
      <li>Dispute handling and manual admin overrides for edge cases.</li>
      <li>Audit logs for task and payment state changes.</li>
    </ul>

    <h3>Reviewer pointers</h3>
    <p>Inspect <code>backend/src/services/taskStateMachine.js</code> for lifecycle enforcement, <code>backend/src/services/escrowService.js</code> for payment holding/release logic, and <code>frontend/src/pages/CreateTask.jsx</code> for UX tradeoffs.</p>
  `,
  role: 'Full Stack Engineer',
  stack: ['NextJs', 'NestJs', 'Express', 'PostgreSql', 'Redis', 'M-PESA'],
  year: 2024,
  coverImage: '/images/Errando.png',
  screenshots: [
    '/images/Errando-1.png',
    '/images/Errando-2.png'
  ],
  repoUrl: 'https://github.com/Ivy-Joy/Errando',
  demoUrl: '',
  metrics: { placeholder: true, note: 'replace with tasks completed, avg completion time, repeat users' }
}
];


mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB - seeding');
    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log('Seeded projects');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed error', err);
    process.exit(1);
  });

