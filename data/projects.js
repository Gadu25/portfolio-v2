import storybook from '~/assets/images/tech/storybook.png'
import cypress from '~/assets/images/tech/cypress.png'
import quasar from '~/assets/images/tech/quasar.png'
import css from '~/assets/images/tech/css.png'
import bootstrap from '~/assets/images/tech/bootstrap.png'
import javascript from '~/assets/images/tech/javascript.png'
import laravel from '~/assets/images/tech/laravel.png'
import react from '~/assets/images/tech/react.png'
import mysql from '~/assets/images/tech/mysql.png'
import nodejs from '~/assets/images/tech/nodejs.png'
import nuxt from '~/assets/images/tech/nuxt.png'
import php from '~/assets/images/tech/php.png'
import postgresql from '~/assets/images/tech/postgresql.png'
import sass from '~/assets/images/tech/sass.png'
import tailwind from '~/assets/images/tech/tailwind.png'
import vue from '~/assets/images/tech/vue.png'

import catchThemAll from '~/assets/images/projects/catchThemAll.png'

export default [
    {
        name: 'CatchThemAll',
        previewImage: catchThemAll,
        url: 'https://catch-them-all-eta.vercel.app/',
        description: 'CatchTheMall is an interactive Pokémon-themed web application designed to provide users with an engaging experience of capturing and viewing various Pokémon. Built using Nuxt.js for server-side rendering, Tailwind CSS for a responsive layout, and SCSS for custom styling, this app offers a visually appealing and fluid user experience. The application allows users to browse, search, and filter through a collection of Pokémon while incorporating smooth, custom animations.',
        status: {
            title: 'ongoing development',
            color: '#FFA500'
        },
        techUsed: [
            {
                name: 'Nuxt',
                icon: nuxt
            },
            {
                name: 'Tailwind',
                icon: tailwind
            },
            {
                name: 'Javascript',
                icon: javascript
            },
            {
                name: 'NodeJS',
                icon: nodejs
            },
            {
                name: 'Sass',
                icon: sass
            }
        ]
    }
]