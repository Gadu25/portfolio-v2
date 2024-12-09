<template>
    <div class="nav-container" :class="scrolled ? 'scrolled':''">
        <div class="content">
            <ul>
                <li>
                    <NuxtLink to="/" @click="handleNavigation(0)">
                        <img  src="~/assets/images/memoji.webp" alt="my-memoji-icon"/>
                    </NuxtLink>
                </li>
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

<script setup>
    import ThemeToggle from '../components/common/themeToggle'

    const props = defineProps({
        isScrolled: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits();

    const navs = ref(
        [
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
    )

    let toggle = ref(false)
    const scrolled = ref(props.isScrolled)

    const handleNavigation = (index) => {
        let active = 0

        for(let i=0; i < navs.value.length; i++){
            if(navs.value[i].isActive == true){
                active = i
            }
        }

        let animation = active < index ? 'swipe-right' : 'swipe-left'
        
        for(let i=0; i < navs.value.length; i++){
            if(i == index){
                navs.value[i].isActive = true
            }else{
                navs.value[i].isActive = false
            }
        }
        if(toggle.value == true){
            toggle.value = !toggle.value
        }

        emit('navigate', animation);
    }

    watch(toggle, (newVal, oldVal) => {
        if (newVal === true) {
            scrolled.value = false;
        }
    });
</script>