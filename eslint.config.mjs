import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  { ignores: ['node_module/', 'bin', '.next'] },

  // Recommended basic configuration
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      'no-console': 'warn',
      'func-names': ['error', 'as-needed'],
      'func-name-matching': 'error',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'security/detect-object-injection': 'off',
      'react/prop-types': 'error', // open for React
    },
  },

  // Specify CommonJS for backend, and allow Node.js to use global variable
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // Include all global variable from Node.JS
        process: true,
        __dirname: true,
      },
    },
  },

  // Specify ES Modules for frontend TSX files
  {
    files: ['frontend/**/*.tsx'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  // Allow testing files to use Mocha global variables
  {
    files: ['backend/test/**/*.js', 'backend/test/**/*.mjs'],
    languageOptions: {
      globals: globals.mocha, // global variable in Mocha: e.g. describe, it
    },
  },

  // Allow browsers to user global variable
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];
