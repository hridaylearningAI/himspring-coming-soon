/* Next ships types for `*.module.css` only (see next/types/global.d.ts), but the
   two layouts import plain stylesheets for their side effect. TypeScript 7 rejects
   a side-effect import with no declaration (TS2882), so declare them here.

   Deliberately no shape: a plain stylesheet import has no bindings to read, and
   giving it one would invite `import styles from "./home.css"`, which does not
   work outside CSS Modules. */
declare module "*.css";
