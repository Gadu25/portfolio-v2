import { ref, onMounted } from 'vue'

type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = ref<Theme>('dark')

  onMounted(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light'
    theme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  return { theme, toggleTheme }
}
