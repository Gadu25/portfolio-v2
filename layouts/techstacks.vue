<template>
    <section class="tech-stacks">
        <div class="content">
            <h3>Tech Experience</h3>
            <div class="tech-wrapper">
                <template v-for="tech in techs">
                    <div class="tech" data-aos="fade-up">
                        <a class="image-container hover-pointer" :href="tech.link" target="_blank">
                            <img :src="tech.icon" :alt="tech.name+'-icon'"/>
                        </a>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
    import bootstrap from '~/assets/images/tech/bootstrap.png'
    import javascript from '~/assets/images/tech/javascript.png'
    import laravel from '~/assets/images/tech/laravel.png'
    import mysql from '~/assets/images/tech/mysql.png'
    import nodejs from '~/assets/images/tech/nodejs.png'
    import nuxt from '~/assets/images/tech/nuxt.png'
    import php from '~/assets/images/tech/php.png'
    import postgresql from '~/assets/images/tech/postgresql.png'
    import sass from '~/assets/images/tech/sass.png'
    import tailwind from '~/assets/images/tech/tailwind.png'
    import vue from '~/assets/images/tech/vue.png'
    
    export default {
        name: 'TechStack',
        data() {
            return {
                techs: [
                    {
                        name: 'javascript',
                        icon: javascript,
                        link: 'https://www.javascript.com/'
                    },
                    {
                        name: 'vue',
                        icon: vue,
                        link: 'https://vuejs.org/'
                    },
                    {
                        name: 'nuxt',
                        icon: nuxt,
                        link: 'https://nuxt.com/'
                    },
                    {
                        name: 'sass',
                        icon: sass,
                        link: 'https://sass-lang.com/'
                    },
                    {
                        name: 'tailwind',
                        icon: tailwind,
                        link: 'https://tailwindcss.com/'
                    },
                    {
                        name: 'bootstrap',
                        icon: bootstrap,
                        link: 'https://getbootstrap.com/'
                    },
                    {
                        name: 'nodejs',
                        icon: nodejs,
                        link: 'https://nodejs.org/en'
                    },
                    {
                        name: 'php',
                        icon: php,
                        link: 'https://www.php.net/'
                    },
                    {
                        name: 'laravel',
                        icon: laravel,
                        link: 'https://laravel.com/'
                    },
                    {
                        name: 'mysql',
                        icon: mysql,
                        link: 'https://www.mysql.com/'
                    },
                    {
                        name: 'postgresql',
                        icon: postgresql,
                        link: 'https://www.postgresql.org/'
                    },
                ]
            }
        }
    }
</script>