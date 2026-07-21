"use client";

/* Homepage — a faithful port of reference/Himspring Home.dc.html.
   The reference markup is injected verbatim (see homeMarkup.js); the DC-runtime
   slide-deck behaviour (support.js `Component`) is ported below into the `Deck`
   class and driven from a single effect. GSAP comes from the installed package
   and is exposed as window.gsap/ScrollTrigger so the ported logic finds it,
   exactly as the reference's CDN scripts did. */

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HOME_MARKUP from "./homeMarkup";

/* Base rules + keyframes from the reference <helmet>, scoped under .hs-home so
   nothing leaks onto the shared layout (Intro overlay, other routes). */
const CSS = `
.hs-home { position:relative; font-family:"Montserrat",sans-serif; color:#1B2C58; background:#FEFEF6; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
.hs-home *, .hs-home *::before, .hs-home *::after { margin:0; padding:0; box-sizing:border-box; }
.hs-home a { color:#267EBE; text-decoration:none; transition:color .3s ease; }
.hs-home a:hover { color:#1B2C58; }
.hs-home ::selection { background:#1B2C58; color:#FEFEF6; }
.hs-home .ser { font-family:"Times New Roman",Times,serif; }
@keyframes hsFloat { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-22px) } }
@keyframes hsRipple { 0%{ transform:scale(.3); opacity:.55 } 100%{ transform:scale(1.9); opacity:0 } }
@keyframes hsMarquee { 0%{ transform:translateX(0) } 100%{ transform:translateX(-50%) } }
@keyframes hsScrollCue { 0%{ transform:translateY(0); opacity:.9 } 50%{ transform:translateY(10px); opacity:.3 } 100%{ transform:translateY(0); opacity:.9 } }
@keyframes hsSheen { 0%{ background-position:0% 50% } 100%{ background-position:200% 50% } }

/* THE JOURNEY — full-bleed vertical marquee of bento image cards with the
   heading overlaid in the centre on a soft scrim (transform-only motion). */
.hs-home .hs-jr { position:relative; min-height:100vh; overflow:hidden; background:var(--snow); }
.hs-home .hs-jr__cols { position:absolute; inset:0; z-index:1; display:flex; align-items:flex-start; gap:20px; justify-content:center; padding:0 24px; }
.hs-home .hs-jr__col { flex:0 0 clamp(200px,18vw,300px); display:flex; flex-direction:column; will-change:transform; }
.hs-home .hs-jr__col--up { animation:hsColUp var(--dur,44s) linear infinite; }
.hs-home .hs-jr__col--down { animation:hsColDown var(--dur,44s) linear infinite; }
.hs-home .hs-jr__card { margin-bottom:20px; border-radius:16px; overflow:hidden; position:relative; background:#e9eef4; border:1px solid rgba(27,44,88,.06); box-shadow:0 34px 60px -42px rgba(27,44,88,.55); }
.hs-home .hs-jr__card img { width:100%; height:100%; object-fit:cover; display:block; }
.hs-home .hs-jr__card--label { display:flex; align-items:flex-end; padding:22px; }
.hs-home .hs-jr__card--label span { font-size:22px; line-height:1.15; font-style:italic; color:var(--snow); }
.hs-home .hs-jr__mask { position:absolute; inset:0; z-index:2; pointer-events:none; background:linear-gradient(180deg,var(--snow) 0%,rgba(254,254,246,0) 15%,rgba(254,254,246,0) 85%,var(--snow) 100%); }
.hs-home .hs-jr__center { position:absolute; inset:0; z-index:3; display:flex; align-items:center; justify-content:center; padding:24px; pointer-events:none; }
.hs-home .hs-jr__panel { max-width:660px; padding:52px 44px; text-align:center; border-radius:28px; background:radial-gradient(ellipse 130% 104% at 50% 50%, rgba(254,254,246,.95) 0%, rgba(254,254,246,.88) 44%, rgba(254,254,246,0) 80%); }
@keyframes hsColUp { from { transform:translateY(0); } to { transform:translateY(-50%); } }
@keyframes hsColDown { from { transform:translateY(-50%); } to { transform:translateY(0); } }
@media (max-width:1180px) { .hs-home .hs-jr__col:nth-child(n+5) { display:none; } }
@media (max-width:900px) { .hs-home .hs-jr__col:nth-child(n+4) { display:none; } }
@media (max-width:640px) { .hs-home .hs-jr__col:nth-child(n+3) { display:none; } }
@media (prefers-reduced-motion: reduce) { .hs-home .hs-jr__col { animation:none !important; } }
`;

