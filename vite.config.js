import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Kapag naka-deploy sa subpath (e.g. GitHub Pages: username.github.io/REGULATORYDIVISIONSYSTEM/),
// i-set base sa '/REGULATORYDIVISIONSYSTEM/' para mag-load agad ang mga larawan at assets.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
})
