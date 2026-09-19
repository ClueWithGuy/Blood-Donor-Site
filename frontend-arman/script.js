/* ==========================================================================
   REDBRIDGE — app logic
   Namespaced as RB.* to keep everything modular in one file.
   ========================================================================== */
(function () {
"use strict";

/* ------------------------------------------------------------------------
   0. RAW PROJECT DATA (as supplied) + derived fields for the demo
   ------------------------------------------------------------------------ */
const classmatesData = [
  { id: "1066", name: "Tanim", section: "E", bloodGroup: "A+", phone: "", role: "Student", isActive: false },
  { id: "1170", name: "Arman", section: "E", bloodGroup: "A+", phone: "+8801857-786242", role: "Student", isActive: false },
  { id: "1173", name: "Debashish", section: "E", bloodGroup: "B+", phone: "+8801629-260953", role: "Student", isActive: false },
  { id: "1174", name: "Puspita", section: "E", bloodGroup: "B+", phone: "", role: "Student", isActive: false },
  { id: "1175", name: "Imtiaz", section: "E", bloodGroup: "B+", phone: "+8801537-708966", role: "Student", isActive: false },
  { id: "1176", name: "Kawsar", section: "E", bloodGroup: "O+", phone: "+8801608-269877", role: "Student", isActive: false },
  { id: "1178", name: "Mahfuz", section: "E", bloodGroup: "O+", phone: "+8801747-657051", role: "Student", isActive: false },
  { id: "1179", name: "Ispa", section: "E", bloodGroup: "O+", phone: "+8801842-246839", role: "Student", isActive: false },
  { id: "1180", name: "Minhaz", section: "E", bloodGroup: "O+", phone: "+8801685-429628", role: "Student", isActive: false },
  { id: "1181", name: "Nimmi", section: "E", bloodGroup: "O+", phone: "+8801616-876919", role: "Student", isActive: false },
  { id: "1182", name: "Emon", section: "E", bloodGroup: "O+", phone: "+8801720-854616", role: "Student", isActive: false },
  { id: "1183", name: "Adia", section: "E", bloodGroup: "B+", phone: "", role: "Student", isActive: false },
  { id: "1186", name: "Arnab", section: "E", bloodGroup: "AB+", phone: "+8801723-052343", role: "Student", isActive: false },
  { id: "1187", name: "Iftiar", section: "E", bloodGroup: "AB+", phone: "+8801865-467007", role: "Student", isActive: false },
  { id: "1188", name: "Roktim", section: "E", bloodGroup: "B+", phone: "+8801690-150201", role: "Student", isActive: false },
  { id: "1189", name: "Dipta", section: "E", bloodGroup: "B+", phone: "+8801832-979911", role: "Student", isActive: false },
  { id: "1190", name: "Srikhanta", section: "E", bloodGroup: "O+", phone: "+8801623-374919", role: "Student", isActive: false },
  { id: "1191", name: "Samu", section: "E", bloodGroup: "A+", phone: "+8801871-843122", role: "Student", isActive: false },
  { id: "1192", name: "Hima", section: "E", bloodGroup: "A+", phone: "+8801615-897530", role: "Student", isActive: false },
  { id: "1193", name: "Tasin", section: "E", bloodGroup: "O+", phone: "+8801844-854013", role: "Student", isActive: false },
  { id: "1194", name: "Saad", section: "E", bloodGroup: "A+", phone: "+8801812-519880", role: "CR", isActive: false },
  { id: "1195", name: "Shajia", section: "E", bloodGroup: "O+", phone: "+8801881-195469", role: "Student", isActive: false },
  { id: "1196", name: "Fairuj", section: "E", bloodGroup: "O+", phone: "+8801854-071334", role: "Student", isActive: false },
  { id: "1197", name: "Rafi", section: "E", bloodGroup: "B+", phone: "+8801889-782354", role: "Student", isActive: false },
  { id: "1200", name: "Ahona", section: "E", bloodGroup: "A+", phone: "+8801869-985425", role: "Co-CR", isActive: false },
  { id: "1201", name: "Shaown", section: "E", bloodGroup: "O+", phone: "+8801877-952035", role: "Student", isActive: false },
  { id: "1202", name: "Roki", section: "E", bloodGroup: "B+", phone: "+8801879-063378", role: "Student", isActive: false },
  { id: "1203", name: "Kabbu", section: "E", bloodGroup: "O+", phone: "+8801816-283480", role: "Student", isActive: false },
  { id: "1205", name: "Saimon", section: "E", bloodGroup: "AB+", phone: "+8801878-745423", role: "Student", isActive: false },
  { id: "1206", name: "Habib", section: "E", bloodGroup: "O+", phone: "+8801613-544655", role: "Student", isActive: false },
  { id: "1208", name: "Tirtha", section: "E", bloodGroup: "A+", phone: "+8801846-968271", role: "Student", isActive: false },
  { id: "1209", name: "Mim", section: "E", bloodGroup: "O+", phone: "+8801309-239026", role: "Student", isActive: false }
];

// Campus reference point used to fabricate believable nearby coordinates (Chattogram).
const CAMPUS_LAT = 22.3569, CAMPUS_LNG = 91.7832;

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function hashStr(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

const AVATAR_PALETTE = ["#A8112D", "#6B0F1A", "#C97A2B", "#2F8F5B", "#6E5B5E", "#8A3B1F"];

const donors = classmatesData.map((c) => {
  const rnd = seededRandom(hashStr(c.id));
  const distanceKm = +(rnd() * 12 + 0.3).toFixed(1);
  const angle = rnd() * Math.PI * 2;
  const lat = CAMPUS_LAT + (distanceKm / 111) * Math.cos(angle);
  const lng = CAMPUS_LNG + (distanceKm / 111) * Math.sin(angle);
  const donationCount = c.bloodGroup !== "Unknown" ? Math.floor(rnd() * 5) : 0;
  return {
    ...c,
    initial: c.name.charAt(0).toUpperCase(),
    color: AVATAR_PALETTE[hashStr(c.name) % AVATAR_PALETTE.length],
    distanceKm,
    lat, lng,
    donationCount,
    lastDonation: donationCount > 0 ? `${Math.floor(rnd() * 10) + 1} months ago` : "No donations yet",
    isActive: c.isActive
  };
});

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const COMPAT = {
  "O-": ["O-"], "O+": ["O-","O+"],
  "A-": ["O-","A-"], "A+": ["O-","O+","A-","A+"],
  "B-": ["O-","B-"], "B+": ["O-","O+","B-","B+"],
  "AB-": ["O-","A-","B-","AB-"], "AB+": BLOOD_GROUPS.slice()
};

/* ------------------------------------------------------------------------
   1. STORAGE LAYER
   ------------------------------------------------------------------------ */
const LS = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
};
const KEYS = {
  USER: "rb_current_user",
  OVERRIDES: "rb_donor_overrides",
  REQUESTS: "rb_requests",
  HISTORY: "rb_donation_history",
  ONBOARDED: "rb_onboarded",
  NOTIFS: "rb_notifications",
  READ_THREADS: "rb_read_threads"
};

function getOverrides() { return LS.get(KEYS.OVERRIDES, {}); }
function setOverride(id, patch) {
  const o = getOverrides();
  o[id] = { ...(o[id] || {}), ...patch };
  LS.set(KEYS.OVERRIDES, o);
}
function donorWithOverride(d) {
  const o = getOverrides()[d.id];
  return o ? { ...d, ...o } : d;
}
function allDonors() { return donors.map(donorWithOverride); }

function getUser() { return LS.get(KEYS.USER, null); }
function setUser(u) { LS.set(KEYS.USER, u); }

function seedRequestsIfEmpty() {
  const existing = LS.get(KEYS.REQUESTS, null);
  if (existing) return existing;
  const now = Date.now();
  const seeded = [
    { id: "req1", patient: "Nusrat Jahan", bloodGroup: "O-", units: 2, hospital: "Chattogram Medical College Hospital", urgent: true, status: "open", notes: "Post-surgery, needed within 6 hours.", created: now - 1000 * 60 * 40 },
    { id: "req2", patient: "Kamal Hossain", bloodGroup: "B+", units: 1, hospital: "Evercare Hospital Chattogram", urgent: false, status: "open", notes: "Scheduled transfusion tomorrow morning.", created: now - 1000 * 60 * 60 * 5 },
    { id: "req3", patient: "Rina Begum", bloodGroup: "A+", units: 3, hospital: "Chittagong Maa-O-Shishu Hospital", urgent: false, status: "progress", notes: "One donor confirmed, two more needed.", created: now - 1000 * 60 * 60 * 20 },
    { id: "req4", patient: "Farhan Ahmed", bloodGroup: "AB+", units: 1, hospital: "Bangladesh Eye Hospital", urgent: false, status: "fulfilled", notes: "Thank you to all responders.", created: now - 1000 * 60 * 60 * 60 }
  ];
  LS.set(KEYS.REQUESTS, seeded);
  return seeded;
}
function getRequests() { return LS.get(KEYS.REQUESTS, []); }
function saveRequests(list) { LS.set(KEYS.REQUESTS, list); }

/* ------------------------------------------------------------------------
   2. TOASTS
   ------------------------------------------------------------------------ */
const toastStack = document.getElementById("toast-stack");
function toast(message, type) {
  const el = document.createElement("div");
  el.className = "toast" + (type ? ` toast--${type}` : "");
  el.textContent = message;
  toastStack.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(6px)"; setTimeout(() => el.remove(), 250); }, 3200);
}

/* ------------------------------------------------------------------------
   3. MODAL SYSTEM
   ------------------------------------------------------------------------ */
const modalRoot = document.getElementById("modal-root");
const modalScrim = document.getElementById("modal-scrim");
function openModal(html) {
  modalRoot.innerHTML = `<div class="modal-card">${html}</div>`;
  modalRoot.style.pointerEvents = "auto";
  modalScrim.classList.add("is-open");
  document.body.style.overflow = "hidden";
  const closeBtn = modalRoot.querySelector("[data-modal-close]");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}
function closeModal() {
  modalRoot.style.pointerEvents = "none";
  modalScrim.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => { modalRoot.innerHTML = ""; }, 200);
}
modalScrim.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ------------------------------------------------------------------------
   4. AUTH MODALS
   ------------------------------------------------------------------------ */
function donorOptionsHtml() {
  return donors.map(d => `<option value="${d.id}">${d.name} (#${d.id}) — ${d.bloodGroup}</option>`).join("");
}

function renderSignIn() {
  openModal(`
    <div class="modal-head">
      <div><h2>Welcome back</h2><p class="muted">Sign in to manage your availability and requests.</p></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <form id="signin-form">
      <div class="form-field">
        <label for="si-email">Email or phone</label>
        <input id="si-email" type="text" required placeholder="you@campus.edu">
      </div>
      <div class="form-field">
        <label for="si-pass">Password</label>
        <input id="si-pass" type="password" required placeholder="••••••••">
      </div>
      <div style="text-align:right;margin-bottom:16px;">
        <button type="button" class="btn-text" id="forgot-open" style="padding:0;">Forgot password?</button>
      </div>
      <button class="btn-primary btn-block" type="submit">Sign in</button>
    </form>
    <p class="modal-footer-text">New to Drop For Life? <button id="switch-signup">Create an account</button></p>
  `);
  document.getElementById("switch-signup").addEventListener("click", renderSignUp);
  document.getElementById("forgot-open").addEventListener("click", renderForgotPassword);
  document.getElementById("signin-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("si-email").value.trim();
    let user = getUser();
    if (!user) {
      user = { name: email.split("@")[0] || "Donor", email, bloodGroup: "O+", linkedId: null };
      setUser(user);
    }
    closeModal();
    onAuthed();
    toast(`Welcome back, ${user.name}.`, "success");
  });
}

