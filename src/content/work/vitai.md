---
title: VitAI
publishDate: 2025-01-01 00:00:00
img: ../../images/VitAI.png
img_alt: VitAI app analyzing food product labels with AI-powered nutritional insights
description: |
  An AI-powered nutritional analysis application that uses multimodal LLMs to scan food
  product labels and deliver personalized health recommendations — built across two repos
  with a React PWA frontend and a FastAPI backend.
tags:
  - React
  - TypeScript
  - Python
  - FastAPI
  - AI
  - PostgreSQL
---

## Overview

VitAI is a full-stack AI application that analyzes food product images to extract nutritional information and generate personalized health recommendations. The user takes a photo of a product label; the app runs it through OpenAI's GPT-5.1 Chat multimodal model and returns a structured breakdown of ingredients, nutritional facts, allergens, and a health score with actionable advice.

The project is split into two independent repositories:

- **VitAI Frontend** — React + TypeScript PWA (scaffolded with Lovable, extended independently)
- **VitAI Backend** — FastAPI service (Python 3.11+)

## Frontend Architecture

The frontend was bootstrapped with [Lovable](https://lovable.dev) — an AI-assisted scaffolding tool — and then cloned locally for independent development and customization.

It is a React 18 + TypeScript PWA that communicates with the FastAPI backend via Axios. Key responsibilities:

- **Image upload flow** — users capture or select product label photos and submit them for analysis
- **Nutritional results display** — renders the structured response (product info, nutritional facts, ingredient breakdown, health score and recommendations)
- **Session history** — retrieves the user's past analyses from the backend analytics endpoints
- **Data visualization** — Recharts for cost and usage metrics charts
- **Dark/light mode** — next-themes with system preference detection

## Backend Architecture

The backend is organized around a clean layered architecture:

```
Request → Middleware (session, timing, logging)
    ↓
Routes (HTTP validation, thin handlers)
    ↓
Controllers (business logic orchestration)
    ↓
Services + Repositories (OpenAI / Redis / PostgreSQL)
    ↓
Response ← Middleware (cookies, timing headers)
```

**Controller Layer** — orchestrates workflows without leaking business logic into routes:

- `analysis_controller.py` — image hashing, DB deduplication, OpenAI call, cost calculation, persistence
- `analytics_controller.py` — metrics aggregation, cache hit rates, token usage, cost projections
- `prompt_controller.py` — versioned prompt templates with multi-language support and activation control

**Service Layer** — external integrations:

- `openai_service.py` — multimodal analysis via GPT-5.1 Chat
- `image_service.py` — file upload handling, base64 encoding, image optimization (Pillow)
- `redis_service.py` — API response caching and cache statistics

**Database** — three PostgreSQL tables managed with Alembic + async SQLAlchemy (asyncpg):

| Table                    | Purpose                                                         |
| ------------------------ | --------------------------------------------------------------- |
| `analyses`               | Product analysis results; deduplicated by image hash            |
| `ai_consumption_metrics` | Per-request cost, token usage, response times, cache hits       |
| `prompt_versions`        | Versioned prompt templates with one active version per language |

## Key Technical Decisions

- **FastAPI + async SQLAlchemy 2.0** — all I/O (database, HTTP, Redis) is async, keeping the service non-blocking under concurrent image uploads.
- **Image hashing for deduplication** — identical product images return cached results without a redundant OpenAI call, reducing latency and cost.
- **Anonymous-first design** — session tracking uses UUID v4 cookies so users get history and continuity without requiring an account.
- **Versioned prompts in the database** — prompt templates are stored as activatable versions per language, making prompt iteration and rollback possible without a code deploy.
- **UV package manager** — Rust-based dependency resolution significantly speeds up CI and Docker builds compared to pip.

## Security

- API key authentication with timing-safe comparison (`secrets.compare_digest`)
- Per-key/IP rate limiting via slowapi (20 req/min, 100 req/hour)
- Explicit CORS origin allowlist — no wildcards
- HttpOnly session cookies with Secure flag in production
- Security headers (HSTS, X-Frame-Options, X-XSS-Protection, nosniff)
- Input validation: file type/size limits (10 MB max, JPEG/PNG/WebP)

## Tech Stack

| Layer            | Technology                                                |
| ---------------- | --------------------------------------------------------- |
| Frontend         | React 18, TypeScript, Vite, Tailwind CSS, shadcn-ui (PWA) |
| Backend          | FastAPI, Python 3.11+, UV                                 |
| AI               | OpenAI GPT-5.1 Chat (multimodal)                          |
| Database         | PostgreSQL 15+, SQLAlchemy 2.0 (async), Alembic           |
| Cache            | Redis 7+                                                  |
| Image Processing | Pillow                                                    |
| Rate Limiting    | slowapi                                                   |
| Testing          | pytest + coverage                                         |
| Code Quality     | Ruff (lint + format), pre-commit hooks                    |
| Deployment       | Docker, Render (free tier)                                |
