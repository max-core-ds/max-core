import { defineConfig } from 'vitest/config';

// Behaviour tests (Phase 6): React Testing Library in jsdom, against the source.
// Rendering + axe for every story lives in apps/storybook (browser mode).
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    restoreMocks: true,
  },
});
