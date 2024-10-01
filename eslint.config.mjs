import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  { ignores: ['node_module/', 'bin', '.next'] },

  // 基本推荐配置
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // 通用规则配置，适用于所有 JavaScript 文件
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

  // 为后端代码指定 CommonJS，并允许使用 Node.js 的全局变量
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // 包含所有 Node.js 全局变量
        process: true,
        __dirname: true,
      },
    },
  },

  // 为前端的 JSX 文件指定 ES Modules
  {
    files: ['frontend/**/*.jsx'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  // 为测试文件指定 Mocha 的全局变量
  {
    files: ['backend/test/**/*.js', 'backend/test/**/*.mjs'], // 添加 .mjs 文件支持
    languageOptions: {
      globals: globals.mocha, // 启用 Mocha 全局变量，如 describe 和 it
    },
  },

  // 为浏览器环境指定全局变量
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];
