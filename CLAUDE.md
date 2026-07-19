# CLAUDE.md

## What this project is

**portfolio** — Jozsua Heng's personal portfolio website. A **multi-page**,
dark-themed site (tab-style nav, no hero — a compact resume-style layout,
restructured 2026-07-19 at the user's request after an earlier one-page
version). Pages:

- `index.html` — **Journey**: compact intro block, then the career timeline
  with expanded bullet points per role.
- `venture.html` — **Venture**: Golden Island Cruises.
- `projects.html` — **Projects**: feature rows + fun experiments.
- `about.html` — **About**: education, leadership, toolkit, drives.

All pages share `styles.css`, `script.js`, and the same nav (active tab via
`aria-current="page"`) and contact footer. Presenting:

- **Golden Island Cruises** (the flagship section) — the maritime tourism
  venture Jozsua co-founded in Lombok, Indonesia (Nov 2024). Links out to
  its live site (komododiscoverytour.com) and Tripadvisor page.
- **Side projects** — the live web apps from this shelf, each with a real
  screenshot, a live link and a GitHub link: Cost of Living Map, Visa
  Requirement Explorer, Rostering App, World Art Galleries, Idle Cosmos,
  plus three "for fun" experiments (The Archive, Broetry Generator,
  Thought-Leadership Mad-Libs).
- **Career timeline, education, skills and contact details** — sourced
  from Jozsua's resume (Mater, GSA Management Consulting, freelance Web3
  work, Boss Tradie, Singapore Armed Forces; USyd / UQ / Singapore
  Polytechnic).

This is a **self-contained project**, its own subfolder inside the
`JozsuaHeng` shelf, with its own git history. Work from inside this folder.

## Tech

Plain HTML/CSS/JS — no build step, no framework, no dependencies. Can be
opened straight from `index.html` or hosted on GitHub Pages (`.nojekyll`
included). Google Fonts (Inter + Instrument Serif) is the only external
resource; the site degrades gracefully to system fonts offline.

- `index.html` / `venture.html` / `projects.html` / `about.html` — the four
  pages (see above). Nav and footer markup is duplicated across all four —
  keep them in sync when editing either.
- `styles.css` — design system: dark ink background `#0a0e14`, **ocean-teal
  accent `#6edacb`** (user explicitly vetoed the earlier gold — it reminded
  them of the Boss Tradie logo; don't reintroduce yellows/golds), fonts
  **Fraunces** (display/italic) + **Manrope** (body). Responsive layout,
  reveal/parallax styling, collapsible-timeline styling, the `.illuminate`
  email-glow keyframes, reduced-motion fallbacks.
- `script.js` — IntersectionObserver reveal-on-scroll with stagger,
  animated stat counters, gentle parallax on framed screenshots, and the
  "Get in touch" → `#contact` footer scroll that makes the email button
  glow (`#email-btn` + `.illuminate`). Every effect is disabled under
  `prefers-reduced-motion`.

Key content decisions (user-confirmed 2026-07-19): headline title is
**"Strategy & transformation consultant"**; locations read
**Singapore · Lombok · Sydney · Brisbane**; contact is LinkedIn + GitHub
only (no Instagram); timeline highlights are collapsed `<details>` blocks;
the Venture page lists the six-brand network (Golden Island Cruises,
17Tour Agency, Lombok Tour Booking, Komodo Island Tour .id, Gili Trawangan
Tour & Travel, Bali Gili Fast Boat Official); the Projects page leads with
consulting engagement cards (case studies are placeholders for now).
- `assets/` — screenshots of the live projects, captured with headless
  Chrome and compressed to ~1200px JPEGs. To refresh one:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --hide-scrollbars --window-size=1440,900
  --virtual-time-budget=30000 --screenshot=out.png <url>` then
  `sips -Z 1200 -s format jpeg -s formatOptions 78 out.png --out out.jpg`.
  (Note: the Cost of Living Map only renders its WebGL globe under
  `--virtual-time-budget`, *not* `--timeout`, and without `--disable-gpu`.)

## Content conventions

- Phone number is deliberately **not** on the site (it's public); contact
  is email + LinkedIn + GitHub only.
- Facts (dates, numbers, program names) come from the resume in Google
  Drive ("Joz Resume.pdf", 2026 version) — don't invent or inflate
  figures beyond it.
- Tone: confident but factual; no buzzword filler.

## About the user

Beginner with coding — explain technical terms before using them, and
check before running anything risky (installing software,
deleting/overwriting files, pushing to GitHub, changing git history).
