---
title: Budget Flow
publishDate: 2024-02-01 00:00:00
img: ../../images/Budget Buddy.png
img_alt: Soft abstract blue and purple gradient representing financial data visualization
description: |
  A personal finance management app for tracking income, fixed and variable expenses,
  accounts, and monthly budgets — built with React 19, TanStack Router, TanStack Query,
  and Supabase.
tags:
  - React
  - TypeScript
  - Supabase
---

## Overview

Budget Flow is a personal finance management app for tracking income, fixed and variable expenses, bank accounts, and monthly budgets. The focus was on building a tool that stays out of the way: fast navigation, a clean responsive layout (desktop sidebar / mobile bottom nav), and data that updates across views without manual synchronization.

## Core Features

- **Dashboard** — Monthly cash flow overview with circular gauges, expense breakdowns, and flow composition charts.
- **Transactions** — Filterable list of income, expenses (fixed/variable), and transfers between accounts.
- **Fixed Expenses** — Recurring monthly expenses with paid/pending tracking and one-click bulk replication to the next month.
- **Variable Budget** — Monthly spending target with per-category progress tracking.
- **Categories & Accounts** — Customizable expense/income categories with icons and colors; bank accounts and cash wallets with default account support.
- **Reports** — Income vs. expenses trend charts and projected cash flow analysis.
- **Authentication** — Supabase Auth with Row-Level Security enforcing data isolation at the database level.

## Technical Stack

Built with React 19 and TypeScript 5.9, bundled with Vite 7. Routing uses TanStack Router v1 (file-based, fully type-safe — a route typo is a compile error). TanStack Query v5 manages all server state with automatic deduplication, background refetching, and targeted cache invalidation. The UI combines Tailwind CSS 3.4, Framer Motion for animations, and Recharts for data visualization. Supabase handles PostgreSQL persistence, file storage, and authentication.

## Architecture

The app communicates directly with Supabase from the browser — no custom backend. Three strict layers keep concerns separated:

- **Services** (`src/services/`) — pure TypeScript functions that call Supabase and map database rows to domain types. Zero React imports; testable in isolation.
- **Hooks** (`src/hooks/`) — bind service functions to TanStack Query. Zero JSX. Encode domain rules like "the `budgets` table has one row per user per month."
- **Pages** (`src/pages/`) — subscribe to hooks and render. No Supabase imports, no business logic.

Cross-view synchronization works entirely through cache invalidation: when a mutation succeeds, `queryClient.invalidateQueries(key)` marks affected keys stale, and every subscribed component re-fetches automatically. No global reducer, no manual dispatch, no prop drilling.

React Context is used only for client-only state that has no place in the server cache: the Supabase auth session, the currently selected month, and the global transaction modal.

## Security

The Supabase Row-Level Security policies on the database server enforce that users can only read and write their own rows. The frontend `.eq('user_id', userId)` filter is a performance optimization, not the security boundary.

## What I Learned

This project shifted my mental model from "manage state, keep views in sync" to "describe what data you need and let the cache handle coherence." TanStack Query replaced ~20 lines of manual `useEffect` + `useState` per feature with a single hook call that handles loading, error, deduplication, and background refresh automatically — and keeps unrelated components in sync with no extra wiring.
