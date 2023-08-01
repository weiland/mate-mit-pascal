import { sveltekit } from 'npm:@sveltejs/kit@^1.20.4/vite';
import { defineConfig } from 'npm:vite@^4.4.2';

import 'npm:svelte@^4.0.5'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sveltekit()]
})
