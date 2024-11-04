<template>
    <div class="nav-container" :class="isScrolled ? 'scrolled':''">
        <div class="content">
            <ul>
                <li v-for="(nav, index) of navs" :class="nav.isActive ? 'active':''">
                    <NuxtLink :to="nav.route" @click="handleNavigation(index)">{{ nav.name }}</NuxtLink>
                </li>
            </ul>
            <ThemeToggle/>
        </div> 
    </div>
</template>

<script>
    import ThemeToggle from '../components/common/themeToggle'
    export default {
        name: 'Navigation',
        components: {
            ThemeToggle,
        },
        data() {
            return {
                navs: [
                    {
                        'name': 'Home',
                        'route': '/',
                        'isActive': true
                    },
                    {
                        'name': 'Work',
                        'route': '/work',
                        'isActive': false
                    },
                    {
                        'name': 'Projects',
                        'route': '/projects',
                        'isActive': false
                    },
                ]
            }
        },
        methods: {
            handleNavigation(index) {
                let active = 0

                for(let i=0; i < this.navs.length; i++){
                    if(this.navs[i].isActive == true){
                        active = i
                    }
                }

                let animation = active < index ? 'swipe-right' : 'swipe-left'
            
                
                for(let i=0; i < this.navs.length; i++){
                    if(i == index){
                        this.navs[i].isActive = true
                    }else{
                        this.navs[i].isActive = false
                    }
                }

                this.$emit('navigate', animation);
            }
        },
        props:{
            isScrolled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>