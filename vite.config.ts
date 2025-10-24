import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quizs } from './src/quizs/quizList';

// https://vite.dev/config/
export default defineConfig({
  root: './src',
  base: '/test_vue_page/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    rollupOptions: {
      input: {
        test: './src/index.html',
        main: './src/quizs/index.html',
        ...Object.fromEntries(quizs.map((q) => [q.key, `./src/quizs/${q.key}/index.html`])),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
