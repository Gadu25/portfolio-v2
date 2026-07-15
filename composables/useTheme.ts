import { ref, onMounted } from 'vue'

type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = ref<Theme>('dark')

  onMounted(() => {
    theme.value = (localStorage.getItem('theme') as Theme) || 'dark'
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  return { theme, toggleTheme }
}
