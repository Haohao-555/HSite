module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 'off',
    'vue/no-mutating-props': 'off',
    'prefer-promise-reject-errors': 'off',
    'standard/no-callback-literal': 'off',
    indent: 'off',
    camelcase: 'off',
    curly: 'off'
  }
}
