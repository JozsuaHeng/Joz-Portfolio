# CLAUDE.md

## What this project is

**portfolio** — Jozsua Heng's personal portfolio website. A single-page,
dark-themed site presenting:

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

- `index.html` — all content and structure.
- `styles.css` — design system (dark background `#0a0d14`, gold accent
  `#e0b568` echoing the Golden Island Cruises brand), responsive layout,
  reveal/parallax styling, reduced-motion fallbacks.
- `script.js` — hero starfield canvas, IntersectionObserver
  reveal-on-scroll with stagger, animated stat counters, nav
  scrolled/active states, gentle parallax on the framed screenshots.
  Every effect is disabled under `prefers-reduced-motion`.
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
