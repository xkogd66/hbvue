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

- **GitHub Actions:** `.github/workflows/build-push.yml` — triggers on push to `main`, builds and pushes to Docker Hub as `lucarv/365vue:latest`
- **Kubernetes:** `kustomize/full.yaml` — Service (LoadBalancer on port 80) + Deployment, namespace `webapps`, image `lucarv/365vue:latest`

## ⚠️ Security

The GitHub workflow contains a **hardcoded Docker Hub password** in plain text (`lucaPWD4d0ck34`). Consider using GitHub Actions secrets instead.

## Path alias

`@/` → `src/`
