/* ============================================================
   Jozsua Heng — portfolio interactions (shared by all pages)
   - reveal-on-scroll with per-section stagger
   - animated stat counters (venture page)
   - gentle parallax on framed screenshots
   All effects are skipped when the visitor prefers reduced motion.
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ---------- "Get in touch" → scroll to footer, illuminate the email ---------- */
(function contactGlow() {
  const email = document.getElementById("email-btn");
  if (!email) return;

  function glow() {
    // restart the animation even if it already ran
    email.classList.remove("illuminate");
    void email.offsetWidth;
    email.classList.add("illuminate");
  }

  document.querySelectorAll('a[href="#contact"]').forEach((a) => {
    a.addEventListener("click", () => {
      // wait for the smooth scroll to (mostly) arrive before glowing
      setTimeout(glow, reducedMotion ? 0 : 700);
    });
  });

  // also glow when landing directly on a #contact URL
  if (location.hash === "#contact") setTimeout(glow, 400);
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
