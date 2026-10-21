# robertogrosso.design

Portfolio of Roberto Grosso, Lead Product Designer (Lisbon). Designed on a canvas, built with Claude Code, and run on its own token-driven design system.

## What's in here

| Path | What it is |
| --- | --- |
| `tokens/tokens.json` | The single source of truth: colour, type, spacing, radius. DTCG-style, with aliases. |
| `scripts/build-tokens.mjs` | Compiles tokens to `src/styles/tokens.css`. Runs before `dev` and `build`. |
| `scripts/drift.mjs` | **Token drift detector.** Compares `tokens.json` with Figma variables and writes `public/drift-report.json` (shown in the footer and on `/lab/drift`). |
| `figma/variables.json` | Figma variables snapshot (Figma REST API `meta` shape), used when no Figma token is set. |
| `.github/workflows/drift.yml` | Runs the drift check daily and commits the fresh report. |
| `src/lab/ValueExplorer.tsx` | Guided value explorer (the MVI guided-view pattern on open data). |
| `src/lab/explain.ts` | The explain layer. Deterministic today; swap in a model by keeping the same return shape. |
| `src/components/ai.tsx` | AI interaction pattern components (streaming, citations, confidence, refusal). |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tokens → drift check → typecheck → build
npm run drift -- --strict   # exit 1 on drift (CI)
```

## Connect real Figma

1. In Figma, create a personal access token with `file_variables:read`.
2. In the GitHub repo: Settings → Secrets → Actions, add `FIGMA_TOKEN` and `FIGMA_FILE_KEY` (the key from the file URL).
3. Locally: `FIGMA_TOKEN=… FIGMA_FILE_KEY=… npm run drift -- --snapshot` to replace the bootstrap snapshot with your real variables.

Figma variable names map with `/` → `.`, so `color/bg/page` ↔ `color.bg.page`. Note: the Variables REST API needs a Figma Enterprise plan; on other plans, export variables to `figma/variables.json` with a plugin in the same shape.

## Before going live — fill these in

Search the code for `[` placeholders:

- `src/data/site.ts` — LinkedIn URL, GitHub repo URL, job years.
- `public/cv.pdf` — add your CV. `public/og.png` — a 1200×630 social image.
- `src/pages/CaseStudyMVI.tsx` — before-state, outcomes with numbers, the "How AI was used" strip, real NDA-safe images.
- `src/pages/HowBuilt.tsx` — build time, your own decisions and rejections.
- `src/lab/ValueExplorer.tsx`, `src/pages/AIForTeams.tsx` — draft copy written in your voice; rewrite anything that isn't how you'd say it.
- `src/data/companies.ts` — illustrative data; swap in real public filings if you want.

## Deploy

Vercel or Netlify, build command `npm run build`, output `dist`. SPA fallbacks are included (`vercel.json`, `public/_redirects`).
