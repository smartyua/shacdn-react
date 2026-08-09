import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SHACDN_BASE=/shacdn-assets/ when building for kylypko.com embed
const base = process.env.SHACDN_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    open: true,
  },
})
