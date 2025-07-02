import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@components',
        replacement: path.resolve(__dirname, '../packages')
      },
      // Explicit mappings for each component
      {
        find: '@components/dropdown',
        replacement: path.resolve(__dirname, '../packages/Dropdown/src')
      },
      {
        find: '@components/record-audio',
        replacement: path.resolve(__dirname, '../packages/RecordAudio/src')
      }
    ]
  },
  build: {
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
