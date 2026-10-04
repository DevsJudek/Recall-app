import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Prompt for update
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true
      },
      // If you have a manifest.json in your public folder, VitePWA will automatically pick it up!
    })
  ],
})