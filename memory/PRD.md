# Utkarsh Corporation — Product Requirements Document

## Problem Statement
Build a full-featured e-commerce website for an Ayurvedic products company "Utkarsh Corporation" (reference: utkarshcorporation.com). We sell Ayurvedic medicines, herbal supplements, and organic wellness products; organize offline health camps run by Ayurvedic doctors; and offer a "become a distributor" program. Mission: "progress for every family through health", in the spirit of "Local for Vocal".

## Tech Stack
- Frontend: React (CRA) + Tailwind + shadcn/ui + Sonner + Lucide + React Router
- Backend: FastAPI + Motor (MongoDB) + JWT (PyJWT) + bcrypt
- Database: MongoDB (existing MONGO_URL)

## User Personas
1. Health-conscious customer — buys Ayurvedic products, wants trust/authenticity, reads reviews.
2. Local family — attends free health camps, wants doctor consult, discovers products.
3. Aspiring entrepreneur — applies as a distributor.
4. Admin (Utkarsh Corp) — manages catalog, orders, camps, and inquiries.

## Core Requirements (P0)
- Product catalog (categories, filters, search, sort, detail)
- Cart (localStorage persistent)
- Checkout with COD + Razorpay (MOCKED — endpoint returns simulated success)
- JWT-based auth (email + password)
- Admin dashboard: products / orders / camps / inquiries
- Health camps listing + registration
- Distributor inquiry form
- Contact form + policy pages
- User account with orders/wishlist/addresses
- Floating WhatsApp button (wa.me link)

## Implemented (2026-02)
- 18 seeded Ayurvedic products across 6 categories; 4 upcoming health camps
- All backend endpoints (auth, catalog, reviews, orders, misc, admin) — 100% test pass
- All 15 frontend pages including admin dashboard with product CRUD
- Newsletter + contact + distributor + camp registration forms
- Design system: earthy deep-green / gold / cream palette, Cormorant Garamond + Manrope fonts
- Access control on GET /api/orders/{id} — no PII leak
- Testing agent verified: backend 32/32 pytest, frontend ~95% (all critical flows)

## Deferred / Backlog

### P1 — Next iteration
- Real Razorpay integration (waiting on Razorpay Key ID + Key Secret from user)
- OTP phone login (Twilio/Emergent SMS)
- Email + WhatsApp order notifications (SendGrid + WhatsApp Business API)
- Blog / Health Tips CMS section with rich text
- Product review moderation & verified purchase badge
- Sitemap.xml, robots.txt, dynamic SEO meta per page

### P2 — Future
- Order tracking via courier API
- Loyalty / reward points program
- Multi-address quick-select at checkout
- Bulk product import (CSV)
- Advanced analytics dashboard for admin (revenue trends, top products)
- Multi-language support (Hindi + Marathi)

## Test Credentials
- Admin: `admin@utkarshcorp.com` / `Admin@123`
- Test customer: create via `/register` (see /app/memory/test_credentials.md)

## Key Files
- Backend: `/app/backend/{server,models,auth_utils,routes_auth,routes_products,routes_orders,routes_misc,seed_data}.py`
- Frontend: `/app/frontend/src/{App.js,pages/*.jsx,components/*.jsx,context/*.jsx,lib/api.js}`
