import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }: { command: string }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    // @cloudflare/vite-plugin causes "Error: write EOF" on Windows during dev mode (command === 'serve').
    // Enabling it only during build (command === 'build') ensures full Cloudflare production support.
    ...(command === 'build'
      ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
      : []),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}))
