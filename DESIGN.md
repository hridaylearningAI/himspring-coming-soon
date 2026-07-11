---
name: Himspring
description: Premium Himalayan spring water — purity for the world's elite.
colors:
  snow-white: "#FAFBFC"
  mist: "#EEF0F2"
  art-field: "#F4F5F6"
  banner-field: "#E9EBED"
  himalayan-ink: "#0E2338"
  navy-deep: "#0A1D33"
  stone: "#4D5C6A"
  hairline: "#0E23381F"
  himalayan-gold: "#A8813F"
  gold-text: "#82612B"
  gold-soft: "#C9B77E"
  error: "#A04B2F"
typography:
  display:
    fontFamily: "Tinos, 'Times New Roman', Times, serif"
    fontSize: "clamp(38px, 5.4vw, 92px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Tinos, 'Times New Roman', Times, serif"
    fontSize: "clamp(32px, 4vw, 66px)"
    fontWeight: 400
    lineHeight: 1.12
  title:
    fontFamily: "Tinos, 'Times New Roman', Times, serif"
    fontSize: "19px"
    fontWeight: 400
    letterSpacing: "0.01em"
  kicker:
    fontFamily: "Tinos, 'Times New Roman', Times, serif"
    fontSize: "clamp(15px, 1.3vw, 19px)"
    fontWeight: 400
    letterSpacing: "0.02em"
  logotype:
    fontFamily: "Tinos, 'Times New Roman', Times, serif"
    fontSize: "30px"
    fontWeight: 400
  lede:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.75
  body:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.7
  input:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 300
  small:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 300
    lineHeight: 1.65
  caption:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 300
  legal:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 300
  label:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.22em"
  nav:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "10.5px"
    fontWeight: 500
    letterSpacing: "0.22em"
  micro:
    fontFamily: "Gotham, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 500
    letterSpacing: "0.3em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  section: "clamp(80px, 11vw, 156px)"
  gutter: "clamp(40px, 6vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.himalayan-ink}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-primary-hover:
    backgroundColor: "{colors.navy-deep}"
  button-ghost:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.himalayan-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  input-field:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.himalayan-ink}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
---

# Design System: Himspring

## 1. Overview

**Creative North Star: "The White Silence"**

The page is a near-white gallery at altitude. Whisper-gray monochrome illustrations — mountains, valleys, a single falling drop — sit frameless in fields of their own tone, so the artwork and the page share one atmosphere rather than being pictures in boxes. Negative space is the primary material; brand navy ink and a rare gold flourish are the only voices that speak above the silence. Sophistication comes from restraint executed precisely, never from ornament.

The system explicitly rejects mass-market water-brand aesthetics (loud labels, price-led shelf noise), sporty energy branding, generic startup-landing-page templates, and overdone luxury clichés — gold is a whisper, never foil. Depth is flat: hairlines and tonal shifts, not shadows.

**Key Characteristics:**
- Near-white monochrome canvas; artwork blends into the page
- Serif-led hierarchy (Tinos/Times) with Gotham for quiet utility text
- One recurring flourish: the gold serif-italic kicker
- Flat surfaces, hairline borders, tonal section fields
- Vast, varied section spacing — the page breathes like thin air

## 2. Colors

A whisper-neutral field with a deep navy voice and a single gold accent — the palette of snow, stone, and altitude light.