function renderSignUp() {
  openModal(`
    <div class="modal-head">
      <div><h2>Join as a donor</h2><p class="muted">Takes under a minute. You can change availability anytime.</p></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <form id="signup-form">
      <div class="form-field">
        <label for="su-name">Full name</label>
        <input id="su-name" type="text" required placeholder="Your name">
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="su-email">Email</label>
          <input id="su-email" type="email" required placeholder="you@campus.edu">
        </div>
        <div class="form-field">
          <label for="su-phone">Phone</label>
          <input id="su-phone" type="tel" placeholder="+8801XXXXXXXXX">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="su-group">Blood group</label>
          <select id="su-group" required>
            <option value="">Select</option>
            ${BLOOD_GROUPS.map(g => `<option value="${g}">${g}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label for="su-link">That's me in the directory</label>
          <select id="su-link"><option value="">Not listed</option>${donorOptionsHtml()}</select>
        </div>
      </div>
      <div class="form-field">
        <label for="su-pass">Password</label>
        <input id="su-pass" type="password" required minlength="6" placeholder="At least 6 characters">
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="su-terms" required>
        <label for="su-terms">I agree this directory is mutual-aid only — no payment for donation.</label>
      </div>
      <button class="btn-primary btn-block" type="submit">Create account</button>
    </form>
    <p class="modal-footer-text">Already registered? <button id="switch-signin">Sign in</button></p>
  `);
  document.getElementById("switch-signin").addEventListener("click", renderSignIn);
  document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const linkedId = document.getElementById("su-link").value || null;
    pendingSignup = {
      name: document.getElementById("su-name").value.trim(),
      email: document.getElementById("su-email").value.trim(),
      phone: document.getElementById("su-phone").value.trim(),
      bloodGroup: document.getElementById("su-group").value,
      linkedId
    };
    renderOtp();
  });
}

let pendingSignup = null;
let pendingResetEmail = null;

function renderOtp() {
  openModal(`
    <div class="modal-head">
      <div><h2>Verify your number</h2><p class="muted">Enter the 4-digit code we texted you. (Demo code: <strong>1234</strong>)</p></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <form id="otp-form">
      <div class="otp-inputs">
        ${[0,1,2,3].map(i => `<input maxlength="1" inputmode="numeric" class="otp-digit" data-i="${i}">`).join("")}
      </div>
      <p class="form-error" id="otp-error" style="display:none;text-align:center;">Incorrect code — try again.</p>
      <button class="btn-primary btn-block" type="submit">Verify & continue</button>
      <p class="modal-footer-text" style="margin-top:14px;">Didn't get it? <button type="button" id="otp-resend">Resend code</button></p>
    </form>
  `);
  const digits = [...modalRoot.querySelectorAll(".otp-digit")];
  digits.forEach((d, i) => {
    d.addEventListener("input", () => { if (d.value && digits[i+1]) digits[i+1].focus(); });
    d.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !d.value && digits[i-1]) digits[i-1].focus(); });
  });
  digits[0].focus();
  document.getElementById("otp-resend").addEventListener("click", () => toast("New code sent (demo): 1234"));
  document.getElementById("otp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = digits.map(d => d.value).join("");
    if (code !== "1234") {
      document.getElementById("otp-error").style.display = "block";
      return;
    }
    if (pendingSignup) {
      setUser(pendingSignup);
      pendingSignup = null;
      closeModal();
      onAuthed();
      toast("Account verified — welcome to RedBridge.", "success");
    } else if (pendingResetEmail) {
      renderResetPassword();
    }
  });
}

function renderForgotPassword() {
  openModal(`
    <div class="modal-head">
      <div><h2>Reset your password</h2><p class="muted">We'll send a verification code to confirm it's you.</p></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <form id="forgot-form">
      <div class="form-field">
        <label for="fp-email">Email or phone</label>
        <input id="fp-email" type="text" required placeholder="you@campus.edu">
      </div>
      <button class="btn-primary btn-block" type="submit">Send code</button>
    </form>
  `);
  document.getElementById("forgot-form").addEventListener("submit", (e) => {
    e.preventDefault();
    pendingResetEmail = document.getElementById("fp-email").value.trim();
    toast("Verification code sent (demo): 1234");
    renderOtp();
  });
}

function renderResetPassword() {
  openModal(`
    <div class="modal-head">
      <div><h2>Set a new password</h2><p class="muted">Make it something you haven't used here before.</p></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <form id="reset-form">
      <div class="form-field">
        <label for="rp-pass">New password</label>
        <input id="rp-pass" type="password" required minlength="6" placeholder="At least 6 characters">
      </div>
      <div class="form-field">
        <label for="rp-pass2">Confirm password</label>
        <input id="rp-pass2" type="password" required minlength="6" placeholder="Repeat password">
      </div>
      <button class="btn-primary btn-block" type="submit">Update password</button>
    </form>
  `);
  document.getElementById("reset-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const p1 = document.getElementById("rp-pass").value, p2 = document.getElementById("rp-pass2").value;
    if (p1 !== p2) { toast("Passwords don't match.", "error"); return; }
    pendingResetEmail = null;
    closeModal();
    toast("Password updated — sign in with your new password.", "success");
    renderSignIn();
  });
}

function renderInfoModal(title, bodyHtml) {
  openModal(`
    <div class="modal-head">
      <div><h2>${title}</h2></div>
      <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <div style="font-size:0.92rem;color:var(--slate);">${bodyHtml}</div>
  `);
}

/* ------------------------------------------------------------------------
   5. NAV / SPA ROUTING
   ------------------------------------------------------------------------ */
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("[data-nav]");
function goTo(name) {
  views.forEach(v => v.classList.toggle("is-active", v.dataset.view === name));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("is-active", l.dataset.nav === name));
  document.getElementById("mobile-drawer").classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "dashboard") renderDashboard();
  if (name === "donors") renderDonorGrid();
  if (name === "requests") renderRequestsView();
  if (name === "banks") renderBanks();
  if (name === "events") renderEvents();
}
navLinks.forEach(btn => btn.addEventListener("click", () => goTo(btn.dataset.nav)));

document.getElementById("nav-burger").addEventListener("click", () => {
  document.getElementById("mobile-drawer").classList.toggle("is-open");
});

/* ------------------------------------------------------------------------
   6. AUTH STATE / GATING
   ------------------------------------------------------------------------ */
function requireAuth(action) {
  const u = getUser();
  if (u) { action(u); return; }
  toast("Sign in first to do that.");
  window.location.href = "login.html";
}
function onAuthed() {
  const u = getUser();
  document.getElementById("auth-links")?.classList.add("hidden");
  document.getElementById("auth-links-m")?.classList.add("hidden");
  document.getElementById("profile-chip")?.classList.remove("hidden");
  const initialEl = document.getElementById("profile-initial");
  if (initialEl) initialEl.textContent = (u.name || "?").charAt(0).toUpperCase();
  renderDashboard();
}
function refreshAuthUI() {
  const u = getUser();
  if (u) onAuthed();
}

/* Sign in / Join / Register links are now real pages (login.html, register.html)
   instead of modals — see login.html and register.html for their own small
   scripts. Nothing to wire up here anymore. */

document.getElementById("profile-chip")?.addEventListener("click", () => { window.location.href = "dashboard.html"; });

document.querySelectorAll("[data-nav-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.navModal;
    if (target === "help") renderInfoModal("Help center", "<p>Email <strong>support@redbridge.app</strong> or message the on-call admin from your dashboard. Most requests get a first response within an hour during campus hours.</p>");
    else if (target === "privacy") renderInfoModal("Privacy policy", "<p>Your phone number is only shown to signed-in users viewing the donor directory. Your live location is only shared while your availability toggle is switched on, and never stored after you switch it off.</p><p>Blood group and donation history are visible to you and, in aggregate, to admins coordinating requests.</p>");
    else if (target === "about-modal") renderInfoModal("About RedBridge", "<p>RedBridge is a section-E class project: a directory, a request board, and a donation log for classmates who've volunteered their blood group. It's built with plain HTML, CSS, and JavaScript — no backend, no tracking.</p>");
    else if (target === "settings") requireAuth(() => renderInfoModal("Settings", "<p>Notification preferences, linked phone number, and account deletion would live here in a full build. For this demo, use <strong>Edit profile</strong> from your dashboard.</p>"));
    else if (target === "edit-profile") requireAuth((u) => renderInfoModal("Edit profile", `<div class="form-field"><label>Name</label><input value="${u.name || ""}" id="ep-name"></div><div class="form-field"><label>Blood group</label><select id="ep-group">${BLOOD_GROUPS.map(g=>`<option ${g===u.bloodGroup?"selected":""}>${g}</option>`).join("")}</select></div><button class="btn-primary btn-block" id="ep-save">Save changes</button>`));
  });
});
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "ep-save") {
    const u = getUser();
    u.name = document.getElementById("ep-name").value.trim() || u.name;
    u.bloodGroup = document.getElementById("ep-group").value;
    setUser(u);
    closeModal();
    onAuthed();
    toast("Profile updated.", "success");
  }
});

/* ------------------------------------------------------------------------
   7. HERO CANVAS — flowing red blood cells
   ------------------------------------------------------------------------ */
(function initCanvas() {
  const canvas = document.getElementById("blood-canvas");
  if (!canvas) return; // only index.html's hero has this canvas
  const ctx = canvas.getContext("2d");
  const CELL_COUNT = 46;         // customizable
  const MIN_SIZE = 5, MAX_SIZE = 22;
  const MIN_SPEED = 0.25, MAX_SPEED = 1.6;
  let width, height, cells = [], raf, running = true;

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  function makeCell(initial) {
    const depth = Math.random();               // 0 = far/background, 1 = near/foreground
    const size = (MIN_SIZE + depth * (MAX_SIZE - MIN_SIZE)) * devicePixelRatio;
    return {
      x: initial ? Math.random() * width : -size * 2,
      y: Math.random() * height,
      size,
      depth,
      speed: (MIN_SPEED + depth * (MAX_SPEED - MIN_SPEED)) * devicePixelRatio,
      phase: Math.random() * Math.PI * 2,
      waveAmp: (6 + Math.random() * 14) * devicePixelRatio,
      waveFreq: 0.004 + Math.random() * 0.006,
      opacity: 0.35 + depth * 0.65,
      blur: (1 - depth) * 3
    };
  }
  function initCells() { cells = Array.from({ length: CELL_COUNT }, () => makeCell(true)); }

  function drawCell(c) {
    ctx.save();
    ctx.globalAlpha = c.opacity;
    ctx.filter = c.blur > 0.4 ? `blur(${c.blur.toFixed(1)}px)` : "none";
    const grad = ctx.createRadialGradient(c.x, c.y, c.size * 0.1, c.x, c.y, c.size);
    grad.addColorStop(0, "#3a0a10");
    grad.addColorStop(0.55, "#8c1526");
    grad.addColorStop(0.85, "#c62a3f");
    grad.addColorStop(1, "#e8536a");
    ctx.fillStyle = grad;
    ctx.beginPath();
    // biconcave disc: an ellipse with a subtle inner dimple achieved via composite ellipse
    ctx.ellipse(c.x, c.y, c.size, c.size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-atop";
    const dimple = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 0.55);
    dimple.addColorStop(0, "rgba(20,2,5,0.45)");
    dimple.addColorStop(1, "rgba(20,2,5,0)");
    ctx.fillStyle = dimple;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.size, c.size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick(t) {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    cells.sort((a, b) => a.depth - b.depth);
    cells.forEach((c) => {
      c.x += c.speed;
      c.y += Math.sin(t * c.waveFreq + c.phase) * 0.4;
      drawCell(c);
      if (c.x - c.size > width) Object.assign(c, makeCell(false));
    });
    raf = requestAnimationFrame(tick);
  }

  function start() {
    resize(); initCells();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }
  window.addEventListener("resize", () => { resize(); });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) raf = requestAnimationFrame(tick);
  });
  start();
})();

/* ------------------------------------------------------------------------
   8. HERO STAT COUNT-UP + SCROLL REVEAL
   ------------------------------------------------------------------------ */
function animateCount(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    el.textContent = Math.floor(p * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll(".hero-stat-num").forEach(el => animateCount(el, +el.dataset.count, 1200));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ------------------------------------------------------------------------
   9. DONOR SEARCH / DIRECTORY
   ------------------------------------------------------------------------ */
const donorGrid = document.getElementById("donor-grid");
const donorCountEl = document.getElementById("donor-count");
const searchInput = document.getElementById("donor-search-input");
const groupFilter = document.getElementById("filter-blood-group");
const locFilter = document.getElementById("filter-location");

function donorCardHtml(d) {
  const hasPhone = !!d.phone;
  const groupClass = d.bloodGroup === "Unknown" ? "unknown" : "";
  return `
  <div class="donor-card" data-id="${d.id}">
    <div class="donor-card-top">
      <span class="avatar-dot" style="background:${d.color}">${d.initial}</span>
      <div>
        <p class="donor-card-name">${d.name}</p>
        <p class="donor-card-id">#${d.id} · Section ${d.section}${d.role !== "Student" ? " · " + d.role : ""}</p>
      </div>
      <span class="donor-group-badge ${groupClass}">${d.bloodGroup === "Unknown" ? "—" : d.bloodGroup}</span>
    </div>
    <div class="donor-status-row">
      <span class="status-dot ${d.isActive ? "status-dot--live" : ""}"></span>
      ${d.isActive ? "Available now" : "Not available"} · ${d.distanceKm} km away
    </div>
    <div class="donor-card-actions">
      <button class="btn-outline btn-sm" data-call="${d.id}" ${hasPhone ? "" : "disabled title='No phone on file'"}>Call</button>
      <button class="btn-primary btn-sm" data-message="${d.id}">Message</button>
    </div>
  </div>`;
}

function renderDonorGrid() {
  if (!donorGrid) return; // only find_donar.html has the donor directory
  let list = allDonors();
  const q = (searchInput.value || "").toLowerCase().trim();
  const group = groupFilter.value;
  const onlyAvailable = locFilter.value === "available";
  if (q) list = list.filter(d => d.name.toLowerCase().includes(q) || d.id.includes(q));
  if (group) list = list.filter(d => d.bloodGroup === group);
  if (onlyAvailable) list = list.filter(d => d.isActive);
  list.sort((a, b) => a.distanceKm - b.distanceKm);
  donorCountEl.textContent = `${list.length} donor${list.length === 1 ? "" : "s"}`;
  donorGrid.innerHTML = list.length
    ? list.map(donorCardHtml).join("")
    : `<div class="empty-state no-results"><p>No donors match those filters.</p></div>`;
}
if (donorGrid) {
  [searchInput, groupFilter, locFilter].forEach(el => el.addEventListener("input", renderDonorGrid));
  document.getElementById("filter-reset").addEventListener("click", () => {
    searchInput.value = ""; groupFilter.value = ""; locFilter.value = "";
    renderDonorGrid();
  });
}

document.addEventListener("click", (e) => {
  const callId = e.target.closest("[data-call]")?.dataset.call;
  const msgId = e.target.closest("[data-message]")?.dataset.message;
  if (callId) {
    const d = allDonors().find(x => x.id === callId);
    if (d && d.phone) { window.location.href = `tel:${d.phone.replace(/[^+\d]/g, "")}`; }
  }
  if (msgId) {
    const d = allDonors().find(x => x.id === msgId);
    if (d) openChatWith(d);
  }
});

/* ------------------------------------------------------------------------
   10. AVAILABILITY TOGGLE + GEOLOCATION
   ------------------------------------------------------------------------ */
const availToggle = document.getElementById("availability-toggle");
const availStatus = document.getElementById("availability-status");
const availSub = document.getElementById("availability-sub");
const availLocText = document.getElementById("availability-location-text");

availToggle?.addEventListener("click", () => {
  requireAuth((u) => {
    if (!u.linkedId) {
      toast("Link your account to a directory record to activate availability. Edit this in sign-up next time, or contact an admin.", "error");
      return;
    }
    const nowActive = availToggle.getAttribute("aria-checked") !== "true";
    setAvailability(nowActive);
  });
});

function setAvailability(active) {
  if (!availToggle) return; // this page doesn't have the availability toggle (dashboard.html only)
  const u = getUser();
  availToggle.classList.toggle("is-on", active);
  availToggle.setAttribute("aria-checked", String(active));
  availStatus.hidden = !active;
  availSub.textContent = active ? "On — nearby seekers can see you" : "Off — you won't appear in nearby searches";

  if (!active) {
    setOverride(u.linkedId, { isActive: false });
    
    return;
  }
  availLocText.textContent = "Locating…";
  if (!navigator.geolocation) {
    availLocText.textContent = "Location unavailable on this browser — availability set without location.";
    setOverride(u.linkedId, { isActive: true });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setOverride(u.linkedId, { isActive: true, lat: pos.coords.latitude, lng: pos.coords.longitude });
      availLocText.textContent = "Sharing your live location while active.";
      
      toast("You're marked available to donate.", "success");
    },
    (err) => {
      setOverride(u.linkedId, { isActive: true });
      availLocText.textContent = "Location permission denied — you're still listed as available, without a live location.";
    },
    { timeout: 8000 }
  );
}

/* ------------------------------------------------------------------------
   11. DASHBOARD
   ------------------------------------------------------------------------ */
function renderDashboard() {
  if (!document.getElementById("view-dashboard")) return; // only dashboard.html has this view
  const u = getUser();
  document.getElementById("dash-name").textContent = u ? u.name : "Guest Donor";
  document.getElementById("dash-meta").textContent = u ? `${u.bloodGroup || "Blood group not set"} · ${u.email || ""}` : "Sign in to see your profile";
  document.getElementById("dash-avatar").textContent = u ? u.name.charAt(0).toUpperCase() : "?";

  if (u && u.linkedId) {
    const linked = donorWithOverride(donors.find(d => d.id === u.linkedId));
    setAvailability(!!linked.isActive);
    if (linked.isActive) availLocText.textContent = "Sharing your live location while active.";
  } else {
    availToggle.classList.remove("is-on");
    availToggle.setAttribute("aria-checked", "false");
    availStatus.hidden = true;
    availSub.textContent = u ? "Link your account to a directory record to activate" : "Sign in to activate";
  }

  const history = LS.get(KEYS.HISTORY, []);
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = history.length
    ? history.map(h => `<li><span>${h.date}</span><span>${h.location}</span></li>`).join("")
    : `<li class="history-empty">No donations logged yet.</li>`;

  document.querySelectorAll("#badge-row .badge").forEach((b, i) => {
    const unlocked = (i === 0 && history.length >= 1) || (i === 1 && history.length >= 3) || (i === 2 && false);
    b.classList.toggle("badge--unlocked", unlocked);
    b.classList.toggle("badge--locked", !unlocked);
  });

  const reqs = getRequests().filter(r => r.status !== "fulfilled").slice(0, 3);
  document.getElementById("dash-request-list").innerHTML = reqs.map(requestCardHtml).join("") ||
    `<div class="empty-state">No open requests right now.</div>`;

  const nearby = allDonors().filter(d => d.isActive).slice(0, 8);
  document.getElementById("dash-donor-strip").innerHTML = nearby.length
    ? nearby.map(d => `
        <div class="donor-card" style="min-width:200px;">
          <div class="donor-card-top">
            <span class="avatar-dot" style="background:${d.color}">${d.initial}</span>
            <div><p class="donor-card-name">${d.name}</p><p class="donor-card-id">${d.bloodGroup} · ${d.distanceKm} km</p></div>
          </div>
        </div>`).join("")
    : `<div class="empty-state">No one is marked available right now.</div>`;
}

document.getElementById("log-donation-btn")?.addEventListener("click", () => {
  requireAuth(() => {
    const history = LS.get(KEYS.HISTORY, []);
    history.unshift({ date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }), location: "Self-reported" });
    LS.set(KEYS.HISTORY, history);
    renderDashboard();
    toast("Donation logged — thank you for giving.", "success");
  });
});

document.getElementById("dash-new-request")?.addEventListener("click", () => renderRequestForm());

/* ------------------------------------------------------------------------
   12. BLOOD REQUESTS
   ------------------------------------------------------------------------ */
function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function requestCardHtml(r) {
  const pillClass = r.status === "open" ? (r.urgent ? "pill--urgent" : "pill--open") : r.status === "progress" ? "pill--progress" : "pill--fulfilled";
  const pillText = r.status === "open" ? (r.urgent ? "Urgent" : "Open") : r.status === "progress" ? "In progress" : "Fulfilled";
  return `
  <div class="request-card ${r.urgent ? "is-urgent" : ""}">
    <div class="request-badge">${r.bloodGroup}</div>
    <div class="request-info">
      <h4>${r.patient} · ${r.units} unit${r.units > 1 ? "s" : ""}</h4>
      <p>${r.hospital} · ${timeAgo(r.created)}</p>
    </div>
    <div class="request-meta">
      <span class="pill ${pillClass}">${pillText}</span>
      ${r.status !== "fulfilled" ? `<button class="btn-text" data-respond="${r.id}" style="padding:0;">Respond</button>` : ""}
    </div>
  </div>`;
}
function renderRequestsView(tab) {
  const listEl = document.getElementById("requests-full-list");
  if (!listEl) return; // this page doesn't have the Requests view (only index.html does)
  tab = tab || document.querySelector("#requests-tabs .tab.is-active")?.dataset.tab || "open";
  const list = getRequests().filter(r => r.status === tab).sort((a,b) => b.created - a.created);
  listEl.innerHTML = list.length
    ? list.map(requestCardHtml).join("")
    : `<div class="empty-state">Nothing here yet.</div>`;
}
document.getElementById("requests-tabs")?.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll("#requests-tabs .tab").forEach(t => t.classList.remove("is-active"));
  tab.classList.add("is-active");
  renderRequestsView(tab.dataset.tab);
});
document.addEventListener("click", (e) => {
  const id = e.target.closest("[data-respond]")?.dataset.respond;
  if (!id) return;
  requireAuth(() => {
    const reqs = getRequests();
    const r = reqs.find(x => x.id === id);
    if (r && r.status === "open") { r.status = "progress"; saveRequests(reqs); renderRequestsView(); renderDashboard(); toast("You're marked as responding — the requester will see this.", "success"); }
  });
});

function renderRequestForm(prefillUrgent) {
  requireAuth(() => {
    openModal(`
      <div class="modal-head">
        <div><h2>Create blood request</h2><p class="muted">Visible to every compatible, available donor nearby.</p></div>
        <button class="modal-close" data-modal-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <form id="request-form">
        <div class="form-field"><label for="rq-patient">Patient name</label><input id="rq-patient" required placeholder="Who needs blood?"></div>
        <div class="form-row">
          <div class="form-field"><label for="rq-group">Blood group needed</label><select id="rq-group" required><option value="">Select</option>${BLOOD_GROUPS.map(g=>`<option>${g}</option>`).join("")}</select></div>
          <div class="form-field"><label for="rq-units">Units</label><input id="rq-units" type="number" min="1" value="1" required></div>
        </div>
        <div class="form-field"><label for="rq-hospital">Hospital / location</label><input id="rq-hospital" required placeholder="Hospital name"></div>
        <div class="form-field"><label for="rq-notes">Notes (optional)</label><textarea id="rq-notes" rows="2" placeholder="Timing, ward, contact instructions…"></textarea></div>
        <div class="checkbox-row"><input type="checkbox" id="rq-urgent" ${prefillUrgent ? "checked" : ""}><label for="rq-urgent">This is an emergency — needed within hours</label></div>
        <button class="btn-primary btn-block" type="submit">Post request</button>
      </form>
    `);
    document.getElementById("request-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const reqs = getRequests();
      reqs.unshift({
        id: "req" + Date.now(),
        patient: document.getElementById("rq-patient").value.trim(),
        bloodGroup: document.getElementById("rq-group").value,
        units: +document.getElementById("rq-units").value || 1,
        hospital: document.getElementById("rq-hospital").value.trim(),
        notes: document.getElementById("rq-notes").value.trim(),
        urgent: document.getElementById("rq-urgent").checked,
        status: "open",
        created: Date.now()
      });
      saveRequests(reqs);
      closeModal();
      pushNotification(`Your request for ${reqs[0].bloodGroup} was posted and matching donors were notified.`);
      toast("Request posted.", "success");
      if (document.getElementById("view-requests")) goTo("requests");
      else window.location.href = "index.html#requests";
    });
  });
}
document.getElementById("requests-new-btn")?.addEventListener("click", () => renderRequestForm(false));
document.getElementById("hero-emergency-btn")?.addEventListener("click", () => renderRequestForm(true));
document.getElementById("bento-emergency")?.addEventListener("click", () => renderRequestForm(true));
document.getElementById("bento-become-donor")?.addEventListener("click", () => {
  const u = getUser();
  window.location.href = u ? "dashboard.html" : "register.html";
});

/* ------------------------------------------------------------------------
   13. BLOOD BANKS
   ------------------------------------------------------------------------ */
const bankData = [
  { name: "Chattogram Central Blood Bank", area: "Chawkbazar", rating: 4.6, reviews: 128, stock: { "O+": 70, "A+": 45, "B+": 60, "AB+": 20 } },
  { name: "Red Crescent Blood Center", area: "GEC Circle", rating: 4.4, reviews: 96, stock: { "O+": 35, "A+": 20, "B+": 30, "AB+": 55 } },
  { name: "CMCH Blood Bank", area: "Panchlaish", rating: 4.2, reviews: 210, stock: { "O+": 85, "A+": 65, "B+": 40, "AB+": 15 } },
  { name: "Evercare Blood Services", area: "Chandgaon", rating: 4.7, reviews: 74, stock: { "O+": 50, "A+": 50, "B+": 50, "AB+": 50 } }
];
function bankCardHtml(b) {
  return `
  <div class="bank-card">
    <div class="bank-card-top">
      <div><h4>${b.name}</h4><p class="muted">${b.area}</p></div>
      <span class="bank-rating">★ ${b.rating} <span style="color:var(--slate-light);font-weight:400;">(${b.reviews})</span></span>
    </div>
    <div class="stock-bars">
      ${Object.entries(b.stock).map(([g, pct]) => `
        <div class="stock-bar">
          <div class="stock-bar-track"><div class="stock-bar-fill" style="height:${pct}%"></div></div>
          <span>${g}</span>
        </div>`).join("")}
    </div>
    <div class="bank-card-actions">
      <button class="btn-outline btn-sm" data-bank-map="${encodeURIComponent(b.name + ' ' + b.area)}">Map</button>
      <button class="btn-primary btn-sm" data-bank-review="${b.name}">Reviews</button>
    </div>
  </div>`;
}
function renderBanks() {
  const grid = document.getElementById("bank-grid");
  if (!grid) return; // only index.html has the Blood Banks view
  grid.innerHTML = bankData.map(bankCardHtml).join("");
}
document.addEventListener("click", (e) => {
  const mapQ = e.target.closest("[data-bank-map]")?.dataset.bankMap;
  if (mapQ) window.open(`https://www.google.com/maps/search/?api=1&query=${mapQ}`, "_blank");
  const reviewBank = e.target.closest("[data-bank-review]")?.dataset.bankReview;
  if (reviewBank) renderInfoModal(reviewBank, `<p>"Quick, well-organized, and the staff explained everything." — Anonymous donor</p><p>"Clean facility, short wait during the last campus drive." — Anonymous donor</p>`);
});

