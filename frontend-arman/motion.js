/* ==========================================================================
   REDBRIDGE — Motion layer JS
   Vanilla only. One IntersectionObserver, one rAF-throttled scroll listener.
   ========================================================================== */
(function(){

  /* ---------- 1. SCROLLYTELLING: auto-tag groups + reveal on scroll ---------- */
  var groupSelectors = [
    ".bento", ".process", ".donor-strip", ".event-grid",
    ".stat-card", ".footer-cols", ".about-grid"
  ];
  groupSelectors.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){
      // if selector targets a grid wrapper, stagger its direct children;
      // if it targets the card itself (.stat-card), stagger among siblings.
      var isCardItself = sel === ".stat-card";
      var items = isCardItself ? [el] : Array.prototype.slice.call(el.children);
      items.forEach(function(child, i){
        child.classList.add("mo-reveal");
        child.style.setProperty("--mo-i", Math.min(i, 6));
      });
    });
  });
  // section-level fade for anything not already covered
  document.querySelectorAll(".section-head").forEach(function(el){
    el.classList.add("mo-reveal");
  });

  var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!(mq && mq.matches)){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".mo-reveal").forEach(function(el){ io.observe(el); });

    /* ---------- 2. PARALLAX on hero (rAF throttled) ---------- */
    var hero = document.querySelector(".hero");
    if (hero){
      var ticking = false;
      function updateParallax(){
        var rect = hero.getBoundingClientRect();
        // only compute while hero is near/in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight){
          var progress = (0 - rect.top) * 0.18; // slow drift
          hero.style.setProperty("--mo-parallax", progress + "px");
        }
        ticking = false;
      }
      window.addEventListener("scroll", function(){
        if (!ticking){ window.requestAnimationFrame(updateParallax); ticking = true; }
      }, { passive: true });
      updateParallax();

      /* ---------- 3. MORPHING decorative blob ---------- */
      if (!hero.querySelector(".mo-blob")){
        var blob = document.createElement("div");
        blob.className = "mo-blob";
        blob.setAttribute("aria-hidden", "true");
        hero.appendChild(blob);
      }
    }

    /* ---------- 4. COUNT-UP microinteraction for stat numbers ---------- */
    function countUp(el){
      var raw = el.textContent.trim();
      var match = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
      if (!match) return;
      var prefix = match[1], target = parseInt(match[2].replace(/,/g, ""), 10), suffix = match[3];
      if (isNaN(target)) return;
      var dur = 900, start = null;
      function step(ts){
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
    var numEls = document.querySelectorAll(".hero-stat-num, .kpi-num, .stat-card span");
    if (numEls.length){
      var numIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ countUp(entry.target); numIo.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      numEls.forEach(function(el){ numIo.observe(el); });
    }
  }

})();
