import type { CSSProperties } from "react";
import { ACTION_COLUMNS, type ActionCard, type ActionColumn } from "../lib/action";

/* [03] Himspring in Action — columns of cards drifting past a fading window.

   Ported from the live-site branch's #journey rail. The mechanism there was
   split between markup and JS: the markup authored a --dur per column, and a
   _buildJourneyLoop() pass on load cloned cards until each column was tall
   enough, duplicated the result for the seam, then overwrote --dur so every
   column drifted at the same pixels per second. The authored durations were
   dead — computed ones replaced them before the first frame.

   All of that happens here at render instead, for the same reason Gallery.tsx
   renders its second set on the server: a rail that assembles itself on load
   reflows once hydration lands, and this one sits between two pinned sections
   where a reflow is very visible.

   Equal speed rather than equal duration is the part worth preserving. Columns
   of unequal height given equal durations drift at visibly different speeds,
   and the rail stops reading as one surface. Direction alternates instead —
   that is what keeps the columns from locking into rows. */

/* px per second — a calm, even drift, carried over from the live rail */
const SPEED = 46;
/* .hsv-jr__card margin-bottom, needed here because the drift duration is
   derived from the column's real height. Keep the two in step. */
const CARD_GAP = 20;
/* How many times the authored cards repeat inside one set.

   The loop translates a column by exactly -50%, so a column must hold two
   identical sets for the seam to land on matching content. For no gap at the
   loop point, one set also has to be at least a viewport tall: the column
   covers viewport + set at the moment it wraps. The authored cards sum to
   roughly 800-900px, so a single repeat would tear on any tall window. Two
   gives a set of 1600-1800px, which clears any realistic viewport. */
const REPEATS = 2;

function setHeight(cards: readonly ActionCard[]) {
  const once = cards.reduce((sum, c) => sum + c.h + CARD_GAP, 0);
  return once * REPEATS;
}

function Card({ card, hidden }: { card: ActionCard; hidden: boolean }) {
  const style = { height: `${card.h}px` } as CSSProperties;

  if (card.kind === "label") {
    return (
      <div
        className={`hsv-jr__card hsv-jr__card--label hsv-jr__card--${card.tone}`}
        style={style}
        {...(hidden ? { "aria-hidden": true } : {})}
      >
        <span>
          {card.lines[0]}
          <br />
          {card.lines[1]}
        </span>
      </div>
    );
  }

  return (
    <div className="hsv-jr__card" style={style} {...(hidden ? { "aria-hidden": true } : {})}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height
          cards the picture is cropped into; the columns overflow by design and
          that overflow is the animation */}
      <img src={card.src} alt={hidden ? "" : card.alt} loading="lazy" decoding="async" />
    </div>
  );
}

function Column({ column }: { column: ActionColumn }) {
  const classes = [
    "hsv-jr__col",
    `hsv-jr__col--${column.direction}`,
    column.dropAt ? `hsv-jr__col--${column.dropAt}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const dur = Math.max(24, Math.round(setHeight(column.cards) / SPEED));

  /* Two sets. The second is the seam duplicate and carries aria-hidden, so a
     screen reader gets each picture's description once rather than four times. */
  return (
    <div className={classes} style={{ "--dur": `${dur}s` } as CSSProperties}>
      {[false, true].map((isClone) =>
        Array.from({ length: REPEATS }).map((_, r) =>
          column.cards.map((card, i) => (
            <Card card={card} hidden={isClone} key={`${isClone ? "c" : "o"}-${r}-${i}`} />
          )),
        ),
      )}
    </div>
  );
}

/* No copy plate. It used to float over the middle of the rail — an eyebrow, a
   heading and a lede — holding for a beat on arrival and then fading so the
   pictures were unobstructed. Removed by instruction, and with it ActionPanel,
   the client component that owned that timing.

   Two consequences worth stating rather than leaving to be discovered.

   The section is no longer named. It carried aria-labelledby pointing at that
   heading, and a labelled <section> is a region landmark — one containing
   nothing but aria-hidden pictures would be a landmark a screen reader can
   enter and find empty, which is worse than not being a landmark at all. So the
   attribute is gone rather than replaced with an aria-label: unnamed, this is
   not exposed as a region, and the rail is what it now actually is, which is
   decoration between two sections that do carry copy.

   And this section is now silent to assistive technology, since the columns are
   aria-hidden. That was already true whenever the plate had faded; it is simply
   true from the start. Nothing here was information — the pictures are the
   argument the surrounding sections make in words. */
export default function InAction() {
  return (
    <section className="hsv-jr" id="action">
      {/* Reading every photo caption would be a penalty for using a screen
          reader, and there is nothing in them the page does not say elsewhere. */}
      <div className="hsv-jr__cols" aria-hidden="true">
        {ACTION_COLUMNS.map((column, i) => (
          <Column column={column} key={i} />
        ))}
      </div>

      {/* top and bottom fade, so the columns arrive and leave rather than being
          cut off by the section edge */}
      <div className="hsv-jr__mask" aria-hidden="true" />
    </section>
  );
}
