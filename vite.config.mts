import { defineConfig } from 'npm:vite@^4.0.0'
import { svelte } from 'npm:@sveltejs/vite-plugin-svelte@^2.0.0'

import 'npm:svelte@^3.54.0'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()]
})
