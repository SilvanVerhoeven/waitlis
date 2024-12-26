// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  [
    ...pluginVue.configs['flat/recommended'],
    eslintConfigPrettier,
    {
      rules: {
        'vue/html-self-closing': 'warn',
        'vue/html-indent': ['warn', 2],
        'vue/multi-word-component-names': 'off',
        'vue/block-order': ['warn', { order: ['template', 'script', 'style'] }],
      },
    },
  ],
)
