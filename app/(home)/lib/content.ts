/* Homepage content, lifted out of the markup so copy edits never mean touching
   layout. Everything here is `as const` so the section components get literal
   types rather than `string`, which catches a mistyped gallery filename or a
   dropped nav anchor at build time. */

export type NavLink = { readonly href: string; readonly label: string };

/* The section anchors shared by the nav, the drawer and the footer's Explore
   column. One list, so they can never drift apart.

   These are the homepage's sections — the deck, since it took over `/`. Every
   href here has to resolve to an id that page actually renders, which is the
   whole reason this is a list and not four hardcoded anchors: the nav and the
   footer cannot each be checked by hand every time a section is added or
   hidden. `#source` is deliberately absent — Detail owns it and the deck gates
   Detail behind SHOW_ANALYSIS, so it would be a link to nothing. */
export const SECTION_LINKS = [
  { href: "#formats", label: "The Water" },
  { href: "#action", label: "In Action" },
  { href: "#family", label: "The Family" },
  { href: "#founders", label: "Founders" },
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
export const CONTACT_LINK = { href: "#contact", label: "Contact" } as const satisfies NavLink;

/* ---- [03] provenance bar ---- */
export type ProvenanceStat = {
  readonly value: string;
  /* rendered as a <sup> after the value — the "M" on 180–220 */
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
  { value: "180–220", unit: "M", key: "Aquifer depth" },
  { value: "Shivalik Spring", key: "Source", wide: true },
  { value: "7.6", key: "pH balance" },
];

/* ---- [05] the source ---- */
export const SOURCE_FACTS = [
  { term: "Range", detail: "Shivalik, Outer Himalaya" },
  { term: "Aquifer depth", detail: "180–220 metres" },
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
    placeholder: "The story, the format, and what you need from us — samples, imagery, an interview.",
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
    placeholder: "The more detail the better — the batch code, the best-before date, and what you saw.",
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

/* The footer's About column is gone, and this is the note explaining why so it
   is not re-added by someone reading a three-column footer as unfinished.

   It held three href="#" placeholders — Our Story, Craft & Design, Hospitality —
   and was briefly pointed at /our-story, /the-source, /purity and
   /sustainability, which do exist and do return 200. The trouble is what they
   are: pre-redesign pages, navy palette, the retired hs monogram, the cloud
   intro overlay. They were the only links on the new site that left it, and a
   visitor following one landed somewhere that did not look like where they came
   from.

   So the footer now links only to things built in the current design. Those four
   pages stay reachable by URL and stay in the repo; when they are rebuilt, this
   column comes back as a list here and a block in SiteFooter. */

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

/* The in-page anchors as seen from a page that is not the homepage.

   `#formats` means "the formats section of this document", so on /privacy it
   means nothing at all. Prefixing with / makes it a link to that section of the
   homepage instead. The legal pages pass these to the nav and footer; the
   homepage passes nothing and gets the bare anchors. */
export const AWAY_SECTION_LINKS = SECTION_LINKS.map((link) => ({
  href: `/${link.href}`,
  label: link.label,
})) as readonly NavLink[];
