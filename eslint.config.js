import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.agent-workflows/**',
      'local-agent-workflows-archive/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-hooks/set-state-in-effect': 'off',
        'no-unused-vars': ['warn', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
      }],
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        extraHOCs: ['wrap'],
      }],
    },
  },
  {
    files: ['tests/**/*.{js,jsx}', 'vitest.config.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
  {
    files: ['*.config.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
  },
];
