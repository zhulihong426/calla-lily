import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/calla-lily/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        project: resolve(__dirname, 'project.html')
      }
    }
  }
});
