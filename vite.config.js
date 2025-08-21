import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      writeBundle() {
        try {
          const redirectsContent = readFileSync('public/_redirects', 'utf8')
          writeFileSync('dist/_redirects', redirectsContent)
        } catch (error) {
          console.log('_redirects file not found, skipping...')
        }
      }
    }
  ],
})
