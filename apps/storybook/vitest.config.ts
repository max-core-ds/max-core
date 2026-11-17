import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Story tests (Phase 6): every story renders in Chromium and gets an axe scan
// (a11y rules + exceptions live in .storybook/preview.tsx and the stories).
// Runs the BUILT @max-core-ds/react, like Storybook — `pnpm build` first.
export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
