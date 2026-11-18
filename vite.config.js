import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Le site est publié en tant que "project page" GitHub Pages
  // (https://<compte>.github.io/voyages-redux/), d'où ce sous-dossier de base.
  base: '/voyages-redux/',
  plugins: [react()],
})
