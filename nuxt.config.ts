// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/css/main.scss'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: "Alex's Portfolio",
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'author', content: 'Alexander Udag' },
        { name: 'description', content: 'A portfolio showcasing my web development skills, projects, and experience.' },
        { name: 'keywords', content: 'web developer, portfolio, front-end, JavaScript, React, Vue, Laravel, HTML, CSS, Nuxt, Tailwind' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0070f3' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap' 
        },
        
      ]
    },
  },
})
