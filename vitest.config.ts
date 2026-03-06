import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'test-results.junit.xml',
    },
  },
});
