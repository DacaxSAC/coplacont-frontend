import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{
      find: '@',
      replacement: resolve(__dirname, './src')
    }, {
      find: /^(.+)\/pages$/,
      replacement: '$1/pages/_index'
    }],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['module', 'main', '_index', 'index'],
    preserveSymlinks: true,
    conditions: ['import', 'module', 'node'],
    dedupe: ['react', 'react-dom']
  }
})
