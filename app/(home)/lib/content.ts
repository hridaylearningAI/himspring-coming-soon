/* Homepage content, lifted out of the markup so copy edits never mean touching
   layout. Everything here is `as const` so the section components get literal
   types rather than `string`, which catches a mistyped gallery filename or a
   dropped nav anchor at build time. */

export type NavLink = { readonly href: string; readonly label: string };

/* The section anchors shared by the nav, the drawer and the footer's Explore
   column. One list, so they can never drift apart.

   Every href has to resolve to an id the homepage actually renders, which is the
   whole reason this is a list and not five hardcoded anchors: the nav and the
   footer cannot each be checked by hand every time a section is added or hidden.

   The labels and their order are the supplied set. Contact is the sixth item in
   the bar but is not here: it is CONTACT_LINK, rendered on the other side of the
   wordmark and appended to the drawer, so listing it here would put it in the bar
   twice.

     Our Story       #formats     the title card, over the film
     The Source      #commitment  the hillside bookend — its own hidden heading
                                  is "The source", so the label names it exactly
     Why Himspring   #purity      the four PURITY_PILLARS claims
     Our Range       #family      the three sizes
     Founder         #founders    the board

   Two things worth knowing rather than discovering.

   The order is the supplied order, not page order. On the page The Source is
   last, after the founders, so this bar runs 1st, 6th, 2nd, 4th, 5th and a reader
   working left to right travels back up the page at the second item. Reordering
   to Our Story / Why Himspring / Our Range / Founder / The Source would fix that
   and is a one-line move here.

   And "Founder" is singular against a board of two. That is the supplied label,
   left as given.

   #action — the journey rail — no longer has a nav entry. It is still on the page
   and still reached by scrolling; it lost its slot to the five supplied labels,
   which have no name for it. */
export const SECTION_LINKS = [
  { href: "#formats", label: "Our Story" },
  { href: "#commitment", label: "The Source" },
  { href: "#purity", label: "Why Himspring" },
  { href: "#family", label: "Our Range" },
  { href: "#founders", label: "Founder" },
] as const satisfies readonly NavLink[];

/* The previous homepage's three, kept for the archived copy at /v1. Its
   sections still exist and are still worth being able to reach; they are just
   no longer on the page the nav is usually rendered over. */
export const LEGACY_SECTION_LINKS = [
  { href: "#source", label: "The Source" },
  { href: "#purity", label: "Purity" },
  { href: "#sustainability", label: "Sustainability" },
] as const satisfies readonly NavLink[];

/* The drawer is the section list plus Contact, whichever list is in play — so
   it is derived in SiteNav from the links it was given rather than declared
   here against one of them. */
export const CONTACT_LINK = { href: "#contact", label: "Contact us" } as const satisfies NavLink;

/* ---- [03] provenance bar ---- */
export type ProvenanceStat = {
  readonly value: string;
  /* rendered as a <sup> after the value — the "M" on "180 to 220" */
  readonly unit?: string;
  readonly key: string;
  /* long values set smaller so all four cells stay on one line */
  readonly wide?: boolean;
};

/* annotated rather than `as const satisfies`: const-narrowing would drop the
   optional `unit` and `wide` keys from the cells that omit them, and the
   component reads both off every cell */
/* The altitude cell that used to sit second is gone, along with every other
   "3,200 m" on the page: the source is in the Shivalik, the outer Himalayan
   foothill range, where that figure is off by a factor of three. Aquifer depth
   takes the slot rather than a corrected altitude — it was already asserted in
   SOURCE_FACTS below, so promoting it adds no new claim, and depth is the more
   meaningful number for a confined-aquifer spring anyway. */
export const PROVENANCE: readonly ProvenanceStat[] = [
  { value: "64", key: "TDS (mg/L)" },
  { value: "180 to 220", unit: "M", key: "Aquifer depth", wide: true },
  { value: "Shivalik Spring", key: "Source", wide: true },
  { value: "7.6", key: "pH balance" },
];

/* ---- [05] the source ---- */
export const SOURCE_FACTS = [
  { term: "Range", detail: "Shivalik, Outer Himalaya" },
  { term: "Aquifer depth", detail: "180 to 220 metres" },
] as const;

