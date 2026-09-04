import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/SpeedReadingTrainer/',
  plugins: [react()],
  server: {
    proxy: {
      '/gutenberg': {
        target: 'https://www.gutenberg.org',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/gutenberg/, ''),
      },
    },
  },
})
