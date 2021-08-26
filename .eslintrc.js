module.exports = {
  extends: ['standard-with-typescript', 'plugin:react-hooks/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: false }],
    'comma-dangle': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    'multiline-ternary': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
  },
}
