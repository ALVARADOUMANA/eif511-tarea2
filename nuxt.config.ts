export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/blog.css'],
  app: {
    head: {
      titleTemplate: '%s - Noticias Nacionales',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
