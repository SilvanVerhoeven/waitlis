// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    oauth: {
      // overwritten by respective .env variable
      github: {
        clientId: 'NUXT_OAUTH_GITHUB_CLIENT_ID',
        clientSecret: 'NUXT_OAUTH_GITHUB_CLIENT_SECRET',
        redirectURL: 'NUXT_OAUTH_GITHUB_REDIRECT_URI',
      },
    },
  },
  app: {
    head: {
      title: 'Waitlis',
      meta: [
        { name: 'description', content: 'Manage speaker lists live' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@ant-design-vue/nuxt',
    '@prisma/nuxt',
    'nuxt-auth-utils',
    '@pinia/nuxt',
  ],
  antd: {
    // Options
  },
  prisma: {
    generateClient: false,
  },
})
