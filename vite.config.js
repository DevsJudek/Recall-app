import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 🚀 Forces the app to update automatically
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true, // 🚀 Deletes old cached files
        clientsClaim: true,          // 🚀 Takes control of the app immediately
        skipWaiting: true            // 🚀 Forces the new update to activate immediately
      },
      // If you have a manifest.json in your public folder, VitePWA will automatically pick it up!
    })
  ],
})