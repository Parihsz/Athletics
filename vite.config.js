import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: 'src/client',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
      'fast-deep-equal': 'fast-deep-equal/es6/index.js'
    }
  }
})
