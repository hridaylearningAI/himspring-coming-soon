import { AWAY_SECTION_LINKS } from "../lib/content";
import type { LegalBlock, LegalDocument } from "../lib/legal";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

/* The shell both legal pages render into.

   One component rather than two near-identical pages, because the only thing
   that differs between Privacy and Terms is the document — and a document is
   data here, not markup. Adding a third (a cookie notice, say, if this site ever
   sets one) is a new entry in lib/legal.ts and a four-line page file.

   Nav and footer come from here rather than from each page for the same reason.
   Both are passed AWAY_SECTION_LINKS and origin="/", which is what makes the
   furniture work off the homepage: every anchor in it is an in-page one, so
   without the prefix a visitor on /privacy who clicks "The Water" gets nothing
   at all.

   Deliberately not measured in a grid or ruled like the rest of the site. This
   is the one place on it somebody is reading rather than looking, and long-form
   text wants a single column, a generous measure and nothing in the margins. */

function Block({ block }: { readonly block: LegalBlock }) {
  if (block.kind === "p") return <p>{block.text}</p>;

  if (block.kind === "list") {
    return (
      <ul className="hs-legal__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  /* A real <dl>: each of these is a term and what it means, which is the one
     structure screen readers announce as a pair. */
  return (
    <dl className="hs-legal__defs">
      {block.items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function LegalDoc({ doc }: { readonly doc: LegalDocument }) {
  return (
    <>
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main" className="hs-legal">
        <div className="hs-legal__shell">
          <header className="hs-legal__head">
            <p className="hs-eyebrow">Legal</p>
            <h1 className="hs-legal__h">{doc.title}</h1>
            <p className="hs-legal__standfirst">{doc.standfirst}</p>
            {/* The date is the document's honest claim about itself: it says
                when this text was last true, which is the only thing that makes
                a policy checkable. <time> so it is machine-readable too. */}
            <p className="hs-legal__date">
              Last updated <time dateTime={doc.updatedISO}>{doc.updated}</time>
            </p>
          </header>

          {doc.sections.map((section, i) => (
            <section className="hs-legal__sec" key={section.heading}>
              <h2>
                {/* Numbered so the sections can be cited — "Privacy §5" means
                    something to a reader and to us. Generated from position
                    rather than authored, so inserting one renumbers the rest. */}
                <span className="hs-legal__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              {section.blocks.map((block, b) => (
                /* eslint-disable-next-line react/no-array-index-key -- a fixed
                   authored sequence, never reordered or filtered */
                <Block block={block} key={b} />
              ))}
            </section>
          ))}
        </div>
      </main>

      <SiteFooter links={AWAY_SECTION_LINKS} />
    </>
  );
}