/* Was a lat/lon pair pointing at 27°59′ N, 86°42′ E — the Khumbu valley in
   Nepal, on the Everest approach and nowhere near the Shivalik. Replaced with
   the range rather than corrected coordinates: the exact wellhead position is
   not mine to invent, and naming the range is true without faking precision. */
export const SOURCE_PLACE = {
  line1: "Shivalik Range",
  line2: "Outer Himalaya",
} as const;

/* ---- [06] purity ---- */
export type PurityPillar = {
  readonly icon: "altitude" | "pure" | "minerals" | "protected";
  /* split across two lines in the design — kept as an array so the break is
     content, not a <br> buried in a component */
  readonly title: readonly [string, string];
  readonly body: string;
};

export const PURITY_PILLARS = [
  {
    icon: "altitude",
    title: ["Deep Aquifer", "Source"],
    body: "Drawn from a confined aquifer beneath the Shivalik foothills.",
  },
  {
    icon: "pure",
    title: ["Naturally", "Pure"],
    body: "Naturally filtered through ancient sandstone strata.",
  },
  {
    icon: "minerals",
    title: ["Rich in", "Minerals"],
    body: "Naturally occurring minerals for the perfect balance.",
  },
  {
    icon: "protected",
    title: ["Protected &", "Pristine"],
    body: "Source protected by terrain, preserved for generations.",
  },
] as const satisfies readonly PurityPillar[];

/* ---- [08] sustainability ---- */
export const SUSTAINABILITY = [
  {
    title: "Source Preservation",
    body: "We protect our source and surrounding ecosystems for generations to come.",
  },
  {
    title: "Conscious Packaging",
    body: "Our bottles are 100% recyclable and responsibly made with the lightest footprint.",
  },
  {
    title: "Community Commitment",
    body: "We support local communities and the preservation of Himalayan heritage.",
  },
] as const;

/* ---- [09] gallery ---- */
export type GalleryImage = { readonly src: string; readonly alt: string };
export type GalleryColumn = {
  /* travel time for one full -50% cycle. All four are coprime-ish so the field
     never visibly resynchronises into a pattern. */
  readonly duration: string;
  readonly direction: "up" | "down";
  /* which breakpoint drops this column: `md` goes at 900px, `lg` at 1080px.
     The two columns without a breakpoint are always visible, so between them
     they have to carry a still from all ten contexts. */
  readonly dropAt?: "md" | "lg";
  readonly images: readonly GalleryImage[];
};

const still = (slug: string, alt: string): GalleryImage => ({
  src: `/assets/gallery/${slug}.webp`,
  alt,
});
const served = (slug: string, alt: string): GalleryImage => ({
  src: `/assets/gallery/${slug}-served.webp`,
  alt,
});

export const GALLERY_COLUMNS = [
  {
    duration: "41s",
    direction: "up",
    images: [
      still("01-fine-dining", "Himspring on a laid table in a candlelit fine dining room"),
      still("03-private-aviation", "Himspring on a walnut table in a private jet cabin"),
      still("05-executive-boardrooms", "Himspring on a boardroom table against a city skyline"),
      still("07-golf-sporting", "Himspring on a clubhouse rail above a misted fairway"),
      still("09-private-clubs", "Himspring on a marble table in a panelled club lounge"),
    ],
  },
  {
    duration: "53s",
    direction: "down",
    images: [
      still("02-hotels-resorts", "Himspring on a stone table above an infinity pool"),
      still("04-yachts-marinas", "Himspring on a teak deck table with open sea beyond"),
      still("06-automotive-showrooms", "Himspring on a pedestal beside a car in a showroom"),
      still("08-city-run-events", "Himspring on a counter at a city road event at first light"),
      still("10-gourmet-retail", "Himspring on a lit shelf in a gourmet food hall"),
    ],
  },
  {
    duration: "46s",
    direction: "up",
    dropAt: "md",
    images: [
      served("01-fine-dining", "Himspring served at a laid table in a candlelit fine dining room"),
      served("03-private-aviation", "Himspring served at a walnut table in a private jet cabin"),
      served("05-executive-boardrooms", "Himspring served at a boardroom table against a city skyline"),
      served("07-golf-sporting", "Himspring served at a clubhouse rail above a misted fairway"),
      served("09-private-clubs", "Himspring served at a marble table in a panelled club lounge"),
    ],
  },
  {
    duration: "59s",
    direction: "down",
    dropAt: "lg",
    images: [
      served("02-hotels-resorts", "Himspring served at a stone table above an infinity pool"),
      served("04-yachts-marinas", "Himspring served at a teak deck table with open sea beyond"),
      served("06-automotive-showrooms", "Himspring served at a pedestal beside a car in a showroom"),
      served("08-city-run-events", "Himspring served at a counter at a city road event at first light"),
      served("10-gourmet-retail", "Himspring served at a lit shelf in a gourmet food hall"),
    ],
  },
] as const satisfies readonly GalleryColumn[];

