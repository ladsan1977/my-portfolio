---
title: Relo Sale Hub
publishDate: 2023-10-01 00:00:00
img: ../../images/Relocation.png
img_alt: Modern city skyline softly blurred representing the real estate and relocation market
description: |
  A bilingual (Spanish/English) relocation sale marketplace built with React and Supabase.
  Sellers list items, buyers browse and submit offers, and an admin dashboard handles
  full product and offer management.
tags:
  - React
  - TypeScript
  - Supabase
---

## Overview

Relo Sale Hub is a bilingual (Spanish/English) marketplace built for relocation sales — a context where sellers need a quick, trustworthy way to list household items and buyers need to browse and make offers without friction. There is no custom backend server; all persistence, storage, and authentication run through Supabase, keeping the stack lean and the admin surface minimal.

## Core Functionality

- **Public catalog** — responsive product grid with image galleries, availability badges, and prices displayed in COP.
- **Product detail page** — multi-image lightbox, offer submission form, and sold indicator.
- **Admin dashboard** — protected CRUD interface for products and a read-only offer inbox; no account required to submit an offer.
- **Image management** — multi-image upload per product with main image selection, stored in Supabase Storage.
- **Offer system** — buyers submit offers without an account; admins review them in the dashboard.
- **Fallback mock data** — catalog degrades gracefully to sample data if Supabase is unreachable, enabling demos and local development without a live project.

## Technical Stack

Built with React 18 and TypeScript, bundled with Vite + SWC for fast iteration. React Router 6 handles client-side navigation; TanStack React Query 5 manages all server state with built-in caching and background refetching. The UI is composed from shadcn/ui primitives (Radix UI) styled with Tailwind CSS 3. Forms use React Hook Form and Zod for schema validation; Sonner handles toast notifications.

The service layer (`productService`, `offerService`) abstracts all Supabase calls from the UI, making the backend easy to test or swap. React Query cache is invalidated after every mutation to keep the admin table in sync.

## Architecture

The app is a single-page application that communicates directly with Supabase from the browser — no middleware layer to maintain. Supabase Row-Level Security policies enforce access control: product writes require an authenticated admin session; offer inserts are public.

```
Browser (React SPA)
    │
    ├── React Router ──► Pages (Catalog, ProductDetail, Admin)
    │
    ├── TanStack React Query ──► Services
    │                                │
    │                                └── Supabase JS Client
    │                                          │
    │                              ┌───────────┴───────────┐
    │                         Postgres DB            Storage Bucket
    │                         (products, offers)     (product images)
    │
    └── Supabase Auth ──► Admin session management
```

## Design Consideration

Target users are often navigating a high-stress relocation under time pressure. The catalog prioritizes visual clarity — large images, clear availability states, and prices in the local currency (COP via `Intl.NumberFormat('es-CO')`) so buyers can assess items at a glance and submit an offer in seconds.
