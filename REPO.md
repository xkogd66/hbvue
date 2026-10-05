# hbvue-pix — EKSKOG 365

## Overview

Vue 3 photo gallery SPA that displays daily photos from an object store.
App name: **EKSKOG 365**. Docker image: `lucarv/365vue`.

## Views & Navigation

| View | Route | Description |
|---|---|---|
| LandingPage | `/` or `/landing` | Random photo + form to pick month or specific day |
| ImageGrid | (programmatic, via LandingPage) | All photos for a given month/year |
| DayAcrossYears | `/#/day/:month/:day` | Same day across all years 2010–current |

Navigation uses `$emit('home')` and `$emit('navigate', { month, year | day, month })` from child to parent.

## Components

| File | Role |
|---|---|
| `src/App.vue` | Root — manages `currentView` state ('landing', 'month', 'dayAcrossYears') |
| `src/components/LandingPage.vue` | Home — random picture + month/day selector form |
| `src/components/RandomPicture.vue` | Fetches random date 2017–now, builds image URL, refreshes every 10s |
| `src/components/ImageGrid.vue` | Month grid with prev/next month arrows, ImageOverlay integration |
| `src/components/ImageGrid_AXIOS.vue` | Unused variant — uses axios, not wired into App.vue |
| `src/components/ImageThumbnail.vue` | Single clickable thumbnail |
| `src/components/ImageOverlay.vue` | Full-screen overlay with previous/back/next buttons, Escape key support |
| `src/components/DayAcrossYears.vue` | Same day across all years, year labels in footer |

## Image URL pattern

```
https://objects.hbvu.su/blotpix/{year}/{month}/{day}.jpeg
```

- Year range: 2010 – current
- Month/day are zero-padded (e.g. `03`, `15`)

## Router (hash-based)

```js
createWebHashHistory()
routes:
  / → LandingPage
  /landing → LandingPage
  /day/:month/:day → DayAcrossYears
```

## Commands

```bash
npm install        # install dependencies
npm run serve      # dev server (vue-cli-service)
npm run build      # production build (outputs to dist/)
npm run lint       # lint with eslint
```

## Docker

- `Dockerfile` — multi-stage: node:20-alpine build → nginx:alpine serve
- Exposes port 80
- Build: `docker buildx build --platform linux/amd64 -t lucarv/365vue:latest --push .`

## Deployment

- **GitHub Actions:** `.github/workflows/build-deploy.yml` — triggers on push to `main`, builds and pushes to **GHCR** (`ghcr.io/xkogd66/hbvue:latest` + `:<sha>`), then rolls out to Kubernetes.
- **Kubernetes:** `kustomize/full.yaml` — Service (LoadBalancer on port 80) + Deployment (`hbvue`, container `hbvue`), namespace `webapps`, image `ghcr.io/xkogd66/hbvue:latest`.
  - Deployment uses `kubectl set image ... :${{ github.sha }}` (immutable per-commit tag) then `kubectl rollout status`.
  - Required repo secret: `KUBE_CONFIG_DATA` (base64-encoded kubeconfig).

## Security

Registry auth uses the built-in `GITHUB_TOKEN` (`secrets.GITHUB_TOKEN`) via `docker/login-action` — no hardcoded credentials. Kubernetes access uses the `KUBE_CONFIG_DATA` repo secret.

## PWA

The app is a Progressive Web App via `@vue/cli-plugin-pwa` (Workbox `GenerateSW`).

| Piece | Where |
|---|---|
| Config (`manifestOptions`, `workboxOptions`, runtime caching) | `vue.config.js` (`pwa` block) |
| Service-worker registration | `src/registerServiceWorker.js` (imported from `src/main.js`) |
| Icons | `public/img/icons/` (vector `icon.svg` + rendered 192/512, maskable, apple-touch, favicons) |
| Generated at build | `dist/manifest.json`, `dist/service-worker.js` |

- **Manifest:** name/short name `EKSKOG 365`, `display: standalone`, theme `#111827`.
- **Runtime caching:** app shell `NetworkFirst`; `objects.hbvu.su/blotpix/*` photos `CacheFirst` (30 days, 500 entries); cdnjs assets `StaleWhileRevalidate`.
- Registration only runs in production (`NODE_ENV === 'production'`).
- **Icon source of truth:** `public/img/icons/icon.svg` (vector). All raster icons
  plus `public/favicon.ico` are rendered from it by
  `scripts/generate-icons.js` (`node scripts/generate-icons.js`, needs
  `npm i -D sharp to-ico`). This replaced the old blurred icons that were upscaled
  from the 25x25 `src/assets/logo.png`. Edit `icon.svg`, re-run the script, and
  the PNGs/ICO regenerate deterministically.

## Path alias

`@/` → `src/`
