import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // aceita conexões de qualquer interface, não só localhost
    port: 5173,
    open: false,
    strictPort: true,
    /* o vite recusa hosts que ele não conhece (proteção contra DNS rebinding).
       liberamos o domínio e qualquer subdomínio dele. */
    allowedHosts: ['zyzz.lol', '.zyzz.lol']
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: ['zyzz.lol', '.zyzz.lol']
  }
})