/* ---- [09b] contact ----

   Four enquiries that used to share one inbox and one email field. Each is a
   different conversation with a different team, so each gets its own fields and
   its own mailbox; the shared three — name, email, telephone — are declared once
   below and prepended to every topic.

   The field list is data rather than markup because the server has to walk the
   same list to validate and to format the notification. One declaration means a
   field can never be collected and then silently dropped on the way out. */

export type ContactFieldType = "text" | "email" | "tel" | "url" | "select";

export type ContactField = {
  /* also the FormData key and the input id, so it has to stay unique per topic */
  readonly name: string;
  readonly label: string;
  /* default "text" */
  readonly type?: ContactFieldType;
  readonly options?: readonly string[];
  readonly autoComplete?: string;
  readonly placeholder?: string;
  /* everything is required unless it says otherwise: a form that asks for less
     gets answered more often, so only add a field here you would chase */
  readonly optional?: true;
  /* takes one of the two columns instead of the full width. They pair up in
     source order, so `half` fields want to come in twos. */
  readonly half?: true;
};

export type ContactTopicId = "sales" | "media" | "careers" | "support";

export type ContactTopic = {
  readonly id: ContactTopicId;
  readonly label: string;
  /* the one line under the label in the selector — what this queue is for, so
     nobody has to guess which of the four is theirs */
  readonly blurb: string;
  readonly fields: readonly ContactField[];
  /* the message field, which every topic has but none phrase the same way */
  readonly prompt: string;
  readonly placeholder: string;
  /* attach-a-CV control. Only careers sets it. */
  readonly cv?: true;
  /* shown on the confirmation panel — the specific promise, not "we'll be in
     touch", because each team answers on a different clock */
  readonly reply: string;
};

export const CONTACT_BASE_FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", half: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", half: true },
  { name: "phone", label: "Telephone", type: "tel", autoComplete: "tel", optional: true, half: true },
] as const satisfies readonly ContactField[];

/* Annotated rather than `as const satisfies`, for the reason PROVENANCE is:
   const-narrowing would drop `cv` from the three topics that omit it, and both
   the form and the route handler read it off whichever topic is selected.

   The non-empty tuple is what keeps `CONTACT_TOPICS[0]` — the default queue —
   typed as a topic rather than `ContactTopic | undefined` under
   noUncheckedIndexedAccess. */
