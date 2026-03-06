import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs['flat/recommended-typescript'],
  {
    files: ['src/**/*.ts'],
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      // JSDoc requirements
      'jsdoc/require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          FunctionExpression: true,
          ArrowFunctionExpression: false,
        },
        contexts: [
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
        ],
      }],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns-description': 'error',

      // General quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      // Relax JSDoc and return types for tests
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', '*.config.*'],
  },
);
