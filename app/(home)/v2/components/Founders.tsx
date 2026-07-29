import { Fragment, type CSSProperties } from "react";
import Reveal from "../../components/Reveal";
import { FOUNDERS } from "../lib/founders";

/* [05] founders — a chessboard.

   Two people, four squares. Portraits sit on one diagonal and copy on the other,
   which is the whole mechanism: because a portrait square is always Glacier Mist
   Grey and a copy square is always Snow White, putting the portrait on the
   opposite side each row makes every square differ from the ones beside and
   below it. The checker is not authored square by square — it falls out of the
   alternation, so it stays a checker for any number of founders.

   Full-bleed rather than inside .hs-shell. A board with margins around it is a
   diagram of a board; a board that runs to both edges of the viewport is one.

   Placed between the size panels and the return to the hillside, and static on
   purpose. Family is pinned and scrub-driven and Outro is pinned behind it —
   this is the second of the two places in the page where the scroll behaves
   normally, and it is doing the same job for the same reason as InAction: after
   a takeover, somewhere for the eye to stand still.

   DOM order is portrait-then-copy for each founder throughout, which for the
   second founder is the reverse of the visual left-to-right. That is the usual
   trade in an alternating editorial layout and it costs nothing here: there is
   nothing focusable in either square, so no keyboard order to get wrong, and a
   screen reader gets both founders described in the same order as each other. */

export default function Founders() {
  return (
    <section className="hsv-fr" id="founders" aria-labelledby="hsv-fr-t">
      <div className="hsv-fr__head">
        <Reveal as="p" className="hs-eyebrow">
          Founders
        </Reveal>
        {/* Placeholder in the same sense the bios are — written to hold the
            shape until the real line arrives with the copy. */}
        <Reveal as="h2" className="hsv-fr__h hsv-blur" id="hsv-fr-t" delay={90}>
          Two people, one source.
        </Reveal>
      </div>

      <div className="hsv-fr__board">
        {FOUNDERS.map((f, i) => {
          /* Even index puts the portrait left, odd puts it right; the copy takes
             whichever column is left over. One row per founder. */
          const photoCol = i % 2 === 0 ? 1 : 2;
          const copyCol = photoCol === 1 ? 2 : 1;
          const row = i + 1;
          const at = (c: number) =>
            ({ "--c": String(c), "--r": String(row) }) as CSSProperties;

          /* Which edge of the copy square the portrait is on.
             That one fact drives everything that binds a pair together — see
             .hsv-fr__cell--seam-l / --seam-r. */
          const seam = copyCol === 2 ? "l" : "r";

          /* A Fragment and not a wrapper div: both squares have to be children
             of the board's own grid, and any element around them would become
             one grid item holding two cells. `display: contents` would undo
             that, but a Fragment never creates the problem. */
          return (
            <Fragment key={f.id}>
              <figure className="hsv-fr__cell hsv-fr__cell--photo" style={at(photoCol)}>
                <Reveal className="hsv-fr__frame hsv-blur">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the
                      frame's width is a min() of a vw clamp and an svh term, so
                      there is no authored px width for next/image to size a
                      srcset from; both files are pre-cut to the frame's 4:5 at
                      1200x1500 and come in under 80KB, which is smaller than the
                      largest step a srcset would have produced anyway */}
                  <img src={f.portrait} alt={f.name} loading="lazy" decoding="async" />
                </Reveal>
              </figure>

              <div
                className={`hsv-fr__cell hsv-fr__cell--copy hsv-fr__cell--seam-${seam}`}
                style={at(copyCol)}
              >
                <div className="hsv-fr__copy">
                  <Reveal as="p" className="hsv-fr__index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </Reveal>
                  <Reveal as="h3" className="hsv-fr__name hsv-blur" delay={70}>
                    {f.name}
                    {f.alias ? <span className="hsv-fr__alias">{f.alias}</span> : null}
                  </Reveal>
                  <Reveal as="p" className="hsv-fr__role" delay={130}>
                    {f.role}
                  </Reveal>
                  <Reveal as="p" className="hsv-prose hsv-blur" delay={190}>
                    {f.bio}
                  </Reveal>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
