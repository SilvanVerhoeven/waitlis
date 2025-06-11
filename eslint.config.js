// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    typescript: true,
    vue: true,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
    rules: {
      'antfu/top-level-function': 'off',
      'vue/no-multiple-template-root': 'off',
      'no-console': 'warn',
      'antfu/if-newline': ['off'],
      'nonblock-statement-body-position': ['warn', 'beside'],
      'node/prefer-global/process': 'off',
      'unicorn/prefer-number-properties': 'off',
      'no-restricted-globals': 'off',
    },
  }),
)
