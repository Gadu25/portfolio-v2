import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('dark') // Default theme

  onMounted(() => {
    // Retrieve the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    theme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  })

  const toggleTheme = () => {
    // Toggle between light and dark themes
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  return { theme, toggleTheme }
}
