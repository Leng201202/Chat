import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    // Proxy only used for local development
  server:{
    port: 3000, // Set your desired port here (default is 5173)
    strictPort: true, // This will throw an error if the port is already in use
    proxy:{
      '/api': {
        target: 'https://chatkie.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
