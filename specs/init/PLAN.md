# Sprint-Based Development Plan

## Overview
This plan follows an iterative approach where each sprint delivers working, valuable features that build upon each other. The goal is to have a functional application after each sprint that provides immediate business value.

## Sprint Schedule

### Sprint 0: Foundation (1 week)
**Goal**: Set up the development environment and basic infrastructure

**Deliverables**:
- Turborepo monorepo setup with packages/ structure
- Docker Compose configuration
- Database schema with Prisma (including tree categories, allergens enum, flexible pricing)
- Development environment documentation

**Value**: Ready-to-code environment for all future work

**Tech Stack Decision**: Migrated from Nx to Turborepo for simpler configuration and better build reliability. Using SWC for NestJS (as recommended), Vite for React admin, Astro for public site.

---

### Sprint 1: Static Public Site (1 week)
**Goal**: Launch a basic public website

**Features**:
- Static index page with bakery info
- Basic navigation
- Contact information
- Responsive design with Shadcn UI
- v0.dev components for hero section and layout

**Value**: Business has online presence immediately

---

### Sprint 2: Admin Authentication (1 week)
**Goal**: Secure admin access

**Features**:
- NestJS backend with JWT auth
- Admin login page (React + Shadcn UI)
- Session management with TanStack Query + React Context
- Protected admin routes
- v0.dev generated login form
- localStorage token storage (to be upgraded to httpOnly cookies in Sprint 8)

**Value**: Secure foundation for all admin features

**Tech Stack Decisions** (Full TanStack Stack): 
- TanStack Query for server state management (automatic caching, built-in loading/error states)
- TanStack Router for type-safe routing (built-in auth guards, better TypeScript than React Router)
- TanStack Form + Zod for form validation (headless, granular reactivity, type-safe schemas)
- ky for HTTP client (smaller than axios, modern fetch-based, better TypeScript)
- localStorage for tokens in Sprint 2 (simple), httpOnly cookies deferred to Sprint 9

---

### Sprint 3: FAQ (3-4 days)
**Goal**: FAQ content management

**Features**:
- Public FAQ page (Astro with React accordion component)
- Admin CRUD for FAQs (React + Shadcn UI)
- Drag-and-drop reordering
- Published/unpublished status
- v0.dev generated FAQ accordion

**Value**: Better customer information and reduced support burden

---

### Sprint 4: Cake Catalog (Read-Only) (1 week)
**Goal**: Showcase products to customers

**Features**:
- Public cake catalog page (Astro)
- Tree-based category navigation (React island)
- Pagination (React island)
- Beautiful cake cards showing price per kg/item, allergens (v0.dev components, mock data)
- Display pricing type: per kilo (with min weight) or per item (6/12/18 pieces)

**Value**: Customers can browse available cakes with clear pricing and allergen info

---

### Sprint 5: Admin Cake Management (1.5 weeks)
**Goal**: Manage cake inventory

**Features**:
- Admin CRUD for cakes (React + Shadcn UI tables/forms)
- S3 image upload with drag-and-drop
- Tree-structured category management
- Allergen selection (multiple select from predefined list)
- Pricing configuration: per kilo (min weight) or per item (6/12/18 pieces)
- Real-time preview
- v0.dev generated data tables and forms

**Value**: Business can manage their product catalog with flexible pricing options

---

### Sprint 6: Order System (2 weeks)
**Goal**: Accept customer orders

**Features**:
- Order form with weight/quantity selection based on product type (React island with v0.dev form)
- Delivery/pickup selection with address fields for delivery
- Captcha integration
- Email notifications
- Admin order management with status workflow: New → Confirmed → Started → Ready → Picked up/Delivered → Completed
- Admin sets delivery fee and time slot when confirming orders
- Real-time form validation (min weight, valid quantities)

**Value**: Business can receive and manage orders through complete fulfillment cycle

---

### Sprint 7: Gallery (1 week)
**Goal**: Visual showcase

**Features**:
- Public gallery (Astro with React lightbox component)
- Admin CRUD for gallery images (React + Shadcn UI)
- S3/MinIO image upload with drag-and-drop
- Automatic thumbnail generation with sharp
- Image optimization (WebP format)
- Drag-and-drop reordering
- v0.dev gallery components

**Value**: Visual showcase of bakery products and creations

---

### Sprint 8: Admin Dashboard (1 week)
**Goal**: Business insights

**Features**:
- Order statistics (React charts with Recharts)
- Recent orders widget
- Quick actions
- Basic analytics
- v0.dev generated dashboard layout

**Value**: Business owner can monitor performance

---

### Sprint 9: Polish & Enhancement (1 week)
**Goal**: Production readiness

**Features**:
- Performance optimization
- SEO enhancements
- Error handling
- User feedback improvements
- Documentation
- **Security upgrade**: Migrate from localStorage to httpOnly cookies for JWT tokens

**Value**: Professional, production-ready application

---

## Future Sprints (Post-MVP)
- Customer accounts
- Order tracking
- Email marketing
- Advanced analytics
- Monitoring setup (Prometheus/Grafana)
- Multi-language support
- Advanced search
- Inventory management
- Discount codes
- Social media integration

## Key Principles

1. **Each sprint delivers value** - After Sprint 1, the site is live
2. **Progressive enhancement** - Each sprint builds on the previous
3. **Quick feedback loops** - Deploy after each sprint
4. **Risk mitigation** - Technical challenges tackled early
5. **User-centric** - Features prioritized by business value

## Success Metrics

- **Sprint 0**: Development environment fully operational
- **Sprint 1**: Website accessible to public
- **Sprint 2**: Admin can securely log in
- **Sprint 3**: FAQ page live with content management
- **Sprint 4**: Customers can view products
- **Sprint 5**: Admin can manage products
- **Sprint 6**: Orders can be received
- **Sprint 7**: Gallery page live with image management
- **Sprint 8**: Business insights available
- **Sprint 9**: Production-ready with <2s load time

## Risk Management

### Technical Risks
- **S3 Integration**: Test early in Sprint 5 (cakes) and Sprint 7 (gallery)
- **Email Delivery**: Have backup SMTP options
- **Performance**: Monitor from Sprint 1

### Business Risks
- **Scope Creep**: Stick to sprint goals
- **User Adoption**: Get feedback after each sprint
- **Data Loss**: Implement backups in Sprint 0

## Notes
- Total estimated time: 10.5-11 weeks for MVP
- Deploy to staging after each sprint
- Gather user feedback continuously
- Adjust future sprints based on learnings

### Key Business Decisions
- Weight-based pricing with two types: per kilo (min weight, 0.5kg steps) or per item (6/12/18 pieces)
- No product properties affecting price
- Tree-structured categories for better organization
- Allergen tracking as predefined enum list
- Order workflow: New → Confirmed → Started → Ready → Picked up/Delivered → Completed (Admin can cancel at any stage)
- Payment handled outside the system
- Delivery options with admin-set fees and time slots
- **Website language: Russian** 
