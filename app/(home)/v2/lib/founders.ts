/* The founders.

   Ordered as they appear on the board, and the order is the brief: Abdulrahman
   first, Rajdev second. That is also what sets the checkerboard's phase — the
   first founder's portrait takes the top-left square and everything after it
   alternates from there, so reordering this array re-lays the whole board and
   nothing else needs touching.

   `bio` is lorem on purpose. The real copy is coming, and writing plausible
   founder biography as a stand-in is the one kind of placeholder that ships by
   accident, because nothing about it looks unfinished. Lorem cannot be mistaken
   for approved copy. The two are deliberately different lengths so the layout is
   tested against an uneven pair rather than a matched one.

   A plain readonly array rather than the fixed tuple lib/family.ts uses: nothing
   destructures this, so a third founder is one entry here and no other edit. */

export type Founder = {
  readonly id: string;
  /* As displayed. The brief supplied Abdulrahman's name in full caps; it is set
     here in title case because the name is rendered in the display serif at
     40px+ over two lines, and all-caps at that size is a headline, not a name. */
  readonly name: string;
  /* the initials some of the team are known by, set small after the name — only
     Rajdev has one, and inventing one for anybody else would be putting words in
     a real person's mouth */
  readonly alias?: string;
  readonly role: string;
  readonly portrait: string;
  readonly bio: string;
};

export const FOUNDERS: readonly Founder[] = [
  {
    id: "aljabri",
    name: "Abdulrahman Rashed Matar Aljabri",
    role: "Co-Founder & Director — United Arab Emirates",
    portrait: "/assets/founders/aljabri.webp",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "brahmbhatt",
    name: "Rajdev S. Brahmbhatt",
    alias: "RSB",
    role: "Founder & Chairman",
    portrait: "/assets/founders/brahmbhatt.webp",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.",
  },
];
