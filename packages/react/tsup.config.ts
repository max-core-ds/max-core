import { copyFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@base-ui/react', 'react-day-picker'],
  target: 'es2022',
  // Consumer Tailwind entry: `@source './'` makes their build scan dist/.
  onSuccess: async () => {
    await copyFile('src/styles.css', 'dist/styles.css');
  },
});