/* ------------------------------------------------------------------------
   14. EVENTS & LEADERBOARD
   ------------------------------------------------------------------------ */
const eventData = [
  { day: "14", month: "SEP", title: "Section-E Blood Drive", place: "CUET Auditorium", desc: "Our own campus drive — bring your student ID." },
  { day: "22", month: "SEP", title: "City-wide Donor Camp", place: "GEC Circle Grounds", desc: "Open to all blood groups, especially O- and AB-." },
  { day: "03", month: "OCT", title: "Corporate Donation Day", place: "Agrabad Commercial Area", desc: "Partnering with local businesses for a lunchtime drive." }
];
function eventCardHtml(ev) {
  return `
  <div class="event-card">
    <div class="event-card-date"><span>${ev.title}</span><strong>${ev.day} ${ev.month}</strong></div>
    <div class="event-card-body">
      <h4>${ev.place}</h4>
      <p>${ev.desc}</p>
      <button class="btn-outline btn-sm btn-block" data-join-event="${ev.title}">I'll be there</button>
    </div>
  </div>`;
}
const leaderboardData = [
  { name: "Kawsar", count: 5 }, { name: "Saad", count: 4 }, { name: "Mahfuz", count: 4 },
  { name: "Ahona", count: 3 }, { name: "Arnab", count: 3 }, { name: "Samu", count: 2 }
];
function renderEvents() {
  const eventGrid = document.getElementById("event-grid");
  if (!eventGrid) return; // only index.html has the Events view
  eventGrid.innerHTML = eventData.map(eventCardHtml).join("");
  document.getElementById("leaderboard-list").innerHTML = leaderboardData.map((l, i) => `
    <div class="leaderboard-row">
      <span class="leaderboard-rank">${i + 1}</span>
      <span class="leaderboard-name">${l.name}</span>
      <span class="leaderboard-count">${l.count} donations</span>
    </div>`).join("");
}
document.addEventListener("click", (e) => {
  const evTitle = e.target.closest("[data-join-event]")?.dataset.joinEvent;
  if (evTitle) requireAuth(() => { toast(`You're on the list for "${evTitle}".`, "success"); });
});

