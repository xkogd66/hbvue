module.exports = {
  pwa: {
    name: 'EKSKOG 365',
    shortName: 'EKSKOG 365',
    description: 'Daily photos from the blotpix object store.',
    themeColor: '#111827',
    msTileColor: '#111827',
    backgroundColor: '#111827',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      // Point apple-touch-icon at the full 180x180 render (plugin default is 152).
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
    },
    manifestOptions: {
      name: 'EKSKOG 365',
      short_name: 'EKSKOG 365',
      description: 'Daily photos from the blotpix object store.',
      start_url: '.',
      display: 'standalone',
      background_color: '#111827',
      theme_color: '#111827',
      icons: [
        {
          src: 'img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: 'img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workboxOptions: {
      // Full offline-capable app shell; skip waiting so updates apply on reload.
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          // Cache the day/month/year canary page HTML (hash-router SPA).
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'app-shell',
            networkTimeoutSeconds: 5,
          },
        },
        {
          // Photos are immutable once published — serve cache-first.
          urlPattern: /^https:\/\/objects\.hbvu\.su\/blotpix\/.*\.(?:jpe?g|png|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'blotpix-photos',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // FontAwesome / CDN assets loaded from public/index.html.
          urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\//,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'cdn-assets',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
};
