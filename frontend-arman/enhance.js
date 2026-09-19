/* ==========================================================================
   REDBRIDGE — Modern UX layer JS
   Lightweight: no frameworks, no per-frame loops beyond native transitions.
   ========================================================================== */
(function(){

  /* ---------- 1. DARK MODE (Liquid Glass Toggle) ---------- */
  var root = document.documentElement;
  var saved = localStorage.getItem("redbridge-theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) root.setAttribute("data-theme", "dark");

  function makeToggle(){
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.innerHTML =
      '<span class="theme-toggle-knob">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2M12 22v-2M4.93 4.93 3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2m20 0h-2M4.93 19.07l-1.42 1.42M20.49 3.51l-1.42 1.42M12 17a5 5 0 100-10 5 5 0 000 10z"/></svg>' +
      '</span>';
    btn.addEventListener("click", function(){
      var isDark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", isDark ? "light" : "dark");
      localStorage.setItem("redbridge-theme", isDark ? "light" : "dark");
    });
    return btn;
  }
  var navActions = document.querySelector(".nav-actions");
  if (navActions) navActions.insertBefore(makeToggle(), navActions.firstChild);
  var drawer = document.getElementById("mobile-drawer");
  if (drawer){
    var hr = document.createElement("hr");
    var wrap = document.createElement("div");
    wrap.style.display = "flex"; wrap.style.alignItems = "center"; wrap.style.justifyContent = "space-between"; wrap.style.padding = "6px 8px";
    wrap.innerHTML = '<span style="font-size:0.9rem;color:var(--slate);font-weight:500;">Dark mode</span>';
    wrap.appendChild(makeToggle());
    drawer.insertBefore(wrap, drawer.firstChild);
    drawer.insertBefore(hr, drawer.children[1]);
  }

  /* ---------- 2. INTERACTIVE BUTTON GLOW (cursor-follow) ---------- */
  document.addEventListener("pointermove", function(e){
    var el = e.target.closest && e.target.closest(".btn-primary, .btn-outline, .btn-ghost");
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* ---------- 3. CONTINUE BUTTON INTERACTION (onboarding) ---------- */
  function wireContinue(btn, onDone){
    if (!btn || btn.dataset.continueWired) return;
    btn.dataset.continueWired = "1";
    var label = document.createElement("span");
    label.className = "btn-continue-label";
    label.textContent = btn.textContent;
    var check = document.createElement("span");
    check.className = "btn-continue-check";
    check.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>';
    var spinner = document.createElement("span");
    spinner.className = "btn-continue-spinner";
    btn.textContent = "";
    btn.classList.add("btn-continue");
    btn.appendChild(label); btn.appendChild(check); btn.appendChild(spinner);

    btn.addEventListener("click", function(e){
      if (btn.classList.contains("is-loading")) { e.stopImmediatePropagation(); return; }
      btn.classList.add("is-loading");
      setTimeout(function(){
        btn.classList.remove("is-loading");
        btn.classList.add("is-success");
        setTimeout(function(){
          btn.classList.remove("is-success");
          label.textContent = btn === lastSlideBtn ? "Get started" : "Next";
          if (onDone) onDone();
        }, 420);
      }, 320);
    }, true); // capture: play animation before existing handlers advance the slide
  }
  var lastSlideBtn = document.getElementById("onboarding-next");
  wireContinue(document.getElementById("onboarding-next"));

  /* ---------- 4. LIQUID GLASS MOBILE TAB BAR ---------- */
  var tabDefs = [
    { name: "home", label: "Home", icon: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>' },
    { name: "dashboard", label: "Dash", icon: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>' },
    { name: "donors", label: "Donors", icon: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>' },
    { name: "requests", label: "Requests", icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' }
  ];
  var bar = document.createElement("div");
  bar.className = "liquid-tabbar";
  bar.setAttribute("role", "tablist");
  var indicator = document.createElement("div");
  indicator.className = "liquid-tabbar-indicator";
  bar.appendChild(indicator);
  var tabEls = tabDefs.map(function(t){
    var el = document.createElement("button");
    el.className = "liquid-tab";
    el.dataset.nav = t.name;
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + t.icon + '</svg><span>' + t.label + '</span>';
    bar.appendChild(el);
    return el;
  });
  var menuTab = document.createElement("button");
  menuTab.className = "liquid-tab";
  menuTab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menu</span>';
  menuTab.addEventListener("click", function(){
    var d = document.getElementById("mobile-drawer");
    if (d) d.classList.toggle("is-open");
  });
  bar.appendChild(menuTab);
  document.body.appendChild(bar);

  function moveIndicator(el){
    if (!el) { indicator.style.width = "0px"; return; }
    indicator.style.width = el.offsetWidth + "px";
    indicator.style.transform = "translateX(" + el.offsetLeft + "px)";
  }
  function setActiveTab(name){
    tabEls.forEach(function(el){ el.classList.toggle("is-active", el.dataset.nav === name); });
    var active = tabEls.find(function(el){ return el.dataset.nav === name; });
    moveIndicator(active);
  }
  tabEls.forEach(function(el){ el.addEventListener("click", function(){ setActiveTab(el.dataset.nav); }); });
  window.addEventListener("resize", function(){
    var current = tabEls.find(function(el){ return el.classList.contains("is-active"); });
    moveIndicator(current || tabEls[0]);
  });
  setTimeout(function(){ setActiveTab("home"); }, 50);

})();
