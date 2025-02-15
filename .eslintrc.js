module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Vue 3 推荐的 ESLint 配置
    'prettier', // 配合 Prettier 禁用与 Prettier 冲突的 ESLint 规则
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'vue/html-indent': ['warn', 2], // 设置 HTML 缩进为 2 个空格
    'vue/max-attributes-per-line': ['warn', { 'singleline': 3, 'multiline': 1 }],
    'vue/attributes-order': 'warn',
    'vue/first-attribute-linebreak': ['warn', 'always'],
    'vue/html-self-closing': ['warn', { 'html': { 'void': 'never' } }],
    // 根据需要调整更多规则
  }
}