/* ------------------------------------------------------------------------
   15. MESSAGING / CHAT PANEL
   ------------------------------------------------------------------------ */
const chatPanel = document.getElementById("chat-panel");
const chatScrim = document.getElementById("chat-scrim");
const chatThreadList = document.getElementById("chat-thread-list");
const chatConversation = document.getElementById("chat-conversation");
let chatThreads = null;

function seedChatThreads() {
  const picks = donors.filter(d => d.phone).slice(0, 5);
  return picks.map((d, i) => ({
    id: d.id, name: d.name, color: d.color, initial: d.initial,
    preview: i === 0 ? "Sure, I can come by this evening." : "Thanks for reaching out!",
    unread: i === 0,
    messages: [
      { from: "them", text: "Hi! I saw your request — happy to help." },
      { from: "me", text: "That would be amazing, thank you." },
      ...(i === 0 ? [{ from: "them", text: "Sure, I can come by this evening." }] : [])
    ]
  }));
}
function getChatThreads() { if (!chatThreads) chatThreads = seedChatThreads(); return chatThreads; }

function renderChatThreadList(activeId) {
  chatThreadList.innerHTML = getChatThreads().map(t => `
    <button class="chat-thread ${t.id === activeId ? "is-active" : ""}" data-thread="${t.id}">
      <span class="avatar-dot" style="background:${t.color}">${t.initial}</span>
      <div><p class="chat-thread-name">${t.name}</p><p class="chat-thread-preview">${t.preview}</p></div>
    </button>`).join("");
}
function renderConversation(t) {
  chatConversation.innerHTML = `
    <div class="chat-conv-head"><span>${t.name}</span><button class="btn-text" data-call="${t.id}" style="padding:0;">Call</button></div>
    <div class="chat-messages">${t.messages.map(m => `<div class="chat-bubble from-${m.from}">${m.text}</div>`).join("")}</div>
    <div class="chat-input-row"><input type="text" id="chat-input" placeholder="Write a message…"><button class="btn-primary btn-sm" id="chat-send">Send</button></div>`;
  document.getElementById("chat-send").addEventListener("click", () => sendChatMessage(t));
  document.getElementById("chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendChatMessage(t); });
}
function sendChatMessage(t) {
  const input = document.getElementById("chat-input");
  const val = input.value.trim();
  if (!val) return;
  t.messages.push({ from: "me", text: val });
  t.preview = val;
  input.value = "";
  renderConversation(t);
  renderChatThreadList(t.id);
}
function openChatWith(donor) {
  const threads = getChatThreads();
  let t = threads.find(x => x.id === donor.id);
  if (!t) {
    t = { id: donor.id, name: donor.name, color: donor.color, initial: donor.initial, preview: "Say hello…", unread: false,
      messages: [{ from: "them", text: `Hi, this is ${donor.name}. Let me know how I can help.` }] };
    threads.unshift(t);
  }
  openChatPanel(t.id);
}
function openChatPanel(activeId) {
  requireAuth(() => {
    chatPanel.classList.add("is-open");
    chatScrim.classList.add("is-open");
    const threads = getChatThreads();
    const active = threads.find(x => x.id === activeId) || threads[0];
    renderChatThreadList(active ? active.id : null);
    if (active) renderConversation(active); else chatConversation.innerHTML = `<div class="chat-empty">No conversations yet.</div>`;
  });
}
document.getElementById("inbox-btn").addEventListener("click", () => openChatPanel());
document.getElementById("chat-close").addEventListener("click", closeChatPanel);
chatScrim.addEventListener("click", closeChatPanel);
function closeChatPanel() { chatPanel.classList.remove("is-open"); chatScrim.classList.remove("is-open"); }
chatThreadList.addEventListener("click", (e) => {
  const id = e.target.closest("[data-thread]")?.dataset.thread;
  if (!id) return;
  const t = getChatThreads().find(x => x.id === id);
  t.unread = false;
  renderChatThreadList(id);
  renderConversation(t);
});

/* ------------------------------------------------------------------------
   16. NOTIFICATIONS
   ------------------------------------------------------------------------ */
const notifPanel = document.getElementById("notif-panel");
const notifDot = document.getElementById("notif-dot");
function getNotifs() { return LS.get(KEYS.NOTIFS, [
  { text: "Kawsar responded to a B+ request near you.", time: "2h ago", unread: true },
  { text: "A new emergency O- request was posted nearby.", time: "5h ago", unread: true },
  { text: "Reminder: your last donation was 3 months ago — you're eligible again.", time: "1d ago", unread: false }
]); }
function saveNotifs(list) { LS.set(KEYS.NOTIFS, list); }
function pushNotification(text) {
  const list = getNotifs();
  list.unshift({ text, time: "Just now", unread: true });
  saveNotifs(list);
  updateNotifDot();
}
function updateNotifDot() { notifDot.hidden = !getNotifs().some(n => n.unread); }
function renderNotifPanel() {
  document.getElementById("notif-list").innerHTML = getNotifs().map(n => `
    <div class="notif-item ${n.unread ? "is-unread" : ""}">
      <span class="notif-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/></svg></span>
      <div><p>${n.text}</p><span class="notif-time">${n.time}</span></div>
    </div>`).join("");
}
document.getElementById("notif-btn").addEventListener("click", () => {
  const open = notifPanel.classList.toggle("is-open");
  if (open) renderNotifPanel();
});
document.addEventListener("click", (e) => {
  if (!notifPanel.contains(e.target) && e.target.id !== "notif-btn" && !e.target.closest("#notif-btn")) notifPanel.classList.remove("is-open");
});
document.getElementById("notif-clear").addEventListener("click", () => {
  const list = getNotifs().map(n => ({ ...n, unread: false }));
  saveNotifs(list);
  renderNotifPanel();
  updateNotifDot();
});
updateNotifDot();

/* ------------------------------------------------------------------------
   17. SPLASH → ONBOARDING → APP BOOT SEQUENCE
   ------------------------------------------------------------------------ */
seedRequestsIfEmpty();
function bootApp() {
  document.getElementById("app").classList.remove("hidden");
  refreshAuthUI();
  renderRequestsView("open");
  renderDashboard();   // no-ops unless this page is dashboard.html
  renderDonorGrid();   // no-ops unless this page is find_donar.html
  renderBanks();       // no-ops unless this page has the Blood Banks view
  renderEvents();      // no-ops unless this page has the Events view
  // Requests / Blood Banks / Events links on other pages point here as
  // index.html#requests etc. — jump to that section once the app is ready.
  const target = window.location.hash.replace("#", "");
  if (["requests", "banks", "events"].includes(target)) goTo(target);
}
window.addEventListener("hashchange", () => {
  const target = window.location.hash.replace("#", "");
  if (["home", "requests", "banks", "events"].includes(target)) goTo(target);
});
const onboardingEl = document.getElementById("onboarding");
let onboardIndex = 0;
function showOnboardSlide(i) {
  onboardIndex = i;
  onboardingEl.querySelectorAll(".onboarding-slide").forEach((s, idx) => s.classList.toggle("is-active", idx === i));
  onboardingEl.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("is-active", idx === i));
  document.getElementById("onboarding-next").textContent = i === 2 ? "Get started" : "Next";
}
document.getElementById("onboarding-next").addEventListener("click", () => {
  if (onboardIndex < 2) showOnboardSlide(onboardIndex + 1);
  else finishOnboarding();
});
document.getElementById("onboarding-skip").addEventListener("click", finishOnboarding);
onboardingEl.querySelectorAll(".dot").forEach(d => d.addEventListener("click", () => showOnboardSlide(+d.dataset.goto)));
function finishOnboarding() {
  LS.set(KEYS.ONBOARDED, true);
  onboardingEl.classList.add("hidden");
  bootApp();
}

