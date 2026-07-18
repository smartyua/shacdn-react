import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'ai',
          include: ['.ai/tests/**/*.test.ts'],
          environment: 'node',
          testTimeout: 30000,
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'ui',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          css: true,
          testTimeout: 15000,
        },
      },
    ],
  },
});
