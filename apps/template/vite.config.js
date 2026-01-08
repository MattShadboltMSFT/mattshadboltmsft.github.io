import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mynewapp/', // UPDATE THIS to match your app name
  build: {
    outDir: '../../dist/mynewapp', // UPDATE THIS to match your app name
    emptyOutDir: true,
  },
  plugins: [react()],
})