export const CONTACT_TOPICS: readonly [ContactTopic, ...ContactTopic[]] = [
  {
    id: "sales",
    label: "Sales & Distribution",
    blurb: "Trade orders, territory partnerships and hospitality supply.",
    fields: [
      { name: "company", label: "Company", autoComplete: "organization", half: true },
      { name: "role", label: "Your role", autoComplete: "organization-title", optional: true, half: true },
      { name: "territory", label: "Country or territory", autoComplete: "country-name", half: true },
      {
        name: "enquiry",
        label: "Type of enquiry",
        type: "select",
        half: true,
        options: [
          "Distribution partnership",
          "Wholesale or trade order",
          "Hospitality supply",
          "Retail listing",
          "Something else",
        ],
      },
    ],
    prompt: "Tell us about your business",
    placeholder: "The markets you cover, the accounts you serve, and the volumes you have in mind.",
    reply: "Our trade team answers within two working days.",
  },
  {
    id: "media",
    label: "Media & Influencers",
    blurb: "Press enquiries, features, samples and collaborations.",
    fields: [
      { name: "outlet", label: "Publication or channel", half: true },
      { name: "handle", label: "Website or handle", type: "url", placeholder: "https://", half: true },
      { name: "audience", label: "Audience or circulation", optional: true, half: true },
      { name: "deadline", label: "Your deadline", placeholder: "e.g. 14 August", optional: true, half: true },
    ],
    prompt: "What are you working on?",
    placeholder: "The story, the format, and what you need from us: samples, imagery, an interview.",
    reply: "Our press desk answers within two working days, sooner on a deadline.",
  },
  {
    id: "careers",
    label: "Work at Himspring",
    blurb: "Open roles and speculative applications. Attach your CV.",
    fields: [
      {
        name: "role",
        label: "Role of interest",
        type: "select",
        half: true,
        options: [
          "Operations & bottling",
          "Sales & distribution",
          "Marketing & brand",
          "Design & creative",
          "Supply chain & logistics",
          "Open application",
        ],
      },
      { name: "location", label: "Where you are based", autoComplete: "address-level2", half: true },
      { name: "portfolio", label: "Portfolio or LinkedIn", type: "url", placeholder: "https://", optional: true, half: true },
      { name: "start", label: "Earliest start", placeholder: "e.g. immediately, or 1 September", optional: true, half: true },
    ],
    cv: true,
    prompt: "Why Himspring?",
    placeholder: "A few lines on what you would bring and what you are looking for.",
    reply: "We read every application and reply within ten working days.",
  },
  {
    id: "support",
    label: "Customer Support",
    blurb: "Orders, deliveries, refunds and anything about the water itself.",
    fields: [
      { name: "order", label: "Order number", optional: true, half: true },
      { name: "purchased", label: "Where you bought it", half: true },
      {
        name: "issue",
        label: "What can we help with?",
        type: "select",
        half: true,
        options: [
          "Product quality",
          "Damaged on arrival",
          "Delivery or tracking",
          "Billing or refund",
          "Something else",
        ],
      },
      { name: "batch", label: "Batch code", placeholder: "Printed on the neck", optional: true, half: true },
    ],
    prompt: "What happened?",
    placeholder: "The more detail the better: the batch code, the best-before date, and what you saw.",
    reply: "Support answers within one working day.",
  },
];

/* Attachments, careers only.

   4 MB rather than a rounder 5: a route handler on Vercel takes a 4.5 MB request
   body cap, and the multipart envelope plus the rest of the fields have to fit
   under it alongside the file. A CV that does not fit in 4 MB is a CV with
   uncompressed images in it. */
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.doc,.docx";
/* checked against the extension, not the browser-reported MIME type: Windows
   sends application/octet-stream for .docx often enough that typing on the MIME
   alone rejects real applications */
export const CV_EXTENSIONS = ["pdf", "doc", "docx"] as const;

/* ---- [10] footer ----

   Everything below is a fact about the company rather than a piece of copy, and
   it was already in the repo: the legacy contact page at app/(legacy)/contact
   carries the registered office, and the legacy footer carries the Instagram
   URL. Restated here rather than imported because the two route groups share
   nothing, but it is the same information — if one changes, both have to. */

export const COMPANY = {
  /* The registered entity, which is what a copyright line and a privacy policy
     have to name. "Himspring" alone is the brand. */
  legalName: "Himspring Beverages Pvt. Ltd.",
  /* Not in the footer — it was there briefly and came out again by instruction.
     It stays declared because the legal pages still need it: a privacy policy
     has to identify the company answerable for the data, and an address is how
     that is done. Kept as lines rather than one string so it can be set as a
     block or run inline; legal.ts joins it with commas.

     The telephone number and opening hours were removed outright rather than
     left unused, since nothing renders them now. Both are still on the legacy
     contact page if they are wanted back. */
  address: [
    "407, Skyline Icon, 4th Floor",
    "Nana Mava Main Road",
    "Rajkot, Gujarat 360005",
    "India",
  ],
} as const;

export const CONTACT_EMAIL = "hello@himspring.com";

