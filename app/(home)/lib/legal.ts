/* Privacy Policy and Terms of Use.

   Written against what this application actually does, not from a template. Every
   factual claim below was checked in the source and is true as of the date each
   document carries:

     - the enquiry form and its fields          app/(home)/lib/content.ts
     - what happens to a submission             app/api/contact/route.ts
     - the newsletter route                     app/api/subscribe/route.js
     - analytics                                app/layout.tsx  (@vercel/analytics)
     - cookies and browser storage              none — grepped for document.cookie,
                                                localStorage and sessionStorage
                                                across app/ and found nothing

   That last one is why the cookie section is a flat denial rather than the usual
   hedge. It stops being true the moment anything is added that sets one, and the
   claim has to come out in the same commit that adds it.

   Two things here follow from the registered office rather than from the code,
   and are the parts a lawyer should confirm rather than take from me: the
   retention wording in Privacy §7, which is deliberately stated as a purpose
   rather than a fixed number of months, and the governing-law clause in Terms
   §10. Neither is invented — they are the ordinary position for a company
   registered in Gujarat — but they are legal choices, not facts about the code.

   The DPDP Act 2023 requires a published grievance contact. That is the general
   address here rather than a named officer, because naming one is the company's
   appointment to make. */

import { COMPANY, CONTACT_EMAIL } from "./content";

export type LegalBlock =
  | { readonly kind: "p"; readonly text: string }
  /* a bulleted list — used where the alternative is a paragraph of semicolons */
  | { readonly kind: "list"; readonly items: readonly string[] }
  /* term-and-detail pairs, for the things that are genuinely a table: who
     processes what, and which right is which */
  | { readonly kind: "defs"; readonly items: readonly { readonly term: string; readonly detail: string }[] };

export type LegalSection = {
  readonly heading: string;
  readonly blocks: readonly LegalBlock[];
};

export type LegalDocument = {
  readonly title: string;
  /* the one line under the title — what the document is for, in plain words,
     because nobody reads a legal page that opens in legal language */
  readonly standfirst: string;
  /* display form and machine form of the same date; the second feeds <time> */
  readonly updated: string;
  readonly updatedISO: string;
  readonly sections: readonly LegalSection[];
};

const ADDRESS_INLINE = COMPANY.address.join(", ");

