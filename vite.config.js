import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Disable CSS minification entirely because xp.css has
    // legacy pseudo-element selectors that break lightningcss
    cssMinify: false,
  },
});