/* The footer's one navigation column — every destination on the site, named
   once.

   This replaces a pair of columns, About and Explore, that were listing the
   same site twice. About held the five internal pages; Explore held
   SECTION_LINKS, the homepage's anchors. Three labels were in both — Our Story,
   The Source, Why Himspring — so the footer showed each of them twice, side by
   side, going to two different places, and a reader had no way to tell which
   was the real one. "Contact Us" was a fourth repeat, of the Contact column
   immediately to its right.

   The rule that resolves it: where a topic has both a page and a homepage
   section, the page wins. It is the fuller treatment and it is the canonical
   URL, and the homepage's own section is what the fixed bar above is for — a
   footer is where you go to leave the page you are on, not to scroll it.

   Six entries, not five plus five. Order is the nav bar's supplied order, with
   Sustainability appended because it is the one topic the bar has no slot for.
   The last two keep their anchors because they have no page to point at:
   #family is the sizes and #founders is the board, and neither exists anywhere
   but on the homepage. If either is ever given a page, it changes here and
   nowhere else. */
export const FOOTER_LINKS = [
  { href: "/our-story", label: "Our Story" },
  { href: "/the-source", label: "The Source" },
  { href: "/purity", label: "Why Himspring" },
  { href: "/#family", label: "Our Range" },
  { href: "/#founders", label: "Founder" },
  { href: "/sustainability", label: "Sustainability" },
  /* Seventh, and after Sustainability for the same reason it is last: the bar
     above takes the first five, so anything appended here is a footer entry
     only. The journal is writing rather than a pillar of the site, which is the
     right weight for it. */
  { href: "/blog", label: "Journal" },
  /* Eighth, and after Journal for the same reason Journal is after
     Sustainability: the bar above takes the first five, so anything appended
     here is a footer entry only. Sparkling is a sister line with its own page;
     it does not steal a header slot from the still-water story. */
  { href: "/sparkling", label: "Sparkling" },
] as const satisfies readonly NavLink[];

/* The baseline strip. Both of these resolve to real pages under (home) — see
   app/(home)/privacy and app/(home)/terms. */
export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
] as const satisfies readonly NavLink[];

/* Instagram and LinkedIn, in that order.

   An entry with an empty href is declared but not rendered — see SiteFooter. That
   is what LinkedIn is today: the account is wanted, but no URL for it exists
   anywhere in this repo (the legacy site links LinkedIn to href="#" in two
   places, which is where that trail ends). Rendering it against "#" would put
   back exactly the kind of dead link this footer was rebuilt to remove, so it
   stays dark until the real URL lands — at which point it is this one string and
   nothing else. */
export type SocialLink = {
  readonly label: string;
  readonly icon: "instagram" | "linkedin";
  readonly href: string;
};

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "Instagram",
    icon: "instagram",
    /* the account the legacy site links, tracking parameter and all — it is the
       share URL Instagram itself produces */
    href: "https://www.instagram.com/himspring?igsh=MWloMmd4ZmR3ejVsYg==",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "",
  },
];

/* The bar's link set as seen from a page that is not the homepage.

   `#formats` means "the formats section of this document", so on /privacy it
   means nothing at all. This used to be SECTION_LINKS with a / prefixed onto
   every href, which fixed that much — but it also meant the bar on /our-story
   linked "Our Story" to the homepage's #formats, sending a reader off the very
   page they had asked for. And with the footer below pointing the same label at
   /our-story, one page was offering two destinations under one name.

   Derived from FOOTER_LINKS instead, so the bar and the footer cannot disagree:
   where a topic has a page the link is the page, and Our Range and Founder keep
   their homepage anchors because they have nowhere else to go.

   The slice is what keeps the bar to five. home.css measures .hs-nav__set
   against exactly this set — five labels are about 389px of ink, which is what
   makes them fit their column down to 1200px — so a sixth would break a fit
   that was measured rather than guessed. Sustainability is last in FOOTER_LINKS
   for that reason: it is the one topic the bar has no slot for, and putting it
   at the end is what lets this be a slice rather than a second hand-kept list.
   Reorder FOOTER_LINKS and this silently drops whatever falls off the end. */
export const AWAY_SECTION_LINKS = FOOTER_LINKS.slice(0, 5) as readonly NavLink[];

