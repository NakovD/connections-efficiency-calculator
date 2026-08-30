import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * Replaces the favicon link with an inlined data URI, so the standalone build
 * stays a single file with no sibling assets to carry around.
 */
function inlineFavicon(): Plugin {
  return {
    name: 'inline-favicon',
    enforce: 'post',
    transformIndexHtml(html) {
      const svg = readFileSync('public/favicon.svg', 'utf8')
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
      return html.replace(/href="\.?\/favicon\.svg"/, `href="${dataUri}"`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `--mode standalone` produces one self-contained HTML file that runs from
  // the filesystem. The default build is the multi-file one deployed to Pages.
  const standalone = mode === 'standalone'

  return {
    // Relative asset paths, so the build works under the GitHub Pages
    // project subpath (/connections-efficiency-calculator/) without hardcoding it,
    // and so the standalone file works over file:// too.
    base: './',
    plugins: [react(), ...(standalone ? [viteSingleFile(), inlineFavicon()] : [])],
    build: standalone
      ? {
          outDir: 'standalone',
          // Everything is inlined, so there is nothing to copy alongside it.
          copyPublicDir: false,
          emptyOutDir: true,
        }
      : {},
  }
})
