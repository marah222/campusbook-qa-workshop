import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules/**'],
    watch: false,
    coverage: {
      provider: 'v8',
      include: ['src/domain/**/*.ts'],
      exclude: ['src/domain/types.ts'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        lines: 85,
        statements: 80,
        functions: 80,
        branches: 75
      }
    }
  }
});
