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
- `resume.html` — **Resume**: the one-page resume rendered natively (source: the resume PDF the user supplied 2026-07-20; keep in sync with future resume updates).

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

- `index.html` / `venture.html` / `projects.html` / `resume.html` — the four
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

Key content decisions (user-confirmed 2026-07-19): intro order is
**Co-founder first**, then "Strategy & transformation consultant · Builder";
locations **Singapore · Lombok · Sydney · Brisbane**; LinkedIn + GitHub only
(no Instagram); timeline highlights are collapsed `<details>` blocks, with
**education entries interleaved** (class `tl-edu`, diamond markers) and
company names linked to their websites; industries are capitalised; GSA is
"Senior Management Consultant · GSA Management Consulting" with **no
"promoted in under two years"** line (user disliked it); **Mater ended May
2026** (past tense); GIC was co-founded **with three local partners**.
The site has a **light/dark theme toggle** (localStorage `theme`, pre-paint
script in each page's <head>) and a floating-speckle canvas backdrop
(`#specks`, drawn in script.js). The Venture page uses real photos scraped
from komododiscoverytour.com (assets/venture/) including an Apple-style
scrollytelling "voyage" section (`.story`), and the six **brands** (user
asked what to call them — "brands", not storefronts) show logos from
assets/brands/ (also sourced from the GIC site). The Projects page leads
with consulting engagement cards, each with an inline SVG line icon
(case studies are placeholders for now). About page includes a Quick facts
card with work rights (Singapore citizen · Australian PR).

2026-08-16 changes: On the Journey page, "with three local partners" was
cut from the About-me prose (still credited in the timeline's GIC
Highlights and on the Venture page — don't remove it from those too).
Each brand card on venture.html is now a **`<div class="brand-card">`**
(not an `<a>`) containing a `.brand-links` row with two separate anchors
(Website + Instagram) — a card can't wrap two links in one `<a>`, so don't
revert to the single-link-wraps-everything pattern. All six Instagram
handles are real, provided by the user directly. The mobile scrollytelling
`.story-media` sticky offset must stay in sync with the *actual* nav
height at each breakpoint — nav wraps to ~107px tall under 640px (nav-links
drop to their own row), so `.story-media { top: ... }` needs a matching
override in the 640px block or the sticky nav bar visibically covers the
top of each image. resume.html now has a print-only `.rs-print-header`
(name + email/LinkedIn/Singapore) since the on-screen page relies on the
site nav for identity, which a standalone PDF export doesn't have.

2026-07-20 content rules (user-directed): **never mention the Singapore
Armed Forces / military service anywhere** on the site (removed from the
About me, timeline and projects cards); no "spreadsheet and a handshake"
line; frame the coding work as **"AI-assisted development with Claude
Code"**, not "web development" or "building software on the side";
timeline items carry briefcase (work) / graduation-cap (education)
`.tl-mark` icons; the About tab was renamed **Resume** (resume.html) and
renders the one-page resume; the resume's phone number stays OFF the
site.
- `assets/` — screenshots of the live projects, captured with headless
  Chrome and compressed to ~1200px JPEGs. To refresh one:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --hide-scrollbars --window-size=1440,900
  --virtual-time-budget=30000 --screenshot=out.png <url>` then
  `sips -Z 1200 -s format jpeg -s formatOptions 78 out.png --out out.jpg`.
  (Note: the Cost of Living Map only renders its WebGL globe under
  `--virtual-time-budget`, *not* `--timeout`, and without `--disable-gpu`.)
- `assets/Jozsua-Heng-Resume-OnePage.pdf` / `-TwoPage.pdf` — downloadable
  resumes on resume.html (`.rs-download` links), generated by printing
  resume.html itself via CDP `Page.printToPDF` (see `@media print` in
  styles.css). **Regenerate after any resume content edit** — headless
  Chrome, `Page.navigate` to the local file, `Page.printToPDF` for the
  one-page tab (default state), then `Runtime.evaluate` to click
  `#rs-tab-2` before a second `Page.printToPDF` call for the two-page tab.
  Two non-obvious things to preserve if you touch this:
  - CSS `zoom` does **not** apply inside `Page.printToPDF`'s rendering path
    (confirmed empirically — visually identical output at zoom 0.72 vs
    0.66). Page-count control has to go through CDP's own `scale` param
    on the `printToPDF` call instead: `0.62` for the one-page tab, `0.75`
    for the two-page tab — both tuned by bisection to the largest (most
    legible) value that still fits the target page count; touching page
    content will likely require re-tuning these.
  - `.reveal` elements never get their scroll-triggered `.in` class during
    print (nothing scrolls the page during `printToPDF`), so anything
    below the fold silently prints blank unless `@media print` forces
    `.reveal { opacity: 1 !important; transform: none !important; }` —
    already in place, don't remove it.
  - `break-inside: avoid` on `.rs-section` (not just `.rs-item`) pushed
    the whole Skills block onto its own near-empty page rather than
    letting it flow naturally — keep `break-inside: avoid` scoped to
    `.rs-item` only.

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
