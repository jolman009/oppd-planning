# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UTRGV Office of Pre-Professional Development (OPPD) planning tools — a React SPA helping students compare prerequisites, timelines, and application processes for Texas professional schools (dental, veterinary, pharmacy).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run lint` — ESLint check
- `npm run preview` — Preview production build locally
- `python generate.py [html-file]` — Generate landscape PDF from HTML using Playwright (defaults to dental guide)

## Architecture

**Stack:** React 19 + Vite 8 + Tailwind CSS 4 + React Router 7 (HashRouter)

**Routing (`src/main.jsx`):** HashRouter with four routes:
- `/` → `home.jsx` (landing hub with cards linking to each tool)
- `/dental` → `dental.jsx` (4 Texas dental schools)
- `/veterinary` → `veterinarian.jsx` (2 Texas vet schools)
- `/pharmacy` → `pharmd.jsx` (9 Texas pharmacy programs)

**Component pattern:** Each planning tool (dental, veterinary, pharmacy) is a single self-contained file following the same structure:
1. **Data arrays** defined at top of file — `SCHOOLS`, `CATEGORIES` (prerequisite groups), `TIMELINE`, application steps/deadlines
2. **BRAND color tokens** object for consistent theming (orange `#F05023`, grays, paper backgrounds)
3. **Small sub-components** inline (e.g., `StatusMark`, `Stat`, `ReqRow`) — not extracted to separate files
4. **Main component** using `useState` (selected schools, active year) and `useMemo` (filtered data, common prerequisites)
5. **Stepped UI sections** — school selection → prerequisites matrix → timeline → application process

To add a new professional school tool: duplicate an existing tool file, update the data arrays, add a route in `main.jsx`, and add a card in `home.jsx`.

**Fonts:** Patua One (display headings via `.font-display`) and Red Hat Display (body text), loaded from Google Fonts in `index.css`.

**React Compiler:** Enabled via `babel-plugin-react-compiler` in `vite.config.js` for automatic optimization.

**No backend or persistent storage** — all school/prerequisite data is hardcoded in component files.

**No test framework configured.**