export const PRIVACY: LegalDocument = {
  title: "Privacy Policy",
  standfirst:
    "What this website collects, who handles it, and what you can ask us to do about it.",
  updated: "29 July 2026",
  updatedISO: "2026-07-29",
  sections: [
    {
      heading: "Who we are",
      blocks: [
        {
          kind: "p",
          text: `${COMPANY.legalName} (“Himspring”, “we”, “us”) is the company responsible for this website and for the personal data described below. Our registered office is ${ADDRESS_INLINE}.`,
        },
        {
          kind: "p",
          text: `For anything in this policy, including a request about your own data or a complaint about how we have handled it, write to ${CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      heading: "What we collect",
      blocks: [
        {
          kind: "p",
          text: "There is no account to create on this site, nothing to buy, and no login. The only personal data we receive is what you type into the enquiry form and choose to send.",
        },
        {
          kind: "p",
          text: "Every enquiry carries your name and email address, and your telephone number if you give it. The remaining fields depend on which of the four enquiry types you pick:",
        },
        {
          kind: "defs",
          items: [
            {
              term: "Sales & Distribution",
              detail: "Your company, your role, the territory you cover, and the kind of partnership you have in mind.",
            },
            {
              term: "Media & Influencers",
              detail: "Your publication or channel, a website or handle, your audience size, and your deadline.",
            },
            {
              term: "Work at Himspring",
              detail:
                "The role you are interested in, where you are based, a portfolio or LinkedIn address, your earliest start date, and your CV as a PDF, DOC or DOCX file.",
            },
            {
              term: "Customer Support",
              detail: "Your order number, where you bought the product, what has gone wrong, and the batch code from the bottle neck.",
            },
          ],
        },
        {
          kind: "p",
          text: "Plus, in every case, the message you write. Please do not include anything sensitive in it — health information, government identifiers, or payment details. We never ask for those, and this form is not the place to send them.",
        },
      ],
    },
    {
      heading: "Cookies",
      blocks: [
        {
          kind: "p",
          text: "This site sets no cookies. It stores nothing in your browser between visits, and there is no consent banner because there is nothing to consent to.",
        },
      ],
    },
    {
      heading: "Analytics",
      blocks: [
        {
          kind: "p",
          text: "We use Vercel Web Analytics to count page views and see which pages people reach. It is cookieless: it does not store an identifier on your device and does not follow you to other websites. What we see is aggregate — how many visits a page had, roughly where in the world they came from, and which page sent them — and not a record of what any individual did.",
        },
      ],
    },
    {
      heading: "Who else handles your data",
      blocks: [
        {
          kind: "p",
          text: "Two companies process data on our behalf, under contract and on our instructions. We do not sell personal data, and we do not share it for anyone else's marketing.",
        },
        {
          kind: "defs",
          items: [
            {
              term: "Resend",
              detail:
                "Delivers the email your enquiry becomes, and the acknowledgement that comes back to you. Your enquiry passes through their systems in order to be sent.",
            },
            {
              term: "Vercel",
              detail:
                "Hosts this website and provides the analytics described above. Their servers process the request your browser makes, which necessarily includes your IP address.",
            },
          ],
        },
        {
          kind: "p",
          text: "Both operate outside India, so an enquiry sent from India is processed abroad. We may also disclose data where the law requires it.",
        },
      ],
    },
    {
      heading: "Why we are allowed to hold it",
      blocks: [
        {
          kind: "p",
          text: "You send us an enquiry so that we will answer it, and answering it is what we use the data for. Under Indian law that is your consent, given for a stated purpose; if you are in the UK or EU, it is your consent and our legitimate interest in responding to people who contact our business. We do not use enquiry data to market to you, and we do not add you to a mailing list because you asked a question.",
        },
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        {
          kind: "p",
          text: "Your enquiry lives in our email as correspondence. We keep it for as long as it takes to deal with the matter and for as long afterwards as we are required to keep business records, and then no longer.",
        },
        {
          kind: "p",
          text: "Applications are held for the role you applied to and, unless you tell us otherwise, kept on file in case something suitable opens later. Ask us to delete your application and we will.",
        },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        {
          kind: "p",
          text: `Write to ${CONTACT_EMAIL} and you can ask us to:`,
        },
        {
          kind: "list",
          items: [
            "tell you what personal data of yours we hold, and give you a copy",
            "correct anything about you that is wrong or out of date",
            "delete what we hold, where we are not required to keep it",
            "stop relying on your consent, which you may withdraw at any time",
          ],
        },
        {
          kind: "p",
          text: "You can also complain to your data protection authority — in India, the Data Protection Board; in the UK, the Information Commissioner's Office; in the EU, your national supervisory authority. We would rather you came to us first.",
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          kind: "p",
          text: "This site is not directed at children, and we do not knowingly collect data from anyone under 18. If you believe a child has sent us something, write to us and we will remove it.",
        },
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "p",
          text: "If we change what we collect or who handles it, we change this page and the date at the top of it. The date is the honest record of when it was last true.",
        },
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  title: "Terms of Use",
  standfirst: "The terms on which this website is made available to you.",
  updated: "29 July 2026",
  updatedISO: "2026-07-29",
  sections: [
    {
      heading: "These terms",
      blocks: [
        {
          kind: "p",
          text: `This website is operated by ${COMPANY.legalName}, registered at ${ADDRESS_INLINE}. By using the site you accept these terms. If you do not accept them, please do not use it.`,
        },
      ],
    },
    {
      heading: "What this site is",
      blocks: [
        {
          kind: "p",
          text: "It is a brand and information site. Nothing is sold here: there is no shop, no basket and no payment of any kind. The enquiry form starts a conversation and is not an order, and nothing on this site is an offer capable of being accepted.",
        },
      ],
    },
    {
      heading: "Using the site",
      blocks: [
        {
          kind: "p",
          text: "You may read these pages, and share and print them for your own non-commercial use. You may not:",
        },
        {
          kind: "list",
          items: [
            "copy, republish or sell any part of the site or its contents",
            "use our name, logo, label artwork or photography without written permission",
            "scrape or harvest the site by automated means, or attempt to interfere with it",
            "use the enquiry form to send anything unlawful, misleading or abusive, or to send bulk or unsolicited messages",
          ],
        },
      ],
    },
    {
      heading: "Our intellectual property",
      blocks: [
        {
          kind: "p",
          text: "The Himspring name, the wordmark, the label artwork, the product photography, the text of these pages and the design of the site belong to us or to our licensors, and are protected by copyright and trade mark law. Nothing on this site gives you a licence to use any of it.",
        },
      ],
    },
    {
      heading: "What you send us",
      blocks: [
        {
          kind: "p",
          text: "What you put in the enquiry form should be accurate and yours to send. If you attach a CV, you confirm it is your own and that you are entitled to share the information in it. We handle everything you send in the way described in our Privacy Policy.",
        },
      ],
    },
    {
      heading: "Accuracy",
      blocks: [
        {
          kind: "p",
          text: "We take care over what we publish here, including the figures we give for the water's composition and its source, which are drawn from our own analysis and are typical values rather than a guarantee of any individual bottle. Product presentation, availability and specification may change. Nothing on this site is a warranty, and nothing on it is advice.",
        },
      ],
    },
    {
      heading: "Links to other sites",
      blocks: [
        {
          kind: "p",
          text: "Where we link to somewhere we do not run — a social account, for instance — we do so because we think it is useful. We do not control those sites and are not responsible for them.",
        },
      ],
    },
    {
      heading: "Availability",
      blocks: [
        {
          kind: "p",
          text: "We do not promise that the site will always be available or free of faults. We may change, suspend or withdraw any part of it at any time, and we may do so without notice.",
        },
      ],
    },
    {
      heading: "Liability",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent the law allows, we are not liable for loss arising from your use of this site or from reliance on anything published on it. Nothing in these terms limits liability that cannot lawfully be limited — including for death or personal injury caused by negligence, or for fraud.",
        },
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        {
          kind: "p",
          text: "These terms are governed by the laws of India, and the courts at Rajkot, Gujarat have exclusive jurisdiction over any dispute arising from them.",
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [
        {
          kind: "p",
          text: `Questions about these terms go to ${CONTACT_EMAIL}, or to ${COMPANY.legalName}, ${ADDRESS_INLINE}.`,
        },
      ],
    },
  ],
};
