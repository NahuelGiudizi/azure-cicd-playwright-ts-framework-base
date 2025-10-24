import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude Playwright test files from vitest
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/src/tests/api/**/*.spec.ts', // Exclude Playwright API spec files
      '**/src/tests/user-interface/**/*.spec.ts' // Exclude Playwright UI spec files
    ],
    // Only include our unit test files
    include: [
      'src/tests/unit/**/*.test.ts'
    ],
    environment: 'node',
    globals: true,
    // Ensure ES modules are used
    pool: 'forks'
  },
  esbuild: {
    target: 'node14'
  }
});
