/** This file is for eslint configuration;
 *  for config rules, see https://eslint.org/docs/latest/use/configure/
 */

import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  { ignores: ['node_module/', 'bin', '.next'] },
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

  { files: ['backend/**/*.js'], 
    languageOptions: { sourceType: 'commonjs' } 
  },

  { files: ['frontend/**/*.jsx'], 
    languageOptions: { sourceType: 'module' } 
  },

  {
    files: ['backend/test/**/*.js'],
    languageOptions: {
      globals: globals.mocha, // mocha is a global variable
    },
  },
  // {files: ["**/*.jsx"], languageOptions: {sourceType: "module"}},
  {
    languageOptions: {
      // NOTES-FOR-DEVELOPER: global variables docs https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
      globals: globals.browser,
    },
  },
];
