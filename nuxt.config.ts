import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  pages: true,
  routeRules: {
    //'/dashboard/**': { ssr: false },
    '/account/**': { ssr: false },
    '/category/': { redirect: '/category/1' },
  },
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
      'composables/**'
    ]
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "https://ala.sahab-eng.ir/api/",
      // baseURL: "http://localhost:5124/api/",
    },
  },
  css: [],
  app: {
    head: {
      title: '',
      charset: 'utf-8',
      meta: [],
      link: [],
    }
  },
  build: {
    transpile: ['vuetify',
    ],
  },
  plugins: [
    { src: '~/plugins/swal', mode: 'client' },
    { src: '~/plugins/direction-control', mode: 'client' },
    { src: '~/plugins/datePicker.js', mode: 'client' },
    { src: '~/plugins/localStorage.js', mode: 'client' },
  ],
  modules: [

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    // '@nuxtjs/axios',
    // {
    //   locales: [
    //     {
    //       code: 'en',
    //       file: 'en.json',
    //       dir: 'ltr',
    //       name: 'English',
    //     },
    //     {
    //       code: 'fa',
    //       file: 'fa.json',
    //       dir: 'rtl',        // that will be passed to your app
    //       name: 'فارسی',
    //     },
    //   ],
    //   langDir: 'translations/',
    //   defaultLocale: 'fa',
    // },
  ],
  pinia: {
    storesDirs: ['./stores/**',
      'stores',
      'stores/*/index.{ts,js,mjs,mts}',
      'stores/**'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  nitro: {
    // IIS options default
    iis: {
      // merges in a pre-exisiting web.config file to the nitro default file
      mergeConfig: true,
      // overrides the default nitro web.config file all together
      overrideConfig: false,
    },
  },
});
