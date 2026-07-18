/* ============================================================
   Jozsua Heng — portfolio interactions
   - starfield canvas in the hero (slow drift, gold + blue specks)
   - reveal-on-scroll with per-section stagger
   - animated stat counters
   - nav: solid background after scroll + active section link
   - gentle parallax on framed screenshots
   All effects are skipped when the visitor prefers reduced motion.
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- starfield ---------- */
(function starfield() {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth = canvas.offsetWidth;
    h = canvas.clientHeight = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(220, Math.floor((w * h) / 6500));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      // most stars are cool white-blue; roughly 1 in 6 is warm gold
      gold: Math.random() < 0.17,
      tw: Math.random() * Math.PI * 2,      // twinkle phase
      speed: 0.008 + Math.random() * 0.028,  // drift speed
    }));
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.x -= s.speed;               // slow drift to the left, like sailing
      if (s.x < -2) s.x = w + 2;
      const twinkle = 0.55 + 0.45 * Math.sin(s.tw + t * 0.0012);
      ctx.globalAlpha = twinkle * (s.gold ? 0.9 : 0.65);
      ctx.fillStyle = s.gold ? "#e0b568" : "#c9d4e8";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  if (reducedMotion) {
    // draw one static frame, no animation
    frame(0);
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

  // stagger siblings that arrive together: give each reveal a delay
  // based on its position among .reveal siblings within the same parent
  els.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) =>
      c.classList.contains("reveal")
    );
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${Math.min(i * 0.12, 0.6)}s`);
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
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
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
      const eased = 1 - Math.pow(1 - p, 4); // ease-out-quart
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

/* ---------- nav state ---------- */
(function nav() {
  const navEl = document.getElementById("nav");
  const links = document.querySelectorAll(".nav-links a");
  const sections = Array.from(links).map((a) =>
    document.querySelector(a.getAttribute("href"))
  );

  function onScroll() {
    navEl.classList.toggle("scrolled", window.scrollY > 40);

    // highlight the section currently in the middle of the viewport
    const mid = window.scrollY + window.innerHeight * 0.4;
    let current = -1;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= mid) current = i;
    });
    links.forEach((a, i) => a.classList.toggle("active", i === current));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- gentle parallax on framed screenshots ---------- */
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
      // how far the element's centre is from the viewport centre (-1 .. 1)
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