setTimeout(() => {
  document.getElementById("splash-screen").remove();
  if (LS.get(KEYS.ONBOARDED, false)) {
    bootApp();
  } else {
    onboardingEl.classList.remove("hidden");
    showOnboardSlide(0);
  }
}, 2250);

/* ------------------------------------------------------------------------
   18. SHARED HELPERS FOR login.html / register.html
   Those pages have their own small <script> at the bottom (since sign-in and
   sign-up are now real pages instead of modals) and reuse this bit of logic
   instead of duplicating it.
   ------------------------------------------------------------------------ */
window.RB = { getUser, setUser, toast, donors, donorOptionsHtml };

})();


/* ============================================================
   whatsapp.js — Drop For Life ADD-ON  (do not edit other files)
   ------------------------------------------------------------
   Clicking "Message" on a donor card opens that donor's
   WhatsApp chat directly. Works by intercepting the click in
   the CAPTURE phase, before script.js opens the built-in chat.

   SETUP (one line only):
   Add right after <script src="motion.js"></script> in your HTML:
       <script src="whatsapp.js"></script>
   ============================================================ */
(function () {
  "use strict";

  /* Donor ID -> WhatsApp number (digits only, country code included).
     Taken from your script.js classmatesData.                        */
  var DONOR_PHONES = {
  "1170": "8801857786242",
  "1173": "8801629260953",
  "1175": "8801537708966",
  "1176": "8801608269877",
  "1178": "8801747657051",
  "1179": "8801842246839",
  "1180": "8801685429628",
  "1181": "8801616876919",
  "1182": "8801720854616",
  "1186": "8801723052343",
  "1187": "8801865467007",
  "1188": "8801690150201",
  "1189": "8801832979911",
  "1190": "8801623374919",
  "1191": "8801871843122",
  "1192": "8801615897530",
  "1193": "8801844854013",
  "1194": "8801812519880",
  "1195": "8801881195469",
  "1196": "8801854071334",
  "1197": "8801889782354",
  "1200": "8801869985425",
  "1201": "8801877952035",
  "1202": "8801879063378",
  "1203": "8801816283480",
  "1205": "8801878745423",
  "1206": "8801613544655",
  "1208": "8801846968271",
  "1209": "8801309239026"
  };

  /* Set false if you want the normal in-app chat panel for Inbox threads */
  var REDIRECT_INBOX_THREADS = true;

  function openWhatsApp(phone, message) {
    var digits = (phone || "").replace(/\D/g, "");
    var text = encodeURIComponent(message);
    var url = digits
      ? "https://wa.me/" + digits + "?text=" + text
      : "https://wa.me/?text=" + text;   // fallback: share sheet
    window.open(url, "_blank", "noopener");
  }

  function donorNameFrom(btn) {
    var card = btn.closest(".donor-card");
    if (!card) return "";
    var el = card.querySelector(".donor-card-name");
    return el ? el.textContent.trim() : "";
  }

  /* 1) Donor-card "Message" buttons ------------------------------------ */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-message]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    var id = btn.dataset.message;
    var name = donorNameFrom(btn);
    var phone = DONOR_PHONES[id] || "";
    var msg = name
      ? "Hello " + name + "! I found you on Drop For Life and I need a blood donor. Can you help?"
      : "Hello! I found you on Drop For Life and I need a blood donor. Can you help?";

    if (!phone) {
      msg = "Hello " + (name || "") + "! (This classmate has no phone on file in Drop For Life.) " + msg;
    }
    openWhatsApp(phone, msg);
  }, true);   // capture: runs BEFORE script.js's own click handler

  /* 2) Inbox chat threads (optional) ----------------------------------- */
  if (REDIRECT_INBOX_THREADS) {
    document.addEventListener("click", function (e) {
      var thread = e.target.closest(".chat-thread[data-thread]");
      if (!thread) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      var id = thread.dataset.thread;
      var nameEl = thread.querySelector(".chat-thread-name");
      var name = nameEl ? nameEl.textContent.trim() : "";
      openWhatsApp(DONOR_PHONES[id] || "",
        "Hello " + (name || "") + "! I'm contacting you via Drop For Life.");
    }, true);
  }
})();