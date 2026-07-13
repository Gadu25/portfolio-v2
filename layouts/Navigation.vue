<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__container">
      <ul class="nav__links">
        <li>
          <NuxtLink to="/" @click="closeMobile">
            <img src="~/assets/images/memoji.webp" alt="my-memoji-icon" />
          </NuxtLink>
        </li>
        <li
          v-for="(nav, index) in navs"
          :key="nav.route"
          :class="{ active: route.path === nav.route }"
        >
          <NuxtLink :to="nav.route" @click="handleNavigation(index)">
            {{ nav.name }}
          </NuxtLink>
        </li>
      </ul>
      <div class="nav__burger">
        <div class="nav__toggle">
          <input
            id="menu-checkbox"
            type="checkbox"
            v-model="toggle"
          />
          <label class="nav__hamburger" for="menu-checkbox">
            <span class="nav__bar nav__bar--top" />
            <span class="nav__bar nav__bar--middle" />
            <span class="nav__bar nav__bar--bottom" />
          </label>
        </div>
      </div>
      <ThemeToggle class="nav__theme-toggle" />
    </div>
    <div class="nav__mobile" :class="{ active: toggle }">
      <ul>
        <li
          v-for="(nav, index) in navs"
          :key="nav.route"
          :class="{ active: route.path === nav.route }"
        >
          <NuxtLink :to="nav.route" @click="handleNavigation(index)">
            {{ nav.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/common/ThemeToggle.vue'

const props = defineProps<{
  isScrolled?: boolean
}>()

const emit = defineEmits<{
  navigate: [direction: string]
}>()

const route = useRoute()

const navs = [
  { name: 'Home', route: '/' },
  { name: 'Work', route: '/work' },
  { name: 'Projects', route: '/projects' },
]

const toggle = ref(false)
const scrolled = ref(props.isScrolled ?? false)

const currentIndex = computed(() => navs.findIndex(nav => nav.route === route.path))

const handleNavigation = (index: number) => {
  const direction = currentIndex.value < index ? 'swipe-right' : 'swipe-left'
  emit('navigate', direction)
  closeMobile()
}

const closeMobile = () => {
  if (toggle.value) {
    toggle.value = false
  }
}

watch(toggle, (newVal) => {
  if (newVal) {
    scrolled.value = false
  }
})
</script>
