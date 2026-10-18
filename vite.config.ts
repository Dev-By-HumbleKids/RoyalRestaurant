import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/** Vendor chunks by package, so three.js stays out of the initial download (it is only needed by the 3D floor plan). */
function vendorChunk(id: string): string | undefined {
  // Rollup/Vite virtual helpers (preload, commonjs interop) must live in an always-loaded chunk,
  // otherwise they can land inside the three.js chunk and force it to be preloaded on every page.
  if (id.startsWith('\0vite/preload-helper') || id.startsWith('\0commonjsHelpers')) return 'react';
  if (!id.includes('node_modules')) return undefined;
  if (/node_modules\/(three|three-stdlib|@react-three|troika-|camera-controls|maath|meshline|stats-gl)/.test(id)) return 'three';
  if (/node_modules\/framer-motion|node_modules\/motion-/.test(id)) return 'motion';
  // zustand is shared by our stores and @react-three/fiber — keep it with React so it never drags three.js in.
  if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler|@remix-run|zustand|use-sync-external-store)\//.test(id)) return 'react';
  return undefined;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // three.js (~230 kB gzip) is isolated in its own chunk and only fetched when the 3D floor plan is shown.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: (id) => vendorChunk(id.replace(/\\/g, '/')),
      },
    },
  },
});
