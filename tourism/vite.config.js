import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Match requests starting with /api (replace with your actual API prefix if different)
      '/api': {
        target: 'http://localhost:3001', // Replace with your backend's URL
        changeOrigin: true, // Needed for CORS handling
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix from request path
      },
    },
  },
})
