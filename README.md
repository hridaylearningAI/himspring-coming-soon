# Himspring

Coming-soon landing page for Himspring, built with [Next.js](https://nextjs.org/) (App Router).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Run ESLint                        |

## Structure

```
app/
  layout.js       Root layout — fonts (next/font) + metadata
  page.js         Landing page markup (server component)
  SignupForm.js   Email-capture widget (client component)
  globals.css     All styles
public/           Static assets (video, posters, logo)
_legacy/          Original static HTML source (pre-Next.js, gitignored)
```

## Notes

- Fonts (Playfair Display, Montserrat) are loaded via `next/font/google` and
  exposed as the CSS variables `--font-playfair` / `--font-montserrat`.
- The signup form is currently front-end only. Wire a real backend / Mailchimp
  call where marked in `app/SignupForm.js`.
- Set `NEXT_PUBLIC_SITE_URL` to your production URL so Open Graph image URLs
  resolve correctly (defaults to `https://himspring.com`).
