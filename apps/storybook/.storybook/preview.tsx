import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/global.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      // Story tests fail on axe violations; known ones are declared per story
      // (docs/a11y-exceptions.md, Phase 6.3).
      test: 'error',
      config: {
        // Colours are Figma-owned and tracked by `pnpm -F @max-core-ds/tokens contrast`.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
    options: {
      // Foundations (tokens) first, then the component tiers.
      storySort: {
        order: ['Foundations', 'Atoms', 'Molecules', 'Organisms'],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
