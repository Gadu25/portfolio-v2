<template>
    <div class="tech-stacks">
        <div class="content">
            <h3>Tech Experience</h3>
            <div class="tech-wrapper">
                <template v-for="tech in techs">
                    <div class="tech" data-aos="fade-up">
                        <a class="image-container hover-pointer" :href="tech.link" target="_blank"  :aria-label="'Visit '+ tech.name +'website'">
                            <img :src="tech.icon" :alt="tech.name+'-icon'"/>
                        </a>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
    import bootstrap from '~/assets/images/tech/bootstrap.webp'
    import javascript from '~/assets/images/tech/javascript.webp'
    import laravel from '~/assets/images/tech/laravel.webp'
    import mysql from '~/assets/images/tech/mysql.webp'
    import nodejs from '~/assets/images/tech/nodejs.webp'
    import nuxt from '~/assets/images/tech/nuxt.webp'
    import php from '~/assets/images/tech/php.webp'
    import postgresql from '~/assets/images/tech/postgresql.webp'
    import sass from '~/assets/images/tech/sass.webp'
    import tailwind from '~/assets/images/tech/tailwind.webp'
    import vue from '~/assets/images/tech/vue.webp'

    const techs = ref(
        [
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
    )
</script>