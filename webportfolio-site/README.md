# You Rim Nam — Portfolio

Next.js + Tailwind + Motion. Light/dark mode, scroll animations, static export.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit your content

Everything lives in `src/data/`:

- `projects.ts` — every project (text, details, images). Each project has a `cover` image;
  **MBGNA Posters** and **SoundScape** have none yet, so they show a typographic placeholder.
  Add one by uncommenting the `cover:` line and pointing it at an image.
- `site.ts` — name, tagline, email, links, profile photo.
- `exhibitions.ts` — the exhibition list on the Misc page.

### Images
Images currently load from your Framer site. If you ever unpublish Framer they will break, so
download them into `public/work/<project>/` and point `src` at e.g. `/work/umgpt/cover.png`.
(When hosting under a sub-path like GitHub Pages project sites, prefix with your base path —
or use the `fr()` helper pattern with absolute URLs.)

## Publish on GitHub Pages

1. Commit and push this folder to your repo (`main` branch).
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` now builds and deploys automatically (`.github/workflows/deploy.yml`).

The site appears at `https://<username>.github.io/<repo>/` — or at
`https://<username>.github.io/` if the repo is named `<username>.github.io`.

### Or: Vercel (no config needed)
Import the GitHub repo at vercel.com/new. Leave `NEXT_PUBLIC_BASE_PATH` unset.

### Custom domain
Add it in Settings → Pages, then remove the base-path logic from the workflow
(set `NEXT_PUBLIC_BASE_PATH=""`).
