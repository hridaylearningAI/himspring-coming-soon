"use client";

import { Icon } from "./icons";

const DIFFERENCES = [
  {
    icon: Icon.mountain,
    val: "6000+ ft",
    label: "Protected Himalayan Source",
    desc: "Sourced from pristine artesian aquifers high in the Shivalik ranges."
  },
  {
    icon: Icon.drop,
    val: "Centuries",
    label: "Natural Filtration",
    desc: "Filtered slowly through ancient volcanic basalt and mineral rock."
  },
  {
    icon: Icon.leaf,
    val: "0 Artificial Treatment",
    label: "Bottled Exactly as Nature Intended",
    desc: "Preserved at its origin with absolutely zero chemical processing."
  },
  {
    icon: Icon.minerals,
    val: "Naturally Balanced",
    label: "Essential Mineral Composition",
    desc: "Intact electrolytes with a remarkably smooth, sweet finish."
  }
];

export default function PurityBento() {
  return (
    <div className="purity-editorial">
      <div className="purity-editorial__statement" data-reveal>
        <span className="purity-editorial__rule" aria-hidden="true" />
        <h3 className="purity-editorial__subhead">
          Nature&apos;s Finest. <br /><em>Reserved for the Few.</em>
        </h3>
      </div>

      <div className="purity-diff-grid">
        {DIFFERENCES.map((diff, idx) => (
          <div
            key={idx}
            className="purity-diff-item"
            data-reveal
            style={{ "--rd": `${80 + idx * 70}ms` }}
          >
            <div className="purity-diff-item__top">
              <span className="purity-diff-icon" aria-hidden="true">{diff.icon}</span>
              <span className="purity-diff-val">{diff.val}</span>
            </div>
            <h4 className="purity-diff-label">{diff.label}</h4>
            <p className="purity-diff-desc">{diff.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
