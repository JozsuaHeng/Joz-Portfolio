/* ============================================================
   Jozsua Heng — portfolio interactions (shared by all pages)
   - light/dark theme toggle (persisted in localStorage)
   - floating speckle backdrop canvas
   - reveal-on-scroll with per-section stagger
   - animated stat counters (venture page)
   - scrollytelling driver for the venture "voyage" section
   - "Get in touch" scroll + email glow
   - gentle parallax on tagged elements
   All effects are skipped when the visitor prefers reduced motion.
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- theme toggle ---------- */
(function theme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  });
})();

/* ---------- floating speckles ---------- */
(function speckles() {
  const canvas = document.getElementById("specks");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let specks = [];
  let w = 0, h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(150, Math.floor((w * h) / 9000));
    specks = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      teal: Math.random() < 0.14,          // a few take the accent colour
      tw: Math.random() * Math.PI * 2,     // twinkle phase
      vx: -(0.006 + Math.random() * 0.02), // slow drift left
      vy: -(0.003 + Math.random() * 0.012) // and gently upward
    }));
  }

  function frame(t) {
    const light = document.documentElement.dataset.theme === "light";
    ctx.clearRect(0, 0, w, h);
    for (const s of specks) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -2) s.x = w + 2;
      if (s.y < -2) s.y = h + 2;
      const twinkle = 0.5 + 0.5 * Math.sin(s.tw + t * 0.0011);
      const base = s.teal ? 0.5 : 0.32;
      ctx.globalAlpha = twinkle * base * (light ? 0.9 : 1);
      ctx.fillStyle = s.teal
        ? (light ? "#0d8577" : "#6edacb")
        : (light ? "#233029" : "#cfd8e2");
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!document.hidden && !reducedMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  if (reducedMotion) {
    frame(0); // one static frame for depth, no animation
  } else {
    requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) requestAnimationFrame(frame);
    });
  }
})();

/* ---------- reveal on scroll (with stagger) ---------- */
(function reveals() {
  const els = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  els.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) =>
      c.classList.contains("reveal")
    );
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${Math.min(i * 0.1, 0.5)}s`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------- animated counters ---------- */
(function counters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (reducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.5 }
  );
  nums.forEach((el) => io.observe(el));
})();

/* ---------- scrollytelling (venture "voyage") ---------- */
(function story() {
  const stories = document.querySelectorAll(".story");
  stories.forEach((wrap) => {
    const steps = wrap.querySelectorAll(".step");
    const imgs = wrap.querySelectorAll(".story-media img");
    if (!steps.length || !imgs.length) return;

    function activate(i) {
      steps.forEach((s, j) => s.classList.toggle("active", j === i));
      imgs.forEach((img, j) => img.classList.toggle("active", j === i));
    }
    activate(0);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      steps.forEach((s) => s.classList.add("active"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activate(Array.from(steps).indexOf(entry.target));
          }
        }
      },
      { threshold: 0.55 }
    );
    steps.forEach((s) => io.observe(s));
  });
})();

/* ---------- resume one-page / two-page toggle ---------- */
(function resumeToggle() {
  const tabs = document.querySelectorAll(".rs-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("active")) return;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });

      tabs.forEach((t) => {
        const panel = document.getElementById(t.dataset.target);
        if (!panel) return;
        const show = t === tab;
        panel.hidden = !show;
        if (show) {
          // manual switch, not a scroll discovery — reveal immediately,
          // since these elements may never have intersected the viewport
          // while their panel was display:none
          panel.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
        }
      });
    });
  });
})();

/* ---------- "Get in touch" → scroll to footer, illuminate the email ---------- */
(function contactGlow() {
  const email = document.getElementById("email-btn");
  if (!email) return;

  function glow() {
    email.classList.remove("illuminate");
    void email.offsetWidth;
    email.classList.add("illuminate");
  }

  document.querySelectorAll('a[href="#contact"]').forEach((a) => {
    a.addEventListener("click", () => {
      setTimeout(glow, reducedMotion ? 0 : 700);
    });
  });

  if (location.hash === "#contact") setTimeout(glow, 400);
})();

/* ---------- gentle parallax on tagged elements ---------- */
(function parallax() {
  if (reducedMotion) return;
  const items = document.querySelectorAll(".parallax");
  if (!items.length) return;

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const speed = parseFloat(el.dataset.speed || "0.05");
      const offset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      el.style.transform = `translateY(${(-offset * speed * 100).toFixed(1)}px)`;
    });
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
})();
