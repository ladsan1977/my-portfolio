---
title: Vue Resume Generator
publishDate: 2023-05-01 00:00:00
img: ../../images/Resume Generator.png
img_alt: Clean white paper texture representing document generation and professional formatting
description: |
  A full-stack AI-powered tool that generates resumes and cover letters following Canadian
  guidelines, built with Vue 3 on the frontend and a Python backend powered by the Claude API.
tags:
  - Vue.js
  - TypeScript
  - Claude API
---

## Overview

Vue Resume Generator is a full-stack application that uses the Claude API to produce tailored resumes and cover letters based on Canadian professional guidelines. The user provides their information and target role; the backend sends a structured prompt to Claude and returns a polished, ready-to-use document. The project is split into two repositories — a Vue 3 frontend and a dedicated backend service.

## How It Works

1. The user fills in a form with their background, skills, and target position.
2. The frontend sends the data to the backend API.
3. The backend constructs a prompt following Canadian resume and cover letter conventions and calls the Claude API.
4. Claude returns the generated document, which the frontend displays for review and export.

## Technical Stack

**Frontend** — Vue 3 with TypeScript, bundled with Vite. Type-checking uses `vue-tsc`. Unit tests run with Vitest; linting with ESLint.

**Backend** — Python service that interfaces with the Claude API (Anthropic SDK). Responsible for prompt construction, Canadian guideline enforcement, XML response parsing, and JSON formatting for the frontend.

## Design Consideration

Canadian resumes follow specific conventions that differ from US or European formats — no photos, no date of birth, emphasis on measurable achievements, and particular expectations around cover letter tone. Encoding those rules into the backend prompt means the output is consistently on-target without requiring the user to know the guidelines themselves.
