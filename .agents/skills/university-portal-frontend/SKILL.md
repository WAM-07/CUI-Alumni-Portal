---
name: university-portal-frontend
description: Standards, design tokens, and engineering practices for building the COMSATS University Alumni Portal frontend. Enforces a formal, prestigious academic aesthetic, Next.js architecture, and disciplined backend modification protocol with changelog tracking.
---

# University Alumni Portal - Frontend Guidelines

## 1. Core Principles & Boundaries
- **Backend Modification Protocol:**
  - Changes to backend code (`backend/app/*`) are permitted when necessary to support frontend features, fix API bugs, or resolve integration blockers.
  - **Rule 1 (Prior Notice):** Before making any change to the backend, you must explicitly inform the user why the backend edit is needed.
  - **Rule 2 (Mandatory Changelog):** Whenever any backend change is made, it must be immediately recorded in `Alumni_Portal-main/backend_changes.txt` with the following structure:
    1. **File:** The exact file path modified.
    2. **Change:** What code was added, modified, or removed.
    3. **Reason:** Why the change was necessary for frontend integration or system stability.
- **Target Folder:** Strictly write changes in `Alumni_Portal-main/frontend/` and do NOT touch the older `Alumni_Portal/` directory.
- **Respect Folder Structure:** Work strictly within the established `frontend/src/` architecture:
  - `src/app/` (Next.js App Router for pages and layouts)
  - `src/components/` (Modular UI, auth, student, alumni, industry, notifications)
  - `src/hooks/` (Custom React state and query hooks)
  - `src/lib/` (API client, token storage, formatters, validation)
  - `src/providers/` (Auth and query context providers)
  - `src/services/` (Business API service calls)
- If new components or utilities are required, add them within these established directories.

---

## 2. Institutional Visual Identity & Formal Aesthetic

### Tone & Vibe
- **Authoritative, Prestigious, and Formal:** Resembles top-tier university portals (Harvard, Oxford, Stanford) and executive platforms (Workday, Stripe Dashboard).
- **Strictly No Casual Social Media Tropes:** No cartoon emojis, no neon or pastel disco gradients, no chaotic scrolling feeds. Everything is presented in structured cards, data tables, sidebars, and clean modals.

### Curated Color Tokens
- **Primary Navy:** `#0F2942` / `#1E3A8A` (Institutional authority, primary navigation, headings)
- **Primary Hover/Active:** `#173F68` / `#1D4ED8`
- **Secondary Accent:** `#2563EB` (Interactive links, primary buttons)
- **Academic Gold/Bronze:** `#D97706` / `#B45309` (Badges, honours, verification chips)
- **Backgrounds:**
  - Page Background: `#F8FAFC` (Clean slate off-white)
  - Surface/Card Background: `#FFFFFF` (Elevated with subtle hairline borders)
  - Dark Surface / Header: `#0A192F` / `#0F2942`
- **Borders & Dividers:** `#E2E8F0` / `#CBD5E1` (Crisp 1px hairline borders)
- **Typography Colors:**
  - Headings & Labels: `#0F172A` (Deep Slate)
  - Body Text: `#334155` (Slate)
  - Subdued / Muted: `#64748B` (Cool Gray)

### Status Badges & Chips
Use consistent formal status pills across applicant and job workflows:
- **Applied / Pending:** Background `#F1F5F9`, Text `#475569`, Border `#CBD5E1`
- **Reviewing:** Background `#EFF6FF`, Text `#1D4ED8`, Border `#BFDBFE`
- **Shortlisted:** Background `#ECFDF5`, Text `#047857`, Border `#A7F3D0`
- **Hired / Accepted:** Background `#F0FDF4`, Text `#15803D`, Border `#86EFAC`
- **Rejected:** Background `#FEF2F2`, Text `#B91C1C`, Border `#FECACA`

### Typography & Structure
- Authoritative font stack (Inter, Plus Jakarta Sans, or clean system sans-serif).
- Strict typographic hierarchy: clear `h1` for dashboard sections, uppercase tracking for table headers, and medium-weight labels for form fields.

---

## 3. Engineering & Integration Rules

### API Client & Authentication
- Base URL points to FastAPI backend (`http://localhost:8000/api` or configured via `NEXT_PUBLIC_API_URL`).
- Authorization headers (`Authorization: Bearer <token>`) automatically attached by `src/lib/api/client.js`.
- Store JWT tokens securely (localStorage or cookies via `src/lib/auth/token.js`).
- Graceful 401/403 redirection to `/auth/login` when credentials expire.

### Dashboard Layout Structure
- Persistent formal sidebar with role-specific menu items (Dashboard, Profile, Jobs, Applicants, Notifications).
- Top navigation bar featuring the institution branding, quick search, notification bell with unread badge, and user profile avatar dropdown.

### UX States
- **Loading:** Display subtle skeleton card placeholders, never jarring layout jumps.
- **Empty States:** Structured empty state cards with an icon, formal description, and primary action button (e.g. *"No job postings found. Create your first listing to start receiving applications"*).
- **Error Handling:** Clean, dismissible toast notifications or inline field alerts for FastAPI validation errors.