### Primary
- **Himalayan Ink** (#0E2338): the voice of the brand on screen — all display type, body headings, buttons, nav, and the feature icons. Deeper than the brand book's print navy (#1B2C58) for on-screen contrast; the print navy remains canonical for packaging.
- **Himalayan Gold** (#A8813F): the one accent, in graphic roles only — focus rings, hover responses, large accents (3:1 graphics floor). Its rarity is the point.

### Secondary
- **Text Gold** (#82612B): gold as running text on light fields — kickers, journey numbers, form status notes. Darker than Himalayan Gold so 12–19px text holds ≥4.5:1 on Snow and Mist.
- **Gold Soft** (#C9B77E): gold's quieter register on dark ground — footer monogram and hovers over navy.

### Neutral
- **Snow White** (#FAFBFC): the page base.
- **Mist** (#EEF0F2): tinted band backgrounds (CTA).
- **Art Field** (#F4F5F6) and **Banner Field** (#E9EBED): section backgrounds matched to the artwork's own tones so full-bleed images blend seamlessly.
- **Stone** (#4D5C6A): secondary/body text on light fields (AA at 15px light weight).
- **Hairline** (#0E23381F): every border and divider — 1px, always.
- **Navy Deep** (#0A1D33): the footer's dark ground and button hover.

### Named Rules
**The One Gold Rule.** Gold speaks in exactly one voice: the serif-italic text family (kicker, journey numbers, status notes — one visual system). Icons and other graphics stay ink; if a second gold system appears in a fold, demote it to ink. Text gold on light fields is always Text Gold (#82612B), never Himalayan Gold.
**The Field-Match Rule.** Any full-bleed artwork sits on a section background sampled from the artwork's own field, so crops and overflow are invisible.

## 3. Typography

**Display Font:** Tinos (metric twin of Times New Roman, with Times fallback)
**Body Font:** Gotham (local .otf, system-ui fallback)

**Character:** A classical serif carrying all the emotion, grounded by a disciplined geometric sans doing the quiet work — the brand book's pairing of timeless elegance and modern structure.

### Hierarchy
- **Display** (400, clamp(38px→92px), 1.05, -0.015em): the hero headline only.
- **Headline** (400, clamp(32px→66px), 1.12): section headings, max 20ch, `text-wrap: balance`.
- **Title** (400, 19px serif): feature and journey item titles — serif, never uppercase.
- **Kicker** (serif italic, clamp(15px→19px), gold): the section lead-in — the brand's single recurring flourish.
- **Body** (300, 15px, 1.7, Stone): paragraphs, max 52ch. The hero lede runs one step up (16px).
- **Label** (600, 11px, 0.22em tracking, uppercase, Gotham): buttons and text links.
- **Utility micro-ramp** (Gotham): input 14px, small copy 13.5px, captions 12.5px, legal 11.5px, nav 10.5px, footer tag 9px. The quiet end of the scale; nothing expressive lives here.

### Named Rules
**The Serif-Speaks Rule.** Anything expressive is serif; Gotham is reserved for utility (body, labels, nav). If a heading is set in Gotham, it's wrong.

## 4. Elevation

Flat plus hairlines. Surfaces carry no shadows at rest; depth comes from 1px hairline borders (#0E23381F) and tonal field shifts between sections (Snow → White → Art Field → Banner Field → Navy). The only shadowed elements are true floaters — the story play button (`0 10px 30px rgba(14,35,56,0.18)`) — and the scrolled header, which gains a frosted blur backdrop instead of a shadow.

### Named Rules
**The Flat-At-Rest Rule.** If an element isn't floating above the page in z-space (play button, fixed header), it gets a hairline, not a shadow.

## 5. Components

### Buttons
- **Shape:** full pill (999px radius)
- **Primary (`btn--ink`):** Himalayan Ink fill, white 11px uppercase label, 15px 28px padding; hover deepens to Navy Deep with a -1px lift.
- **Ghost (`btn--ghost`):** white fill, hairline border, ink label; hover swaps the border to gold.
- **Focus:** 2px gold outline, 3px offset — everywhere.

### Inputs / Fields
- **Style:** white pill, hairline border, 16px 26px padding, Gotham 300.
- **Focus:** gold border plus a soft gold ring (`0 0 0 3px rgba(168,129,63,0.14)`); global focus-visible is a 2px gold outline with 6px radius (`rounded.sm`).
- **States:** status note below in gold; error text uses the Error token (#A04B2F).

### Cards / Containers
Cards are avoided. Imagery is frameless: 1px hairline border, 12–16px radius, background matched to the artwork field. Journey items are image + caption stacks with an italic gold number — no card chrome. On hover, the image alone scales 1.045 over 0.7s.

### Navigation
- Fixed header, transparent over the hero; on scroll gains frosted white (92% + 12px blur) and a hairline bottom border.
- Links: 10.5px uppercase Gotham, gold underline on hover. Nav hides below 880px (no hamburger — deliberate).

### Signature Component: The Kicker
Every section opens with a gold serif-italic phrase ("Born above. Pure by nature.") — the one recurring ornament that replaces eyebrow labels, rules, and icons above headings.

## 6. Do's and Don'ts

### Do:
- **Do** blend artwork into the page: match section backgrounds to the image's own field (#F4F5F6, #E9EBED) and keep images frameless behind a 1px hairline.
- **Do** keep gold under 10% of any viewport — the serif-italic text voice only, with Text Gold (#82612B) whenever gold is text on a light field.
- **Do** use serif for every expressive moment and reserve Gotham for utility text.
- **Do** honor `prefers-reduced-motion` with instant alternatives for the intro, reveals, and smooth scroll.
- **Do** hold body text at Stone (#4D5C6A) or darker — AA contrast is the floor.

### Don't:
- **Don't** drift toward mass-market water brands — no loud labels, badges, price flashes, or shelf-shouting compositions.
- **Don't** borrow sporty energy branding: no splashy action shots, aggressive saturation, or dynamic slants.
- **Don't** build generic startup-landing-page furniture: no gradient blobs, identical icon-card grids, hero-metric rows, or stock people.
- **Don't** indulge luxury clichés: no gold foil textures, black-and-gold drenches, or ornate serif excess — if gold covers more than an accent, it's costume.
- **Don't** put shadows on resting surfaces or colored side-stripe borders on anything.
- **Don't** use cream/beige warmth — the cold is the brand; neutrals stay cool.
