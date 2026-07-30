/* The founders.

   Ordered as they appear on the board, and the order is the brief: Abdulrahman
   first, Rajdev second. That is also what sets the checkerboard's phase — the
   first founder's portrait takes the top-left square and everything after it
   alternates from there, so reordering this array re-lays the whole board and
   nothing else needs touching.

   Both biographies are now the supplied copy — no lorem left in this file, and
   they arrived almost exactly matched: three paragraphs each, 140 words against
   138, plus a credo of 17 words against 19. That is what the board was drawn for
   and what the placeholder denied it — the two rows are now the same height by
   the copy's own doing rather than by anything done to the layout.

   A plain readonly array rather than the fixed tuple lib/family.ts uses: nothing
   destructures this, so a third founder is one entry here and no other edit.

   `portrait` points at the supplied files in public/ directly, and that is the
   instruction rather than an oversight: these are to be used exactly as
   delivered. Everything that was done to them has been undone — they are not
   re-cropped to the frame, not converted to WebP, and not re-grounded.

   Two consequences worth knowing. The files are 1.2MB and 148KB of PNG against
   the 42KB and 79KB of WebP they replace, so this section is now the heaviest
   image payload on the page.

   And they are different shapes — Abdulrahman's is 1260x1250, very nearly
   square, where Rajdev's is 922x1152, exactly 4:5. The frame holds 4:5 and
   covers, so the square one is cropped to fit: roughly 20% comes off its width,
   taking the outer edges of his arms and some of the chair. That is a display
   crop and not an edit to the file, and it is the accepted trade for both
   portraits being the same shape on the board.

   The percent-encoding is required: both filenames contain a space, and a bare
   space in an img src is not a valid URL. */

export type Founder = {
  readonly id: string;
  /* Stored in title case and displayed in capitals — the uppercasing is
     text-transform in deck.css, not baked in here. That way the string stays the
     name as it is actually written, which is what a screen reader announces and
     what anyone copying it off the page gets; only the rendering shouts. */
  readonly name: string;
  /* the initials someone is known by, set small after the name and bracketed by
     CSS rather than by the string — only Rajdev has one, and inventing one for
     anybody else would be putting words in a real person's mouth */
  readonly alias?: string;
  readonly role: string;
  readonly portrait: string;
  /* The line they lead with, set as a pull quote above the biography. Both
     founders now have one, supplied with their copy. Still optional rather than
     required: a third founder who arrives without a credo should render without
     one, because the alternative is inventing words for a real person. */
  readonly quote?: string;
  /* Paragraphs, not a paragraph. The supplied biography runs to three of them
     and a single string cannot carry the breaks without the component splitting
     on a magic character. */
  readonly bio: readonly string[];
};

export const FOUNDERS: readonly Founder[] = [
  {
    id: "aljabri",
    /* Supplied with the biography, and longer than the name this entry carried
       before — "Abdulrahman Rashed Matar Rashed Al Jabri" against the brief's
       original "Abdulrahman Rashed Matar Aljabri". The second Rashed and the
       split Al Jabri are both in the copy as written, twice, so they are not a
       typo to tidy. */
    name: "Abdulrahman Rashed Matar Rashed Al Jabri",
    /* Also from the supplied copy, replacing "Co-Founder & Director — United
       Arab Emirates" from the original brief. Worth a glance: on the Himspring
       site the trailing "Himspring" is a given, and the territory the old line
       carried is now nowhere on the board. */
    role: "Co-Founder & Director, Himspring",
    portrait: "/ABDULRAHMAN%20RASHED.PNG",
    /* The supplied line had an em dash at the break: "in the details—in
       providing". Removed by instruction, with a comma in its place rather than
       nothing — a bare deletion leaves "lies in the details in providing", where
       "in" reads as attaching to "details" before the sentence corrects itself. */
    quote:
      "True luxury lies in the details, in providing an experience that is refined, authentic, and uncompromising in quality.",
    bio: [
      "Mr. Abdulrahman Rashed Matar Rashed Al Jabri represents a dynamic force in the UAE’s luxury and corporate landscape. A forward-thinking entrepreneur, Abdulrahman has built an exceptional track record of driving innovation and setting new standards across high-end service industries.",
      /* "Rashed", not "Rashid". The supplied write-up spelled the group name
         with an i here while spelling the founder's own name with an e twice in
         the sentence above it, so it was a typo in the source rather than two
         different names. Corrected by instruction — do not put it back when
         reconciling against the original document. */
      "As the CEO of Royal Smart Limousine (RSL), a flagship entity under the Rashed Al Jabri Group of Companies. He has spearheaded the growth of premium transportation solutions across Dubai and Abu Dhabi and his visionary leadership has elevated RSL into a benchmark for luxury mobility, corporate travel, and bespoke client experiences.",
      "With a deep-rooted commitment to excellence and a natural understanding of luxury lifestyles, Abdulrahman brings a sharp strategic vision to Himspring. As Co-Founder and Director, he drives the brand’s mission to deliver pristine Himalayan mineral water to the world’s most exclusive dining tables, five-star hospitality venues, and private residences.",
    ],
  },
  {
    id: "brahmbhatt",
    /* Name without the middle initial, as the supplied write-up heads it; alias
       kept, so the board reads "Rajdev Brahmbhatt (RSB)". The S in RSB has no
       counterpart in the name beside it — that is the point of a shorthand
       somebody is actually known by, and it is the instruction. */
    name: "Rajdev Brahmbhatt",
    alias: "RSB",
    /* Extended from "Founder & Chairman" to match the supplied line, which also
       matches Abdulrahman's — both roles now name the company. */
    role: "Founder & Chairman, Himspring",
    portrait: "/Rajdev%20Bhrambhatt.PNG",
    quote:
      "Pure luxury is created when nature’s rarest gifts are paired with timeless storytelling, meticulous craftsmanship, and commitment to excellence.",
    /* Supplied copy, set as delivered but for two things. The source marked
       "Himspring" and "Indian media fraternity" bold; the emphasis is dropped
       here because bolding the brand name inside its own founder's biography is
       a press-release habit, and the only bold body text on the page would read
       as a defect rather than as stress. And the straight quotes and apostrophes
       are curled, as everywhere else in this file. */
    bio: [
      "As the Founder and Chairman of Himspring, Rajdev Brahmbhatt brings a visionary approach to luxury consumer goods and brand development. Driven by a passion to deliver the untouched, high-altitude purity of the Himalayas to the world’s most elite tables, Rajdev established Himspring as a hallmark of prestige, sophistication, and pure organic luxury.",
      "Prior to founding Himspring, Rajdev built a distinguished career within the Indian media fraternity, orchestrating high-impact narratives, entertainment ventures, and media strategies across dynamic markets. His deep experience in brand architecture, media production, and public engagement gave him a unique perspective on storytelling, a mastery he now applies to positioning Himspring at the apex of global fine dining, five-star hospitality, and luxury lifestyle ecosystems.",
      "By bridging rich media heritage with commercial foresight, Rajdev leads Himspring with an unwavering dedication to provenance, sustainable stewardship, and world-class luxury positioning.",
    ],
  },
];
