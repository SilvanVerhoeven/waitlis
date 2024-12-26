// https://nuxt.com/docs/api/configuration/nuxt-config
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const AuraBlue = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      400: '{blue.400}',
      300: '{blue.300}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

export default defineNuxtConfig({
  modules: ['@primevue/nuxt-module', '@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '/node_modules/primeflex/primeflex.css'],
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  primevue: {
    options: {
      theme: {
        preset: AuraBlue,
      },
    },
  },
})