/* Ported from support.js `class Component extends DCLogic`.
   Method bodies are kept verbatim; only DC plumbing (props defaults, renderVals
   event bindings, asset base path) is adapted. */
class Deck {
  constructor(props) {
    this.props = props;
    this.gsapActive = false;
  }

  mount() {
    this.reduce = () => (this.props.motionIntensity || "Rich") === "Calm";
    this.idx = 0; this.animating = false; this._mode = null; this._cool = 0;
    this.slides = Array.from(document.querySelectorAll("[data-slide]"));
    this.viewport = document.querySelector("[data-viewport]");
    this.track = document.querySelector("[data-track]");
    this._saved = new Map();
    this.slides.forEach(el => this._saved.set(el, { h: el.style.height, mh: el.style.minHeight, ov: el.style.overflow, d: el.style.display, fd: el.style.flexDirection, jc: el.style.justifyContent, pt: el.style.paddingTop, pb: el.style.paddingBottom }));
    this._buildDots();
    this._buildFx();

    // Reveals owned by IntersectionObserver + CSS (never depends on GSAP for visibility)
    this._items = Array.from(document.querySelectorAll("[data-reveal]"));
    this._revealAll = () => this._items.forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    if ("IntersectionObserver" in window) {
      this._io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = "none"; this._io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }

    // Nav solidify
    const nav = document.querySelector("[data-nav]");
    this.onScroll = () => {
      if (this._mode) return;
      const y = window.scrollY || window.pageYOffset;
      if (nav) {
        if (y > 40) {
          nav.style.background = "rgba(254,254,246,0.92)";
          nav.style.backdropFilter = "blur(10px)";
          nav.style.boxShadow = "0 1px 0 rgba(27,44,88,0.08)";
          nav.style.padding = "14px 48px";
        } else {
          nav.style.background = "transparent";
          nav.style.backdropFilter = "none";
          nav.style.boxShadow = "none";
          nav.style.padding = "22px 48px";
        }
      }
      if (!this.reduce() && !this.gsapActive) {
        document.querySelectorAll("[data-parallax]").forEach(el => {
          const rect = el.getBoundingClientRect();
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          el.style.willChange = "transform";
          el.style.transform = `translate3d(0, ${(center * speed).toFixed(1)}px, 0)`;
        });
      }
    };
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();

    // Responsive nav
    const links = document.querySelector("[data-navlinks]");
    const textLinks = links ? Array.from(links.querySelectorAll("a")).slice(0, 6) : [];
    this.setNav = () => {
      const w = window.innerWidth;
      if (nav) nav.style.padding = (w < 760 ? "16px 22px" : (w < 1100 ? "16px 30px" : "22px 48px"));
      const btn = document.querySelector("[data-menubtn]");
      const panel = document.querySelector("[data-menupanel]");
      const cue = document.querySelector("[data-scrollcue]");
      if (cue) cue.style.display = window.innerHeight < 660 ? "none" : "flex";
      if (!links) return;
      if (w < 1120) {
        links.style.gap = "0";
        textLinks.forEach(a => { a.style.display = "none"; });
        if (btn) btn.style.display = "flex";
      } else {
        links.style.gap = w < 1320 ? "22px" : "34px";
        textLinks.forEach(a => { a.style.display = ""; a.style.fontSize = w < 1320 ? "11px" : "12px"; });
        if (btn) btn.style.display = "none";
        if (panel) panel.style.display = "none";
        this._menuOpen = false;
      }
    };
    window.addEventListener("resize", this.setNav, { passive: true });
    this.setNav();

    this.onResize2 = () => this.setMode(true);
    window.addEventListener("resize", this.onResize2, { passive: true });
    this.onWheel = (e) => {
      if (!this._mode) return;
      e.preventDefault();
      if (this.animating || Date.now() - this._cool < 700 || Math.abs(e.deltaY) < 14) return;
      this.goTo(this.idx + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", this.onWheel, { passive: false });
    this.onKey = (e) => {
      if (!this._mode || (e.target.matches && e.target.matches("input,textarea,select"))) return;
      const k = e.key;
      if (k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); this.goTo(this.idx + 1); }
      else if (k === "ArrowUp" || k === "PageUp") { e.preventDefault(); this.goTo(this.idx - 1); }
      else if (k === "Home") { e.preventDefault(); this.goTo(0); }
      else if (k === "End") { e.preventDefault(); this.goTo(this.slides.length - 1); }
    };
    window.addEventListener("keydown", this.onKey);
    this.onTouchStart = (e) => { this._ty = e.touches[0].clientY; };
    this.onTouchEnd = (e) => {
      if (!this._mode || this._ty == null) return;
      const d = this._ty - e.changedTouches[0].clientY;
      this._ty = null;
      if (Math.abs(d) > 50 && !this.animating) this.goTo(this.idx + (d > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", this.onTouchStart, { passive: true });
    window.addEventListener("touchend", this.onTouchEnd, { passive: true });
    this.onClickDoc = (e) => {
      if (!this._mode) return;
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const t = id ? document.getElementById(id) : null;
      const slide = t ? (t.hasAttribute("data-slide") ? t : t.closest("[data-slide]")) : null;
      const i = this.slides.indexOf(slide);
      if (i > -1) { e.preventDefault(); this.goTo(i); }
    };
    document.addEventListener("click", this.onClickDoc, true);
    this.onLoad = () => this.setMode(true);
    window.addEventListener("load", this.onLoad, { once: true });
    this._bootT = setTimeout(() => this.setMode(true), 1400);

    this._buildJourneyLoop();
    this._wireInteractions();
    this.applyProps();
  }

  /* Build each Journey column into a seamless vertical marquee:
     1) grow one "set" of cards until it comfortably exceeds the viewport, so
        the two stacked sets always fill the screen with no empty gap;
     2) duplicate that set once, so translateY(-50%) lands exactly on the set
        boundary (uniform card margins keep the seam invisible);
     3) pace every column at the same px/second so heights don't skew speed. */
  _buildJourneyLoop() {
    const vh = window.innerHeight || 900;
    const SPEED = 46; // px per second — a calm, even drift
    document.querySelectorAll(".hs-jr__col").forEach(col => {
      const base = Array.from(col.children);
      if (!base.length) return;
      let guard = 0;
      while (col.scrollHeight < vh * 1.2 && guard < 24) {
        base.forEach(card => col.appendChild(card.cloneNode(true)));
        guard++;
      }
      const setHeight = col.scrollHeight; // one full set (pre-duplication)
      Array.from(col.children).forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        col.appendChild(clone);
      });
      col.style.setProperty("--dur", Math.max(24, Math.round(setHeight / SPEED)) + "s");
    });
  }

  /* Replaces DC's renderVals() {{ }} bindings + style-hover/style-focus pseudo
     rules with direct listeners on the injected markup. */
  _wireInteractions() {
    this._teardown = [];
    const on = (el, ev, fn, opts) => { if (!el) return; el.addEventListener(ev, fn, opts); this._teardown.push(() => el.removeEventListener(ev, fn, opts)); };

    on(document.querySelector("[data-menubtn]"), "click", () => this.toggleMenu());
    document.querySelectorAll("[data-menupanel] a").forEach(a => on(a, "click", () => this.closeMenu()));
    on(document.querySelector("[data-newsletter]"), "submit", (e) => this.onSubmit(e));

    const parse = (str) => (str || "").split(";").map(s => s.trim()).filter(Boolean).map(d => { const i = d.indexOf(":"); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; });
    const bindPseudo = (attr, enterEv, leaveEv) => {
      document.querySelectorAll("[" + attr + "]").forEach(el => {
        const decls = parse(el.getAttribute(attr));
        const enter = () => { el.__ps = el.__ps || {}; decls.forEach(([p, v]) => { if (!(p in el.__ps)) el.__ps[p] = el.style.getPropertyValue(p); el.style.setProperty(p, v); }); };
        const leave = () => { if (el.__ps) decls.forEach(([p]) => el.style.setProperty(p, el.__ps[p] || "")); };
        on(el, enterEv, enter); on(el, leaveEv, leave);
      });
    };
    bindPseudo("style-hover", "mouseenter", "mouseleave");
    bindPseudo("style-focus", "focus", "blur");
  }

  toggleMenu() {
    const panel = document.querySelector("[data-menupanel]");
    this._menuOpen = !this._menuOpen;
    if (panel) panel.style.display = this._menuOpen ? "flex" : "none";
  }

  closeMenu() {
    const panel = document.querySelector("[data-menupanel]");
    this._menuOpen = false;
    if (panel) panel.style.display = "none";
  }

  onSubmit(e) {
    e.preventDefault();
    const form = e.target.closest("[data-form]");
    const input = form.querySelector("[data-email]");
    const ok = form.querySelector("[data-success]");
    const nf = form.querySelector("[data-newsletter]");
    if (input && input.value && input.value.includes("@")) {
      if (nf) nf.style.display = "none";
      if (ok) { ok.style.display = "block"; ok.textContent = "You're on the list. Welcome to the 1% Club."; }
    }
  }

  applyProps() {
    const showGrain = this.props.showGrain !== false;
    const g = document.querySelector("[data-grain]");
    if (g) g.style.display = showGrain ? "block" : "none";
    const showMarquee = this.props.showMarquee !== false;
    const m = document.querySelector("[data-marquee]");
    if (m) m.style.display = showMarquee ? "block" : "none";
    this.setMode();
  }

  unmount() {
    if (this.onScroll) window.removeEventListener("scroll", this.onScroll);
    if (this.setNav) window.removeEventListener("resize", this.setNav);
    if (this.onResize2) window.removeEventListener("resize", this.onResize2);
    if (this.onWheel) window.removeEventListener("wheel", this.onWheel);
    if (this.onKey) window.removeEventListener("keydown", this.onKey);
    if (this.onTouchStart) window.removeEventListener("touchstart", this.onTouchStart);
    if (this.onTouchEnd) window.removeEventListener("touchend", this.onTouchEnd);
    if (this.onClickDoc) document.removeEventListener("click", this.onClickDoc, true);
    if (this.onLoad) window.removeEventListener("load", this.onLoad);
    if (this._cmScroll) window.removeEventListener("scroll", this._cmScroll);
    if (this._teardown) this._teardown.forEach(fn => fn());
    if (this._bootT) clearTimeout(this._bootT);
    if (this._gt) clearTimeout(this._gt);
    if (this._safety) clearTimeout(this._safety);
    if (this._io) this._io.disconnect();
    if (this._ctx) this._ctx.revert();
    if (this._items) this._items.forEach(el => { el.style.opacity = 1; el.style.transform = "none"; }); // never leave hidden
  }

  _waitGsap(tries) {
    if (window.gsap && window.ScrollTrigger) { this._runGsap(); return; }
    if (tries > 45) return;
    this._gt = setTimeout(() => this._waitGsap(tries + 1), 60);
  }

  _runGsap() {
    if (this.gsapActive || this._mode) return;
    const gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    this.gsapActive = true;

    this._ctx = gsap.context(() => {
      // Transform-only stagger — opacity is owned by IO, so this never hides content
      this._items.forEach(el => {
        const inHero = !!el.closest("header#top");
        const kids = Array.from(el.children);
        const grid = getComputedStyle(el).display.indexOf("grid") > -1 && kids.length > 2;
        if (inHero || grid) {
          gsap.from(kids, { y: 34, duration: 0.9, ease: "power3.out", stagger: 0.09, clearProps: "transform",
            scrollTrigger: { trigger: el, start: inHero ? "top 99%" : "top 82%" } });
        }
      });

      // Smooth scrubbed parallax on mountain / motif layers
      gsap.utils.toArray("[data-parallax]").forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        gsap.fromTo(el, { yPercent: -speed * 22 }, { yPercent: speed * 22, ease: "none",
          scrollTrigger: { trigger: el.closest("section, header") || el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Count-up on the altitude stat
      const c = document.querySelector("[data-count]");
      if (c) {
        const target = parseFloat(c.getAttribute("data-count")) || 0;
        const o = { v: 0 };
        gsap.to(o, { v: target, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: c, start: "top 88%" },
          onUpdate: () => { c.textContent = Math.round(o.v).toLocaleString(); } });
      }
    });

    ST.refresh();
  }

  sliderOn() {
    return (this.props.scrollMode || "Classic") === "Slides" && window.innerWidth >= 1000 && window.innerHeight >= 560;
  }

  setMode(relayout) {
    if (!this.viewport || !this.track || !this.slides || this.slides.length < 2) return;
    const on = this.sliderOn();
    if (on === this._mode) { if (on && relayout) this.layout(); return; }
    this._mode = on;
    const dots = document.querySelector("[data-dots]");
    if (on) {
      if (this._io) this._io.disconnect();
      if (this._safety) clearTimeout(this._safety);
      if (this._ctx) { this._ctx.revert(); this._ctx = null; this.gsapActive = false; }
      document.querySelectorAll("[data-parallax]").forEach(el => { el.style.transform = "none"; });
      // Bridged slides' backgrounds must sit in an inset:0 box so they align 1:1 with the fixed frame overlay (no jump)
      this._insetSaved = this._insetSaved || [];
      [this.slides[0], this.slides[1]].forEach(s => {
        const layer = s && s.querySelector("[data-parallax]");
        if (layer && !this._insetSaved.find(r => r.el === layer)) this._insetSaved.push({ el: layer, v: layer.style.inset });
        if (layer) layer.style.inset = "0";
      });
      this.viewport.style.height = "100vh"; this.viewport.style.overflow = "hidden";
      if (dots) dots.style.display = "flex";
      window.scrollTo(0, 0);
      this._items.forEach(el => { el.style.opacity = 0; el.style.transform = "translateY(30px)"; });
      this.layout();
      this.revealSlide(this.slides[this.idx]);
      this._updateDots(); this._navState();
      this._safety = setTimeout(() => this.revealSlide(this.slides[this.idx]), 3000);
      this._classicMorph(false);
    } else {
      this.viewport.style.height = ""; this.viewport.style.overflow = "";
      if (window.gsap) window.gsap.set(this.track, { clearProps: "transform" });
      this.track.style.transition = "none"; this.track.style.transform = "";
      this.slides.forEach(el => {
        const s = this._saved.get(el) || {};
        el.style.height = s.h || ""; el.style.minHeight = s.mh || ""; el.style.overflow = s.ov || "";
        el.style.display = s.d || ""; el.style.flexDirection = s.fd || ""; el.style.justifyContent = s.jc || "";
        el.style.paddingTop = s.pt || ""; el.style.paddingBottom = s.pb || "";
        Array.from(el.children).forEach(c => { c.style.zoom = ""; });
        if (el.hasAttribute("data-slide-full") && el.firstElementChild) el.firstElementChild.style.height = "";
      });
      if (dots) dots.style.display = "none";
      if (this._insetSaved) { this._insetSaved.forEach(r => { r.el.style.inset = r.v || ""; }); }
      if (this.reduce() || !this._io) { this._revealAll(); }
      else {
        this._items.forEach(el => this._io.observe(el));
        this._safety = setTimeout(this._revealAll, 3000);
        this._waitGsap(0);
      }
      if (this.onScroll) this.onScroll();
      this._classicMorph(true);
    }
  }

  _classicMorph(on) {
    const fx = this._fx, A = this._fxA, B = this._fxB, frames = this._fxFrames;
    const hero = this.slides[0], ess = this.slides[1];
    if (!fx || !A || !frames || !hero || !ess) return;
    if (on) {
      if (this._cm) return;
      this._cm = true;
      fx.style.position = "fixed"; fx.style.inset = "0"; fx.style.zIndex = "0"; fx.style.display = "block"; fx.style.visibility = "visible"; fx.style.opacity = "1";
      this._cmSaved = [];
      [hero, ess].forEach(el => {
        const layer = el.querySelector("[data-parallax]");
        const bimg = layer && layer.querySelector("img");
        this._cmSaved.push({ el, bg: el.style.background, pos: el.style.position, z: el.style.zIndex, bimg, iv: bimg ? bimg.style.visibility : null });
        el.style.background = "transparent"; el.style.position = "relative"; el.style.zIndex = "1";
        if (bimg) bimg.style.visibility = "hidden";
      });
      const n = frames.length;
      const setSrc = (el, i) => { const s = frames[Math.max(0, Math.min(n - 1, i))].src; if (el.src !== s) el.src = s; };
      this._cmScroll = () => {
        const vh = window.innerHeight;
        const y = window.scrollY || window.pageYOffset;
        fx.style.display = (y > ess.offsetTop + ess.offsetHeight) ? "none" : "block";
        const start = vh * 0.30, end = vh * 0.98;
        const p = Math.max(0, Math.min(1, (y - start) / (end - start)));
        const pos = p * (n - 1), f = Math.floor(pos), frac = pos - f;
        setSrc(A, f); setSrc(B, f + 1); B.style.opacity = frac.toFixed(3);
      };
      window.addEventListener("scroll", this._cmScroll, { passive: true });
      this._cmScroll();
    } else {
      if (!this._cm) return;
      this._cm = false;
      if (this._cmScroll) { window.removeEventListener("scroll", this._cmScroll); this._cmScroll = null; }
      if (this._cmSaved) { this._cmSaved.forEach(r => { r.el.style.background = r.bg; r.el.style.position = r.pos || ""; r.el.style.zIndex = r.z || ""; if (r.bimg) r.bimg.style.visibility = r.iv || ""; }); this._cmSaved = null; }
      fx.style.display = ""; fx.style.position = "absolute"; fx.style.visibility = "hidden"; fx.style.opacity = "0";
    }
  }

  layout() {
    const h = window.innerHeight;
    this.slides.forEach(el => {
      const full = el.hasAttribute("data-slide-full");
      el.style.height = h + "px"; el.style.minHeight = "0"; el.style.overflow = "hidden";
      el.style.display = "flex"; el.style.flexDirection = "column"; el.style.justifyContent = "flex-start";
      el.style.paddingTop = full ? "0px" : (el.id === "top" ? "96px" : "92px");
      el.style.paddingBottom = full ? "0px" : (el.id === "top" ? "90px" : "56px");
      if (full && el.firstElementChild) el.firstElementChild.style.height = "100%";
      Array.from(el.children).forEach(c => { c.style.zoom = ""; });
    });
    this.slides.forEach(el => {
      const inner = el.scrollHeight;
      if (inner > h + 4) {
        const z = Math.max(0.6, (h - 10) / inner);
        Array.from(el.children).forEach(c => {
          const pos = getComputedStyle(c).position;
          if (pos !== "absolute" && pos !== "fixed") c.style.zoom = z;
        });
      }
      el.style.justifyContent = "center";
    });
    this._setY(this.idx, true);
  }

  _setY(i, instant) {
    const y = -i * window.innerHeight;
    if (window.gsap) {
      if (instant) { window.gsap.set(this.track, { y }); this.animating = false; }
      else window.gsap.to(this.track, { y, duration: 1.05, ease: "power3.inOut", overwrite: true, onComplete: () => this._done() });
    } else {
      this.track.style.transition = instant ? "none" : "transform 1.05s cubic-bezier(.65,0,.35,1)";
      this.track.style.transform = "translate3d(0," + y + "px,0)";
      if (instant) this.animating = false; else setTimeout(() => this._done(), 1080);
    }
  }

  _done() {
    this.animating = false;
    this._cool = Date.now();
    if (this._prev && this._prev !== this.slides[this.idx]) {
      this._prev.querySelectorAll("[data-reveal]").forEach(r => { r.style.opacity = 0; r.style.transform = "translateY(30px)"; });
    }
    this._prev = null;
  }

  goTo(i) {
    if (!this._mode || this.animating) return;
    i = Math.max(0, Math.min(this.slides.length - 1, i));
    if (i === this.idx) return;
    const from = this.idx;
    this._prev = this.slides[from];
    this.idx = i;
    this.animating = true;
    // True cross-transition on the 0↔1 pair: text rides the slide, frames bridge the background
    const pair = Math.min(from, i) === 0 && Math.max(from, i) === 1;
    if (pair) {
      // both slides' content stays fully visible so it travels with the track
      [this.slides[from], this.slides[i]].forEach(s => s.querySelectorAll("[data-reveal]").forEach(r => { r.style.opacity = 1; r.style.transform = "none"; }));
      this._runFx(i > from, this.slides[from], this.slides[i]);
      this._setY(i, false);
    } else {
      this._setY(i, false);
      this.revealSlide(this.slides[i]);
    }
    this._updateDots();
    this._navState();
  }

  _buildFx() {
    if (!this.viewport || this._fx) return;
    this._fxCount = 25;
    this._fxFrames = [];
    for (let k = 1; k <= this._fxCount; k++) {
      const im = new Image();
      im.src = "/home-ref/uploads/frame_" + String(k).padStart(3, "0") + ".jpg";
      this._fxFrames.push(im);
    }
    const fx = document.createElement("div");
    fx.style.cssText = "position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0; visibility:hidden; background:var(--snow);";
    const mk = () => { const i = document.createElement("img"); i.alt = ""; i.style.cssText = "position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; display:block;"; fx.appendChild(i); return i; };
    this._fxA = mk(); this._fxB = mk();
    this.viewport.appendChild(fx);
    if (this.track) this.track.style.zIndex = "1";
    this._fx = fx;
  }

  _runFx(forward, fromEl, toEl) {
    const fx = this._fx, A = this._fxA, B = this._fxB, frames = this._fxFrames;
    if (!fx || !A || !frames) return;
    const n = frames.length, dur = 1.05;
    const setSrc = (el, i) => { const s = frames[Math.max(0, Math.min(n - 1, i))].src; if (el.src !== s) el.src = s; };
    const setFrame = (p) => {
      const t = forward ? p : 1 - p;
      const pos = t * (n - 1);
      const f = Math.floor(pos), frac = pos - f;
      setSrc(A, f); setSrc(B, f + 1);
      B.style.opacity = frac.toFixed(3);
    };
    // Reveal the frame bridge behind the two slides, but KEEP each slide's gradient washes so tints stay consistent (no pop at handoff)
    this._bridged = [];
    [fromEl, toEl].forEach(el => {
      if (!el) return;
      const layer = el.querySelector("[data-parallax]");
      const bimg = layer && layer.querySelector("img");
      this._bridged.push({ el, bg: el.style.background, bimg, iv: bimg ? bimg.style.visibility : null });
      el.style.background = "transparent";
      if (bimg) bimg.style.visibility = "hidden";
    });
    fx.style.visibility = "visible";
    fx.style.opacity = "1";
    setFrame(0);
    const restore = () => {
      if (this._bridged) { this._bridged.forEach(r => { r.el.style.background = r.bg; if (r.bimg) r.bimg.style.visibility = r.iv || ""; }); this._bridged = null; }
    };
    const finish = () => {
      restore();
      const done = () => { fx.style.visibility = "hidden"; };
      if (window.gsap) window.gsap.to(fx, { opacity: 0, duration: 0.2, ease: "power1.out", onComplete: done });
      else { fx.style.transition = "opacity .2s ease"; fx.style.opacity = "0"; setTimeout(done, 220); }
    };
    if (window.gsap) {
      const g = window.gsap, o = { p: 0 };
      g.killTweensOf(o);
      g.to(o, { p: 1, duration: dur, ease: "power2.inOut", overwrite: true,
        onUpdate: () => setFrame(o.p), onComplete: finish });
    } else {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / (dur * 1000));
        setFrame(p);
        if (p < 1) requestAnimationFrame(tick); else finish();
      };
      requestAnimationFrame(tick);
    }
  }

  revealSlide(el) {
    if (!el) return;
    const calm = this.reduce();
    Array.from(el.querySelectorAll("[data-reveal]")).forEach((r, k) => {
      setTimeout(() => { r.style.opacity = 1; r.style.transform = "none"; }, calm ? 0 : 380 + k * 150);
    });
    const c = el.querySelector("[data-count]");
    if (c && !c._hsDone) {
      c._hsDone = true;
      const target = parseFloat(c.getAttribute("data-count")) || 0;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 1800);
        c.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  _buildDots() {
    const wrap = document.querySelector("[data-dots]");
    if (!wrap) return;
    wrap.innerHTML = "";
    this._dots = this.slides.map((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      const label = s.getAttribute("data-slide-label") || ("Slide " + (i + 1));
      b.setAttribute("aria-label", label); b.title = label;
      b.style.cssText = "width:9px;height:9px;border-radius:50%;border:1px solid #fff;background:transparent;cursor:pointer;padding:0;opacity:.55;transition:transform .35s ease,background .35s ease,opacity .35s ease;";
      b.addEventListener("click", () => this.goTo(i));
      wrap.appendChild(b);
      return b;
    });
  }

  _updateDots() {
    if (!this._dots) return;
    this._dots.forEach((b, i) => {
      const on = i === this.idx;
      b.style.background = on ? "#fff" : "transparent";
      b.style.opacity = on ? "1" : ".55";
      b.style.transform = on ? "scale(1.5)" : "scale(1)";
    });
  }

  _navState() {
    const nav = document.querySelector("[data-nav]");
    if (!nav || !this._mode) return;
    const solid = this.idx > 0;
    nav.style.background = solid ? "rgba(254,254,246,0.92)" : "transparent";
    nav.style.backdropFilter = solid ? "blur(10px)" : "none";
    nav.style.boxShadow = solid ? "0 1px 0 rgba(27,44,88,0.08)" : "none";
  }
}

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.gsap = gsap;
      window.ScrollTrigger = ScrollTrigger;
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* already registered */ }
    }
    const deck = new Deck({ scrollMode: "Slides", motionIntensity: "Rich", showGrain: true, showMarquee: true });
    deck.mount();
    return () => deck.unmount();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="hs-home" dangerouslySetInnerHTML={{ __html: HOME_MARKUP }} />
    </>
  );
}
