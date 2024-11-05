<template>
    <div class="nav-container" :class="isScrolled ? 'scrolled':''">
        <div class="content">
            <ul>
                <li v-for="(nav, index) of navs" :class="nav.isActive ? 'active':''">
                    <NuxtLink :to="nav.route" @click="handleNavigation(index)">{{ nav.name }}</NuxtLink>
                </li>
            </ul>
            <div class="mobile-burger">
                <div id="menuToggle">
                    <input id="checkbox" type="checkbox" v-model="toggle">
                    <label class="toggle" for="checkbox">
                        <div class="bar bar--top"></div>
                        <div class="bar bar--middle"></div>
                        <div class="bar bar--bottom"></div>
                    </label>
                </div>
            </div>
            <ThemeToggle/>
        </div> 
        <div class="mobile-nav" :class="toggle == true ? 'active': ''">
            <ul>
                <li v-for="(nav, index) of navs" :class="nav.isActive ? 'active':''">
                    <NuxtLink :to="nav.route" @click="handleNavigation(index)">{{ nav.name }}</NuxtLink>
                </li>
            </ul>
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
                ],
                toggle: false
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
                this.toggle = !this.toggle
                
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