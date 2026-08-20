import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig({
  files: ['src/**/*.ts'],

  ignores: ['node_modules/', 'dist/', 'eslint.config.mjs', 'eslint.config.ts'],

  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked, // Deep TypeScript analysis
    ...tseslint.configs.stylisticTypeChecked,   // Consistent TS formatting rules
  ],

  languageOptions: {
    parserOptions: {
      // This links ESLint to your TypeScript setup
      project: './tsconfig.json',
      tsconfigRootDir: process.cwd(),
    },
    globals: {
      ...globals.node,
    },
  },

  rules: {
    // Catch unused variables as hard compilation blockers
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-inferrable-types': ['error', {
      ignoreParameters: true, 
      ignoreProperties: false, // (Optional) set to true if you also want to allow it on class properties
    }],

    // Enforce type safety standards
    '@typescript-eslint/no-explicit-any': 'off',       // Disallows the 'any' escape hatch
    '@typescript-eslint/await-thenable': 'error',         // Prevents awaiting non-promises
    '@typescript-eslint/no-floating-promises': 'error',   // Forces handling of async errors
  },
});
