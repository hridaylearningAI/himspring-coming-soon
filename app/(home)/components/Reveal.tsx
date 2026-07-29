"use client";

import { createElement, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";
import { useReveal } from "../lib/useReveal";

/* Applies .reveal / .is-visible to whatever element it is asked to be.

   Polymorphic on purpose: in the design the class sits directly on the <p>, <h1>
   or grid child, and wrapping those in a spare <div> would break the sibling and
   grid-child selectors the layout depends on (.hs-body + .hs-body, the four
   .hs-prov__cell columns, .hs-sus__item's own grid). */

type RevealOwnProps<T extends ElementType> = {
  as?: T;
  /* staggered entrance, in ms — feeds the --delay custom property the CSS reads */
  delay?: number;
};

type RevealProps<T extends ElementType> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

export default function Reveal<T extends ElementType = "div">({
  as,
  delay,
  ...rest
}: RevealProps<T>) {
  const { ref, visible } = useReveal<HTMLElement>();

  const { className, style, ...attrs } = rest as {
    className?: string;
    style?: CSSProperties;
  } & Record<string, unknown>;

  const classes = ["reveal", visible ? "is-visible" : null, className]
    .filter(Boolean)
    .join(" ");

  return createElement((as ?? "div") as ElementType, {
    ...attrs,
    ref,
    className: classes,
    style: delay === undefined ? style : { ...style, "--delay": `${delay}ms` },
  });
}
